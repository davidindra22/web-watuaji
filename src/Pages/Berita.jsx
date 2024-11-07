import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BeritaPage = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); // Mulai dengan 4 berita lainnya

  useEffect(() => {
    axios
      .get(`https://api.wisatawatuaji.com/berita`)
      .then((response) => {
        setBerita(response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the data!", err);
        setError(err);
      });
  }, [id]);

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  if (!berita) {
    return <div>Data tidak ada</div>;
  }

  const maxLength = 250; // Batas panjang karakter yang ingin ditampilkan

  const truncateText = (text, maxLength) => {
    if (!text || typeof text !== "string") {
      return ""; // Mengembalikan string kosong jika text tidak valid
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + ".....";
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Tambah 4 berita setiap kali tombol diklik
  };

  return (
    <div className="berita-page">
      <div className="berita min-vh-100" style={{ paddingTop: "100px" }}>
        <Container className="box-berita d-flex flex-column align-items-center">
          <Row>
            <Col>
              <h1 className="fw-bold text-center animate__animated animate__fadeInUp animate__delay-1s">
                Berita Menarik Untuk Di Baca
              </h1>
              <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">
                Dapatkan informasi terbaru seputar kegiatan dan perkembangan
                Desa Watu Aji.
              </p>
            </Col>
          </Row>
          <Row>
            {berita.length > 0 ? (
              berita.slice(0, visibleCount).map((item, index) => (
                <article
                  className="animate__animated animate__fadeInUp animate__delay-1s"
                  style={{ margin: "20px 0" }}
                  key={item.id || index}
                >
                  <h2>
                    <Link to={`/detailBerita/${item.id_berita}`}>
                      {item.judul_berita}
                    </Link>
                  </h2>
                  <p>
                    {item.penulis} -
                    {new Date(item.dibuat_berita).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="img-berita-page">
                    <Link to={`/detailBerita/${item.id_berita}`}>
                      <img
                        src={`https://api.wisatawatuaji.com/uploads/${item.foto1_berita}`}
                        alt={item.judul_berita}
                      />
                    </Link>
                  </div>
                  <div className="entry-excerpt">
                    <p>{truncateText(item.desc1_berita, maxLength)}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="alert-berita text-center p-5 animate__animated animate__fadeInUp">
                <h3>Tidak ada Berita</h3>
              </div>
            )}
          </Row>
          {/* Tampilkan tombol "Load More" jika berita lebih dari 4 dan belum semua ditampilkan */}
          {berita.length > 4 && visibleCount < berita.length && (
            <div className="text-center mt-4">
              <button onClick={handleLoadMore} className="btn btn-primary">
                Load More
              </button>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default BeritaPage;
