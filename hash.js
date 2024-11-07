import { createConnection } from 'mysql';
import { hash as _hash } from 'bcrypt';
const saltRounds = 10;

// Konfigurasi koneksi database Anda
const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'desa_watuaji'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');

  // Ambil semua pengguna dari database
  const query = 'SELECT id, username, password FROM users';
  db.query(query, (err, results) => {
    if (err) throw err;

    results.forEach((user) => {
      // Hash password yang ada
      _hash(user.password, saltRounds, (err, hash) => {
        if (err) throw err;

        // Update password yang sudah di-hash ke database
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [hash, user.id], (err, result) => {
          if (err) throw err;
          console.log(`Password for user ${user.username} has been hashed`);
        });
      });
    });
  });
});
