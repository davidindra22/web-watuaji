import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";
import MySQLStore from "express-mysql-session";

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

app.use(
  cors({
    origin: "https://wisatawatuaji.com", // Ganti dengan URL front-end Anda
    credentials: true,
  })
);
// Mendapatkan file path dan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

// Serve index.html for all other routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "divarafu_watuaji",
  password: "oP?pZVGmuZsE",
  database: "divarafu_watuaji",
});

db.connect((err) => {
  if (err) {
    console.error("Error Connecting: " + err.stack);
    return;
  }
  console.log("connected as id :" + db.threadId);
});

// Konfigurasi penyimpanan sesi
const sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  db.promise()
);

app.use(
  session({
    key: "session_cookie_admin",
    secret: "7i<~4Zfwrk&KQ4t",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 jam
  })
);

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// endpoint login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error connecting to the database" });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Error comparing passwords" });
      }

      if (!isMatch) {
        console.log("Password mismatch for user:", username);
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        "secretkey",
        { expiresIn: "1h" }
      );
      req.session.user = user;
      console.log(`Login successful: ${user.username}`);
      res.json({ message: "Login successful", token });
    });
  });
});

// cek session
app.get("/api/check-session", (req, res) => {
  if (req.session.user) {
    res
      .status(200)
      .json({ message: "Session is active", user: req.session.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && req.session.user.id) {
    req.adminId = req.session.user.id;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// ambil data profil

app.get("/api/admin-profile", isAuthenticated, (req, res) => {
  const adminId = req.adminId; // The ID of the logged-in admin

  // Query to get admin info
  const adminQuery = "SELECT id, username FROM users WHERE id = ?";

  // Query to get background photos
  const backgroundQuery =
    "SELECT id, photo_path FROM assets WHERE admin_id = ?";

  // First, get admin data
  db.query(adminQuery, [adminId], (err, adminResult) => {
    if (err || adminResult.length === 0) {
      return res.status(500).json({ message: "Error fetching admin data" });
    }

    const adminProfile = {
      id: adminResult[0].id,
      username: adminResult[0].username,
      backgrounds: [],
    };

    // Then get background photos
    db.query(backgroundQuery, [adminId], (err, backgroundResult) => {
      if (err) {
        console.error("Error in background query:", err);
        return res
          .status(500)
          .json({ message: "Error fetching background photos" });
      }

      adminProfile.backgrounds = backgroundResult.map((row) => ({
        id: row.id,
        photo_path: row.photo_path,
      }));

      res.json(adminProfile);
    });
  });
});

// edit profil admin
app.put(
  "/api/admin-profile",
  isAuthenticated,
  upload.array("backgroundPhotos", 5),
  async (req, res) => {
    const { username, password } = req.body;
    const adminId = req.adminId; // Mendapatkan adminId dari middleware isAuthenticated

    // Log untuk melihat data yang diterima
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    try {
      // Hanya user dengan ID 1 yang dapat mengubah background
      if (adminId !== 1) {
        return res.status(403).json({
          message:
            "You do not have permission to change the background photos.",
        });
      }

      // Jika user ID 1, lanjutkan dengan proses update
      if (username) {
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE users SET username = ? WHERE id = ?",
            [username, adminId],
            (err) => {
              if (err) {
                return reject("Error updating username");
              }
              resolve();
            }
          );
        });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, adminId],
            (err) => {
              if (err) {
                return reject("Error updating password");
              }
              resolve();
            }
          );
        });
      }

      // Proses update background photos jika adminId === 1
      if (req.files && req.files.length > 0) {
        const backgroundPhotos = req.files;

        // Log untuk memastikan file diterima dengan benar
        console.log("Background photos to be updated:", backgroundPhotos);

        // Dapatkan jumlah background photos yang sudah ada di database
        const jumlahfoto = await new Promise((resolve, reject) => {
          db.query(
            "SELECT COUNT(*) AS count FROM assets WHERE admin_id = ?",
            [adminId],
            (err, results) => {
              if (err) return reject(err);
              resolve(results[0].count);
            }
          );
        });

        // Hitung total foto yang baru akan diupload dan foto yang sudah ada
        const totalPhotos = jumlahfoto + backgroundPhotos.length;
        if (totalPhotos > 5) {
          return res
            .status(400)
            .json({ message: "You can only have up to 5 background photos." });
        }

        // Insert photo baru tanpa menghapus yang lama
        const insertPhotoQuery =
          "INSERT INTO assets (admin_id, photo_path) VALUES (?, ?)";
        for (const file of backgroundPhotos) {
          await new Promise((resolve, reject) => {
            db.query(insertPhotoQuery, [adminId, file.filename], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        }
      }

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

//ambil data assets
app.get("/assets", (req, res) => {
  db.query("SELECT * FROM assets", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// hapus foto pada assets
app.delete("/assets/:id", isAuthenticated, async (req, res) => {
  const photoId = req.params.id;
  const adminId = req.adminId; // Mendapatkan adminId dari middleware isAuthenticated

  try {
    // Pastikan admin hanya bisa menghapus foto miliknya
    const photo = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, photo_path FROM assets WHERE admin_id = ?",
        [adminId],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            return reject("Photo not found or unauthorized access");
          }
          resolve(results[0]);
        }
      );
    });

    // Hapus foto dari database
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM assets WHERE id = ?", [photoId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: error });
  }
});

// mengambil view
const getPageViews = async () => {
  try {
    const query = `
      SELECT DATE(date) as date, COUNT(*) as totalViews
      FROM page_views
      GROUP BY DATE(date)
      ORDER BY DATE(date) ASC
    `;
    const [rows] = await db.promise().query(query);
    return rows;
  } catch (error) {
    console.error("Error in getPageViews:", error);
    throw error;
  }
};

const incrementPageViews = () => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO page_views (date, count) VALUES (NOW(), 1)";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error in incrementPageViews:", error);
        return reject(error);
      }
      resolve(results);
    });
  });
};

// Endpoint untuk mendapatkan semua rekaman page view yang dikelompokkan per hari
app.get("/api/page-views", async (req, res) => {
  try {
    const pageViews = await getPageViews();
    res.status(200).json(pageViews);
  } catch (error) {
    console.error("Error in /api/page-views:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// endpoint untuk menampilkan semua data pengunjung
app.get("/api/total-page-views", async (req, res) => {
  try {
    const query = "SELECT SUM(count) as totalViews FROM page_views";
    const [rows] = await db.promise().query(query);
    const totalViews = rows[0].totalViews;
    res.status(200).json({ totalViews });
  } catch (error) {
    console.error("Error in /api/total-page-views:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Endpoint untuk mencatat kunjungan baru
app.post("/api/page-views", async (req, res) => {
  try {
    await incrementPageViews();
    res.status(200).send("Page view incremented");
  } catch (error) {
    console.error("Error in /api/page-views POST:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ambil data reservasi
app.get("/reservasi", async (req, res) => {
  db.query("SELECT * FROM reservasi", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// menghitung data reservasi
const getBookingCount = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM reservasi", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
};

app.get("/api/booking/count", async (req, res) => {
  try {
    const count = await getBookingCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// update data reservasi
app.put("/reservasi/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { tanggal_reservasi, nama_reserv, nohp_reserv, keterangan } = req.body;

  db.query(
    "SELECT * FROM reservasi WHERE id_reservasi = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error fetching existing data:", err);
        return res.status(500).send(err);
      }

      const query = `
      UPDATE reservasi
      SET tanggal_reservasi = ?, nama_reserv = ?, nohp_reserv = ?, keterangan = ?
      WHERE id_reservasi = ?`; // Correct WHERE clause

      const values = [
        tanggal_reservasi,
        nama_reserv,
        nohp_reserv,
        keterangan,
        id,
      ]; // Add id to values

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).send(err);
        }
        res.json({ message: "Data reservasi berhasil diperbarui" });
      });
    }
  );
});

// hapus data reservasi
app.delete("/reservasi/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reservasi WHERE id_reservasi = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("booking not found");
    }
    res.status(200).send(`booking with id ${id} deleted`);
  });
});

// menambahkan data reservasi
app.post("/reservasi", isAuthenticated, (req, res) => {
  const { tanggal_reservasi, nama_reserv, nohp_reserv, keterangan } = req.body;

  if (!tanggal_reservasi || !nama_reserv || !nohp_reserv || !keterangan) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  const query = `
    INSERT INTO reservasi (tanggal_reservasi, nama_reserv, nohp_reserv, keterangan)
    VALUES (?, ?, ?, ?)
  `;
  const values = [tanggal_reservasi, nama_reserv, nohp_reserv, keterangan];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Gagal menyimpan data." });
    }
    res.json({
      message: "Data booking berhasil ditambahkan",
      id: result.insertId,
    });
  });
});

// wisata
// ambil data wisata
app.get("/wisata", (req, res) => {
  db.query("SELECT * FROM wisata", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.get("/top3", (req, res) => {
  db.query("SELECT * FROM wisata LIMIT 3", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.get("/wisata/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM wisata WHERE id_wisata = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      const wisata = result[0];
      wisata.foto_wisata = `/uploads/${wisata.foto_wisata1}`; // Mengatur URL gambar
      res.json(wisata);
    } else {
      res.status(404).send("UMKM not found");
    }
  });
});

// update data wisata
app.put(
  "/wisata/:id",
  isAuthenticated,
  upload.fields([
    { name: "foto1", maxCount: 1 },
    { name: "foto2", maxCount: 1 },
    { name: "foto3", maxCount: 1 },
    { name: "foto4", maxCount: 1 },
    { name: "foto5", maxCount: 1 },
  ]),

  (req, res) => {
    const { id } = req.params;
    const { nama, desc, singkat, tiket, no_hp } = req.body;

    // Get existing data
    db.query(
      "SELECT * FROM wisata WHERE id_wisata = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("Error fetching existing data:", err);
          return res.status(500).send(err);
        }

        const existingData = result[0];

        const foto1 = req.files.foto1
          ? req.files.foto1[0].filename
          : req.body.delete_foto1 === "true"
          ? null
          : existingData.foto_wisata1;
        const foto2 = req.files.foto2
          ? req.files.foto2[0].filename
          : req.body.delete_foto2 === "true"
          ? null
          : existingData.foto_wisata2;
        const foto3 = req.files.foto3
          ? req.files.foto3[0].filename
          : req.body.delete_foto3 === "true"
          ? null
          : existingData.foto_wisata3;
        const foto4 = req.files.foto4
          ? req.files.foto4[0].filename
          : req.body.delete_foto4 === "true"
          ? null
          : existingData.foto_wisata4;
        const foto5 = req.files.foto5
          ? req.files.foto5[0].filename
          : req.body.delete_foto5 === "true"
          ? null
          : existingData.foto_wisata5;

        const query = `
      UPDATE wisata
      SET nama_wisata = ?, desc_wisata = ?, singkat_wisata = ?, tiket_wisata = ?, nohp_wisata = ?, foto_wisata1 = ?, foto_wisata2 = ?, foto_wisata3 = ?, foto_wisata4 = ?, foto_wisata5 = ?
      WHERE id_wisata = ?
    `;

        const values = [
          nama,
          desc,
          singkat,
          tiket,
          no_hp,
          foto1,
          foto2,
          foto3,
          foto4,
          foto5,
          id,
        ];

        db.query(query, values, (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send(err);
          }
          res.json({
            message: "Data wisata berhasil diperbarui",
          });
        });
      }
    );
  }
);

// hapus data wisata
app.delete("/wisata/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM wisata WHERE id_wisata = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Wisata not found");
    }
    res.status(200).send(`Wisata with id ${id} deleted`);
  });
});

// menambahkan data wisata
app.post(
  "/wisata",
  isAuthenticated,
  upload.fields([
    { name: "foto1", maxCount: 1 },
    { name: "foto2", maxCount: 1 },
    { name: "foto3", maxCount: 1 },
    { name: "foto4", maxCount: 1 },
    { name: "foto5", maxCount: 1 },
  ]),

  (req, res) => {
    const { nama, desc, singkat, tiket, no_hp } = req.body;

    const foto1 = req.files.foto1 ? req.files.foto1[0].filename : null;
    const foto2 = req.files.foto2 ? req.files.foto2[0].filename : null;
    const foto3 = req.files.foto3 ? req.files.foto3[0].filename : null;
    const foto4 = req.files.foto4 ? req.files.foto4[0].filename : null;
    const foto5 = req.files.foto5 ? req.files.foto5[0].filename : null;

    const query = `
    INSERT INTO wisata (nama_wisata, desc_wisata, singkat_wisata, tiket_wisata, nohp_wisata, foto_wisata1, foto_wisata2, foto_wisata3, foto_wisata4, foto_wisata5)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      nama,
      desc,
      singkat,
      tiket,
      no_hp,
      foto1,
      foto2,
      foto3,
      foto4,
      foto5,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send(err);
      }
      res.json({
        message: "Data wisata berhasil ditambahkan",
        id: result.insertId,
      });
    });
  }
);

// Endpoint untuk mendapatkan jumlah data wisata
const getWisataCount = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM wisata", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
};

app.get("/api/wisata/count", async (req, res) => {
  try {
    const count = await getWisataCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// UMKM
// ambil data umkm
app.get("/umkm", (req, res) => {
  db.query("SELECT * FROM umkm", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.get("/top3umkm", (req, res) => {
  db.query("SELECT * FROM umkm LIMIT 3", (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.get("/umkm/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM umkm WHERE id_umkm = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      const umkm = result[0];
      umkm.foto_umkm = `/uploads/${umkm.foto_umkm1}`; // Mengatur URL gambar
      res.json(umkm);
    } else {
      res.status(404).send("UMKM not found");
    }
  });
});

// Endpoint untuk mendapatkan jumlah data UMKM
const getUmkmCount = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM umkm", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
};

app.get("/api/umkm/count", async (req, res) => {
  try {
    const count = await getUmkmCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// hapus data wisata
app.delete("/umkm/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM umkm WHERE id_umkm = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Umkm not found");
    }
    res.status(200).send(`Umkm with id ${id} deleted`);
  });
});

// menambahkan data umkm
app.post(
  "/umkm",
  isAuthenticated,
  upload.fields([
    { name: "fotoumkm1", maxCount: 1 },
    { name: "fotoumkm2", maxCount: 1 },
    { name: "fotoumkm3", maxCount: 1 },
    { name: "fotoumkm4", maxCount: 1 },
    { name: "fotoumkm5", maxCount: 1 },
  ]),

  (req, res) => {
    const { nama, desc, singkat, harga, no_hp } = req.body;

    const fotoumkm1 = req.files.fotoumkm1
      ? req.files.fotoumkm1[0].filename
      : null;
    const fotoumkm2 = req.files.fotoumkm2
      ? req.files.fotoumkm2[0].filename
      : null;
    const fotoumkm3 = req.files.fotoumkm3
      ? req.files.fotoumkm3[0].filename
      : null;
    const fotoumkm4 = req.files.fotoumkm4
      ? req.files.fotoumkm4[0].filename
      : null;
    const fotoumkm5 = req.files.fotoumkm5
      ? req.files.fotoumkm5[0].filename
      : null;

    const query = `
    INSERT INTO umkm (nama_umkm, desc_umkm, singkat_umkm, harga_umkm, no_hpumkm, foto_umkm1, foto_umkm2, foto_umkm3, foto_umkm4, foto_umkm5)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      nama,
      desc,
      singkat,
      harga,
      no_hp,
      fotoumkm1,
      fotoumkm2,
      fotoumkm3,
      fotoumkm4,
      fotoumkm5,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send(err);
      }
      res.json({
        message: "Data wisata berhasil ditambahkan",
        id: result.insertId,
      });
    });
  }
);

// update data umkm
app.put(
  "/umkm/:id",
  isAuthenticated,
  upload.fields([
    { name: "fotoumkm1", maxCount: 1 },
    { name: "fotoumkm2", maxCount: 1 },
    { name: "fotoumkm3", maxCount: 1 },
    { name: "fotoumkm4", maxCount: 1 },
    { name: "fotoumkm5", maxCount: 1 },
  ]),

  (req, res) => {
    const { id } = req.params;
    const { nama, desc, singkat, harga, no_hp } = req.body;

    // Get existing data
    db.query("SELECT * FROM umkm WHERE id_umkm = ?", [id], (err, result) => {
      if (err) {
        console.error("Error fetching existing data:", err);
        return res.status(500).send(err);
      }

      const existingData = result[0];

      const fotoumkm1 = req.files.fotoumkm1
        ? req.files.fotoumkm1[0].filename
        : req.body.delete_fotoumkm1 === "true"
        ? null
        : existingData.foto_umkm1;
      const fotoumkm2 = req.files.fotoumkm2
        ? req.files.fotoumkm2[0].filename
        : req.body.delete_fotoumkm2 === "true"
        ? null
        : existingData.foto_umkm2;
      const fotoumkm3 = req.files.fotoumkm3
        ? req.files.fotoumkm3[0].filename
        : req.body.delete_fotoumkm3 === "true"
        ? null
        : existingData.foto_umkm3;
      const fotoumkm4 = req.files.fotoumkm4
        ? req.files.fotoumkm4[0].filename
        : req.body.delete_fotoumkm4 === "true"
        ? null
        : existingData.foto_umkm4;
      const fotoumkm5 = req.files.fotoumkm5
        ? req.files.fotoumkm5[0].filename
        : req.body.delete_fotoumkm5 === "true"
        ? null
        : existingData.foto_umkm5;

      const query = `
      UPDATE umkm
      SET nama_umkm = ?, desc_umkm = ?, singkat_umkm = ?, harga_umkm = ?, no_hpumkm = ?,  foto_umkm1 = ?, foto_umkm2 = ?, foto_umkm3 = ?, foto_umkm4 = ?, foto_umkm5 = ?
      WHERE id_umkm = ?
    `;

      const values = [
        nama,
        desc,
        singkat,
        harga,
        no_hp,
        fotoumkm1,
        fotoumkm2,
        fotoumkm3,
        fotoumkm4,
        fotoumkm5,
        id,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).send(err);
        }
        res.json({
          message: "Data umkm berhasil diperbarui",
        });
      });
    });
  }
);

// berita
// Endpoint untuk mendapatkan daftar berita
app.get("/berita", (req, res) => {
  db.query(
    "SELECT * FROM berita ORDER BY dibuat_berita DESC",
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    }
  );
});

// app.get("/assets", (req, res) => {
//   db.query("SELECT * FROM assets", (err, result) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.json(result);
//   });
// });

app.get("/berita/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM berita WHERE id_berita = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      const berita = result[0];
      berita.foto_berita = `/uploads/${berita.foto1_berita}`; // Mengatur URL gambar
      res.json(berita);
    } else {
      res.status(404).send("berita not found");
    }
  });
});

// app.get("/assets/:id_berita", (req, res) => {
//   const { id_berita } = req.params;

//   const query = "SELECT * FROM assets WHERE id_berita = ?";
//   db.query(query, [id_berita], (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error", details: err });
//     }
//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No assets found for this id_berita" });
//     }
//     res.json(result);
//   });
// });

// Endpoint untuk menambahkan berita baru
app.post(
  "/berita",
  isAuthenticated,
  upload.fields([
    { name: "foto1_berita", maxCount: 1 },
    { name: "foto2_berita", maxCount: 1 },
    { name: "foto3_berita", maxCount: 1 },
    { name: "foto4_berita", maxCount: 1 },
    { name: "foto5_berita", maxCount: 1 },
  ]),
  (req, res) => {
    const { judul, desc1, desc2, desc3, desc4, desc5, penulis } = req.body;

    const foto1_berita = req.files.foto1_berita
      ? req.files.foto1_berita[0].filename
      : null;
    const foto2_berita = req.files.foto2_berita
      ? req.files.foto2_berita[0].filename
      : null;
    const foto3_berita = req.files.foto3_berita
      ? req.files.foto3_berita[0].filename
      : null;
    const foto4_berita = req.files.foto4_berita
      ? req.files.foto4_berita[0].filename
      : null;
    const foto5_berita = req.files.foto5_berita
      ? req.files.foto5_berita[0].filename
      : null;

    const query = `INSERT INTO berita (judul_berita, 
    desc1_berita, 
    desc2_berita, 
    desc3_berita, 
    desc4_berita, 
    desc5_berita, 
    foto1_berita, 
    foto2_berita, 
    foto3_berita, 
    foto4_berita, 
    foto5_berita, 
    penulis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const beritaValues = [
      judul,
      desc1,
      desc2,
      desc3,
      desc4,
      desc5,
      foto1_berita,
      foto2_berita,
      foto3_berita,
      foto4_berita,
      foto5_berita,
      penulis,
    ];

    db.query(query, beritaValues, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send(err);
      }
      res.json({
        message: "Data Berita berhasil ditambahkan",
        id: result.insertId,
      });
    });
  }
);

// Endpoint untuk mengedit berita
app.put(
  "/berita/:id",
  isAuthenticated,
  upload.fields([
    { name: "foto1_berita", maxCount: 1 },
    { name: "foto2_berita", maxCount: 1 },
    { name: "foto3_berita", maxCount: 1 },
    { name: "foto4_berita", maxCount: 1 },
    { name: "foto5_berita", maxCount: 1 },
  ]),
  (req, res) => {
    const { id } = req.params;
    const { judul, desc1, desc2, desc3, desc4, desc5, penulis } = req.body;

    db.query(
      "SELECT * FROM berita WHERE id_berita = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("Error fetching existing data:", err);
          return res.status(500).send(err);
        }

        const existingData = result[0];

        const foto_berita1 = req.files.foto1_berita
          ? req.files.foto1_berita[0].filename
          : req.body.delete_foto1_berita === "true"
          ? null
          : existingData.foto1_berita;
        const foto_berita2 = req.files.foto2_berita
          ? req.files.foto2_berita[0].filename
          : req.body.delete_foto2_berita === "true"
          ? null
          : existingData.foto2_berita;
        const foto_berita3 = req.files.foto3_berita
          ? req.files.foto3_berita[0].filename
          : req.body.delete_foto3_berita === "true"
          ? null
          : existingData.foto3_berita;
        const foto_berita4 = req.files.foto4_berita
          ? req.files.foto4_berita[0].filename
          : req.body.delete_foto4_berita === "true"
          ? null
          : existingData.foto4_berita;
        const foto_berita5 = req.files.foto5_berita
          ? req.files.foto5_berita[0].filename
          : req.body.delete_foto5_berita === "true"
          ? null
          : existingData.foto5_berita;

        const updateQuery = `UPDATE berita SET judul_berita = ?,
        desc1_berita = ?, desc2_berita = ?, desc3_berita = ?, desc4_berita = ?, desc5_berita = ?,
        foto1_berita = ?, foto2_berita = ?, foto3_berita = ?, foto4_berita = ?, foto5_berita = ?,
        penulis = ?
        WHERE id_berita = ?`;

        const values = [
          judul,
          desc1,
          desc2,
          desc3,
          desc4,
          desc5,
          foto_berita1,
          foto_berita2,
          foto_berita3,
          foto_berita4,
          foto_berita5,
          penulis,
          id,
        ];

        db.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send(err);
          }
          res.json({ message: "Berita berhasil diupdate", id_berita: id });
        });
      }
    );
  }
);

// Endpoint untuk menghapus berita
app.delete("/berita/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM berita WHERE id_berita = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "Berita berhasil dihapus" });
  });
});

// Endpoint untuk mendapatkan jumlah data berita
const getBeritaCount = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM berita", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
};

app.get("/api/berita/count", async (req, res) => {
  try {
    const count = await getBeritaCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});
