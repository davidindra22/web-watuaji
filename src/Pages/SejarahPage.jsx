import { Container, Row, Col } from "react-bootstrap";

const SejarahPage = () => {
  return (
    <div className="sejarah-page">
      <div className="sejarah min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="fw-bold text-center animate__animated animate__fadeInUp ">
                Sejarah Desa Watu Aji
              </h1>
              <p className="text-center animate__animated animate__fadeInUp ">
                Sejarah yang sangat menarik untuk di baca dari desa watu aji
              </p>
            </Col>
          </Row>
          <Row className="content py-5">
            <Col
              className="img-sej1"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="1500"
            >
              <img src="/assets/img/sejarah/sejarah_1.jpg" alt="sejarah" />
            </Col>
            <Col
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="900"
            >
              <p>
                Sejarah Desa Watuaji, Kecamatan Keling, Kabupaten Jepara memang
                terbilang unik. Nama Watuaji berasal dari dua kata yaitu watu
                dan aji dalam bahasa Indonesia berarti batu dan berharga.
                Dinamai Watuaji yang berarti batu berharga karena di desa ini
                terdapat peningalan-peninggalan batu pada masa prasejarah yang
                terletak disekitar daerah aliran Sungai Pedot. Dari bebatuan
                tersebut ada yang menyerupai tembok, di mana masayarakat
                setempat menyebutnya dengan watu gebyok. Ada yang menyerupai
                tiang penyangga rumah yang disebut dengan watu soko, tumpukan
                batu menjadi batu tumpuk, ada juga yang menyerupai payung, dan
                sebagainya.
              </p>
            </Col>
          </Row>
          <Row className="content py-5">
            <Col data-aos="zoom-in" data-aos-duration="800">
              <p>
                Sampai saat ini, peninggalan-peninggalan tersebut masih bisa
                dilihat di desa ini dan masih utuh. Tetapi sampai saat ini belum
                ada penelitian lebih lanjut tentang peninggalan tersebut.
                Kejelasan tentang apakah batu-batu tersebut merupakan reruntuhan
                candi atau peningalan zaman batu masih membuat banyak pertanyaan
                masyarakat hingga saat ini. Muncul lah beberapa teori dari para
                penduduk setempat mengenai batu-batu tersebut. Pertama, menurut
                cerita turun-temurun yang berkembang di sini batu-batu tersebut
                merupakan bagian dari peninggalan kisah wali songo di Kerajaan
                Demak. Kedua, kemungkinan didasarkan pada kedekatan antara Desa
                Watuaji dan Kerajaan Kalingga yang mana masih dalam satu
                Kecamatan. Tetapi Kerajaan Kalingga sendiri seperti hanya
                dongeng karena kerajaan tersebut seperti hilang ditelan bumi.
              </p>
            </Col>
            <Col className="img-sej2" data-aos="zoom-in" data-aos-duration="800">
              <img src="/assets/img/sejarah/sejarah.jpg" alt="sejarah" />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SejarahPage;
