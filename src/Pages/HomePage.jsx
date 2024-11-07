import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomePage = () => {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const [wisataList, setWisataList] = useState([]);
  const [UmkmList, setUmkmList] = useState([]);
  const [berita, setBerita] = useState([]);
  let navigate = useNavigate();

  // ambil data foto bg
  useEffect(() => {
    // Fetch photos from the backend
    axios
      .get("https://api.wisatawatuaji.com/assets")
      .then((response) => setCarouselPhotos(response.data))
      .catch((error) =>
        console.error("Error fetching carousel photos:", error)
      );
  }, []);

  // ambil data wisata
  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/top3")
      .then((response) => {
        // Transform data to fit the structure you expect
        const transformedWisata = response.data.map((item, index) => ({
          id: item.id_wisata,
          image: `https://api.wisatawatuaji.com/uploads/${item.foto_wisata1}`, //untuk menampilkan gambar sesaui dengan data base
          star1: "fa fa-star",
          star2: "fa fa-star",
          star3: "fa fa-star",
          star4: "fa fa-star",
          star5: "fa fa-star",
          title: item.nama_wisata, // Adjust based on your actual data fields
          singkat: item.singkat_wisata,
          price: item.tiket_wisata, // Adjust based on your actual data fields
          buy: "Lihat Detail", // Adjust as needed
          delay: index * 100,
        }));
        setWisataList(transformedWisata);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // ambil data umkm
  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/top3umkm")
      .then((response) => {
        // Transform data to fit the structure you expect
        const transformedUmkm = response.data.map((item, index) => ({
          id: item.id_umkm,
          image: `https://api.wisatawatuaji.com/uploads/${item.foto_umkm1}`, // Adjust based on your actual data fields
          star1: "fa fa-star",
          star2: "fa fa-star",
          star3: "fa fa-star",
          star4: "fa fa-star",
          star5: "fa fa-star",
          title: item.nama_umkm, // Adjust based on your actual data fields
          singkat: item.singkat_umkm,
          price: item.harga_umkm, // Adjust based on your actual data fields
          buy: "Lihat Detail", // Adjust as needed
          delay: index * 100,
        }));
        setUmkmList(transformedUmkm);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // ambil data berita
  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/berita")
      .then((response) => {
        // Transform data to fit the structure you expect
        const transformedBerita = response.data.map((item) => ({
          id: item.id_berita,
          title: item.judul_berita,
          image: `https://api.wisatawatuaji.com/uploads/${item.foto1_berita}`,
          desc: item.desc_berita,
          time: item.dibuat_berita,
          createdBy: item.penulis,
        }));
        setBerita(transformedBerita);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // mengubah waktu di berita
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  // mengubah ke nominal uang
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="homepage" id="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden position-relative">
        <Container fluid>
          {/* Bagian Teks Tetap */}
          <Row className="header-box d-flex justify-content-center pt-lg-5 position-absolute translate-middle text-white">
            <Col className="header-content text-center g-0">
              <h1 className="mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                <span>SELAMAT DATANG</span> <br />
                <span>DI WEBSITE WISATA DESA WATU AJI</span>
              </h1>
              <p className="mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                Temukan pesona alam yang memukau di sini. Ayo, rencanakan
                perjalananmu dan nikmati pengalaman berlibur yang tak terlupakan
                di destinasi menakjubkan ini.
              </p>
              <button
                className="btn btn-danger btn-lg rounded-1 me-2 mb-xs-0 mb-2 animate__animated animate__fadeInUp animate__delay-1s"
                onClick={() =>
                  document
                    .getElementById("wisata")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Jelajahi Sekarang
              </button>
            </Col>
          </Row>

          {/* Bagian Carousel */}
          <Row>
            <Col className="g-0" lg="12">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={carouselPhotos.length > 1}
                autoplay={{
                  delay: 3000, // (1000ms = 1 detik)
                  disableOnInteraction: false, // Autoplay tetap berjalan meskipun ada interaksi
                }}
                // navigation={carouselPhotos.length > 1}
                // pagination={{ clickable: false }}
                className="vh-min-100"
              >
                {carouselPhotos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="carousel-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Warna hitam transparan
                        zIndex: 1,
                      }}
                    ></div>

                    <div
                      className="carousel-slide min-vh-100"
                      style={{
                        backgroundImage: `url("https://api.wisatawatuaji.com/uploads/${photo.photo_path}")`,
                        backgroundSize: "cover",
                        backgroundcolor: "rgba(0, 0, 0, 0.5)",
                        backgroundPosition: "center",
                        width: "auto",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Wisata */}
      <div id="wisata" className="wisata w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 id="listwisata" className="text-center fw-bold">
                DESTINASI DESA WISATA WATU AJI
              </h1>
              <p className="text-center">mau pergi kemana?</p>
            </Col>
          </Row>
          <Row>
            {wisataList.length > 0 ? (
              wisataList.map((wisata) => (
                <Col
                  key={wisata.id}
                  className="shadow rounded"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={wisata.delay}
                  style={{ backgroundColor: "white" }}
                >
                  <img
                    src={wisata.image}
                    alt={wisata.title}
                    className="mb-3 mt-3 rounded"
                  />
                  <div className="star mb-2 px-3">
                    <i className={wisata.star1}></i>
                    <i className={wisata.star2}></i>
                    <i className={wisata.star3}></i>
                    <i className={wisata.star4}></i>
                    <i className={wisata.star5}></i>
                  </div>
                  <h5 className="mb-1 px-3">{wisata.title}</h5>
                  <p className="px-3">{wisata.singkat}</p>
                  <div className="ket d-flex justify-content-between align-items-center px-3 pb-3">
                    <p className="m-0 text-primary fw-bold">
                      {formatRupiah(wisata.price)}
                    </p>
                    <button
                      className="btn btn-danger rounded-1"
                      onClick={() => navigate(`/detail/${wisata.id}`)}
                    >
                      {wisata.buy}
                    </button>
                  </div>
                </Col>
              ))
            ) : (
              <div className="alert-berita text-center p-5">
                <h3>Tidak ada Wisata</h3>
              </div>
            )}
          </Row>
          <Row>
            <Col className="text-center">
              <button
                className="btn btn-success rounded-5 btn-lg"
                onClick={() => navigate("/wisata")}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                Lihat Semua Wisata{" "}
                <i className="fa-solid fa-chevron-right ms-1"></i>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* UMKM */}
      <div className="umkm">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold">UMKM DESA WATU AJI</h1>
              <p className="text-center mb-5">
                Temukan keunikan produk lokal mereka dan jadikan kunjungan Anda
                berarti dengan mendukung usaha-usaha kecil di sini. Ayo, datang
                dan kenali ragam UMKM yang menawarkan produk kreatif dan
                berkualitas{" "}
              </p>
            </Col>
          </Row>
          <Row>
            {UmkmList.length > 0 ? (
              UmkmList.map((umkm) => (
                <Col
                  key={umkm.id}
                  className="shadow rounded"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={umkm.delay}
                  style={{ backgroundColor: "white" }}
                >
                  <img
                    src={umkm.image}
                    alt="unsplash.com"
                    className="mb-3 mt-3 rounded"
                  />
                  <div className="star mb-2 px-3">
                    <i className={umkm.star1}></i>
                    <i className={umkm.star2}></i>
                    <i className={umkm.star3}></i>
                    <i className={umkm.star4}></i>
                    <i className={umkm.star5}></i>
                  </div>
                  <h5 className="mb-1 px-3">{umkm.title}</h5>
                  <p className="px-3">{umkm.singkat}</p>
                  <div className="ket d-flex justify-content-between align-items-center px-3 pb-3">
                    <p className="m-0 text-primary fw-bold">
                      {formatRupiah(umkm.price)} /pack
                    </p>
                    <button
                      className="btn btn-danger rounded-1"
                      onClick={() => navigate(`/detailUmkm/${umkm.id}`)}
                    >
                      {umkm.buy}
                    </button>
                  </div>
                </Col>
              ))
            ) : (
              <div className="alert-berita text-center p-5">
                <h3>Tidak ada UMKM</h3>
              </div>
            )}
          </Row>
          <Row>
            <Col className="text-center">
              <button
                className="btn btn-success rounded-5 btn-lg"
                onClick={() => navigate("/umkm")}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                Lihat Semua Wisata
                <i className="fa-solid fa-chevron-right ms-1"></i>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Berita */}
      <div className="berita py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold ">Berita</h1>
              <p className="text-center mb-5 ">
                Dapatkan informasi terbaru seputar kegiatan dan perkembangan
                Desa Watu Aji.
              </p>
            </Col>
          </Row>
          <Row>
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                992: {
                  slidesPerView: 2,
                  spaceBetween: 50,
                },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              modules={[Pagination]}
              className="mySwiper"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {berita.length > 0 ? (
                berita.map((item) => (
                  <SwiperSlide key={item.id} className="shadow-sm">
                    <img src={item.image} alt={item.title} />
                    <div className="box-desc">
                      <h3>
                        <Link to={`/detailBerita/${item.id}`}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="tgl-pub">
                      <p>
                        {item.createdBy} - {formatDateTime(item.time)}
                      </p>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="alert-berita text-center p-5">
                  <h3>Tidak ada berita</h3>
                </div>
              )}
            </Swiper>
          </Row>
          <Row>
            <Col className="text-center">
              <button
                className="btn btn-success rounded-5 btn-lg"
                onClick={() => navigate("/berita")}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                Lihat Semua Berita{" "}
                <i className="fa-solid fa-chevron-right ms-1"></i>
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
