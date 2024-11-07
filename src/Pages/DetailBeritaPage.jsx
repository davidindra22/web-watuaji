import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Carousel } from "react-bootstrap";

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [error, setError] = useState(null);
  const [beritaList, setBeritaList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // Mulai dengan 4 berita lainnya

  useEffect(() => {
    axios
      .get(`https://api.wisatawatuaji.com/berita/${id}`)
      .then((response) => {
        setBerita(response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching the data!", err);
        setError(err);
      });

    axios
      .get("https://api.wisatawatuaji.com/berita")
      .then((response) => {
        setBeritaList(response.data);
      })
      .catch((err) => {
        console.error("There was an error fetching all berita!", err);
      });
  }, [id]);

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  if (!berita || beritaList.length === 0) {
    return <div>Data tidak ada</div>;
  }

  const photos = [
    berita.foto1_berita,
    berita.foto2_berita,
    berita.foto3_berita,
    berita.foto4_berita,
    berita.foto5_berita,
  ].filter((foto) => foto);

  const currentIndex = beritaList.findIndex(
    (b) => b.id_berita === parseInt(id)
  );

  const handleNext = () => {
    if (currentIndex < beritaList.length - 1) {
      const nextBerita = beritaList[currentIndex + 1];
      if (nextBerita && nextBerita.id_berita) {
        navigate(`/detailBerita/${nextBerita.id_berita}`);
      } else {
        console.error("ID berita berikutnya tidak ditemukan.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousBerita = beritaList[currentIndex - 1];
      if (previousBerita && previousBerita.id_berita) {
        navigate(`/detailBerita/${previousBerita.id_berita}`);
      } else {
        console.error("ID berita sebelumnya tidak ditemukan.");
      }
    }
  };

  const shareOnFacebook = () => {
    const url = `https://api.wisatawatuaji.com/berita/${id}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    const messageUrl = `${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      messageUrl
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const messageUrl = `${window.location.href}`;
    const tweetText = `Check out this link: ${encodeURIComponent(messageUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, "_blank");
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Tambah 4 berita setiap kali tombol diklik
  };

  return (
    <div style={{ backgroundColor: "#f6f8fd", paddingBottom: "50px" }}>
      <header
        className="detail-berita d-flex align-items-center overflow-hidden"
        style={{
          backgroundImage: `url("https://api.wisatawatuaji.com/uploads/${berita.foto1_berita}")`,
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "25rem",
          marginBottom: "3rem",
        }}
      >
        <Container>
          <Row className="detail-berita-box d-flex justify-content-center pt-lg-5">
            <Col lg="8" className="text-center">
              <h1
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {berita.judul_berita}
              </h1>
              <p style={{ color: "white" }}>
                {berita.penulis} -
                {new Date(berita.dibuat_berita).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Col>
          </Row>
        </Container>
      </header>
      <div className="content-berita d-flex flex-column">
        {berita.desc1_berita.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <img
          src={`https://api.wisatawatuaji.com/uploads/${berita.foto2_berita}`}
          alt=""
          className="mb-3"
        />

        {berita.desc2_berita.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <img
          src={`https://api.wisatawatuaji.com/uploads/${berita.foto3_berita}`}
          alt=""
          className="mb-3"
        />
        {berita.desc3_berita.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <img
          src={`https://api.wisatawatuaji.com/uploads/${berita.foto4_berita}`}
          alt=""
          className="mb-3"
        />
        {berita.desc4_berita.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <img
          src={`https://api.wisatawatuaji.com/uploads/${berita.foto5_berita}`}
          alt=""
          className="mb-3"
        />
        {berita.desc5_berita.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <div className="box-carousel">
          <Carousel className="custom-carousel">
            {photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={`https://api.wisatawatuaji.com/uploads/${photo}`}
                  alt={`Slide ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        {/* share */}
        <Container className="share-berita mt-4">
          <Row>
            <Col>
              <p style={{ marginBottom: "0px" }}>Share :</p>
            </Col>
            <Col className="medsos">
              <Link onClick={shareOnFacebook}>
                <i className="fa-brands fa-facebook"></i>
              </Link>
              <Link onClick={shareOnWhatsApp}>
                <i className="fa-brands fa-whatsapp"></i>
              </Link>
              <Link onClick={shareOnTwitter}>
                <i className="fa-brands fa-twitter"></i>
              </Link>
            </Col>
          </Row>
        </Container>
        {/* texy */}
        <p>Kabar lainnya</p>
        <Container className="berita-lainnya">
          <Row className="row-cols-1 row-cols-sm-2 row-gap-5">
            {beritaList.length > 0 ? (
              beritaList
                .filter((item) => item.id_berita !== parseInt(id)) // Berita yang sedang dilihat tidak muncul
                .slice(0, visibleCount) // Batasi jumlah berita yang ditampilkan berdasarkan visibleCount
                .map((item) => (
                  <Col key={item.id_berita}>
                    <div className="lainnya-content">
                      <Link to={`/detailBerita/${item.id_berita}`}>
                        <img
                          src={`https://api.wisatawatuaji.com/uploads/${item.foto1_berita}`}
                          alt={item.judul_berita}
                        />
                      </Link>
                      <p>
                        <Link to={`/detailBerita/${item.id_berita}`}>
                          {item.judul_berita}
                        </Link>
                      </p>
                    </div>
                  </Col>
                ))
            ) : (
              <div className="alert-berita text-center p-5">
                <h3>Tidak ada berita</h3>
              </div>
            )}
          </Row>

          {/* Tampilkan tombol "Load More" jika berita lebih dari 4 dan belum semua ditampilkan */}
          {beritaList.length > 4 && visibleCount < beritaList.length && (
            <div className="text-center mt-4">
              <button onClick={handleLoadMore} className="btn btn-primary">
                Load More
              </button>
            </div>
          )}
        </Container>

        {/* Next and Previous navigation */}
        <Container className="post-navigation">
          <Row>
            <Col>
              {currentIndex < beritaList.length - 1 && (
                <a onClick={handleNext} style={{ cursor: "pointer" }}>
                  <Row>
                    <Col className="previous">
                      <i className="fa fa-angle-double-left"></i>
                      <div className="text-left">
                        <p>Sebelumnya</p>
                        <p>{beritaList[currentIndex + 1]?.judul_berita}</p>
                      </div>
                    </Col>
                  </Row>
                </a>
              )}
            </Col>
            <Col>
              {currentIndex > 0 && (
                <a onClick={handlePrevious} style={{ cursor: "pointer" }}>
                  <Row>
                    <Col className="next">
                      <div className="text-right">
                        <p>Selanjutnya</p>
                        <p>{beritaList[currentIndex - 1]?.judul_berita}</p>
                      </div>
                      <i className="fa fa-angle-double-right"></i>
                    </Col>
                  </Row>
                </a>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DetailBerita;
