import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Modal, Container } from "react-bootstrap";

const AdminWisata = () => {
  const [wisataList, setWisataList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [files, setFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState(["", "", "", "", ""]);
  const [deletePhotos, setDeletePhotos] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    desc: "",
    singkat: "",
    no: "",
    foto: ["", "", "", "", ""],
    tiket: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/wisata", { withCredentials: true })
      .then((response) => {
        setWisataList(response.data);
      });
  }, []);

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      id: item.id_wisata,
      nama: item.nama_wisata,
      desc: item.desc_wisata,
      singkat: item.singkat_wisata,
      no: item.nohp_wisata,
      foto: [
        item.foto_wisata1,
        item.foto_wisata2,
        item.foto_wisata3,
        item.foto_wisata4,
        item.foto_wisata5,
      ],
      tiket: item.tiket_wisata,
    });
    // Set existing photos to be displayed
    setExistingPhotos([
      item.foto_wisata1 || "",
      item.foto_wisata2 || "",
      item.foto_wisata3 || "",
      item.foto_wisata4 || "",
      item.foto_wisata5 || "",
    ]);

    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      id: "",
      nama: "",
      desc: "",
      singkat: "",
      no: "",
      foto: ["", "", "", "", ""],
      tiket: "",
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      axios
        .delete(
          `https://api.wisatawatuaji.com/wisata/${itemToDelete.id_wisata}`,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setWisataList(
            wisataList.filter(
              (item) => item.id_wisata !== itemToDelete.id_wisata
            )
          );
          setShowDeleteModal(false);
          setItemToDelete(null);
        })
        .catch((error) => {
          console.error("There was an error deleting the data!", error);
        });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Memastikan hanya angka yang diperbolehkan dan panjang tidak lebih dari 16 karakter
    if (name === "no") {
      if (/^\+?\d*$/.test(value) && value.length <= 16) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleDeletePhoto = (index) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus foto ini?"
    );

    if (confirmed) {
      const updatedDeletePhotos = [...deletePhotos];
      updatedDeletePhotos[index] = true;
      setDeletePhotos(updatedDeletePhotos);

      // Jika foto dihapus, kosongkan dari existing photos
      const newExistingPhotos = [...existingPhotos];
      newExistingPhotos[index] = "";
      setExistingPhotos(newExistingPhotos);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("desc", formData.desc);
    formDataToSend.append("singkat", formData.singkat);
    formDataToSend.append("tiket", formData.tiket);
    formDataToSend.append("no_hp", formData.no);

    // Append new photos only
    files.forEach((file, index) => {
      if (file) {
        formDataToSend.append(`foto${index + 1}`, file);
      }
    });

    // Append delete flags
    deletePhotos.forEach((deleteFlag, index) => {
      formDataToSend.append(`delete_foto${index + 1}`, deleteFlag);
    });

    try {
      await axios.put(
        `https://api.wisatawatuaji.com/wisata/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      // setEditItem(null);
      setFormData({
        id: "",
        nama: "",
        desc: "",
        singkat: "",
        no: "",
        foto: ["", "", "", "", ""],
        tiket: "",
      });
      setDeletePhotos([false, false, false, false, false]);
      setFiles([]);
      setShowEditModal(false);
      axios
        .get("https://api.wisatawatuaji.com/wisata", { withCredentials: true })
        .then((response) => {
          setWisataList(response.data);
        });
    } catch (error) {
      console.error("There was an error updating the data!", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("desc", formData.desc);
    formDataToSend.append("singkat", formData.singkat);
    formDataToSend.append("tiket", formData.tiket);
    formDataToSend.append("no_hp", formData.no);

    if (files[0]) formDataToSend.append("foto1", files[0]);
    if (files[1]) formDataToSend.append("foto2", files[1]);
    if (files[2]) formDataToSend.append("foto3", files[2]);
    if (files[3]) formDataToSend.append("foto4", files[3]);
    if (files[4]) formDataToSend.append("foto5", files[4]);

    try {
      await axios.post("https://api.wisatawatuaji.com/wisata", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setFormData({
        id: "",
        nama: "",
        desc: "",
        singkat: "",
        no: "",
        foto: ["", "", "", "", ""],
        tiket: "",
      });
      setFiles([]);
      setShowAddModal(false);
      axios
        .get("https://api.wisatawatuaji.com/wisata", { withCredentials: true })
        .then((response) => {
          setWisataList(response.data);
        });
    } catch (error) {
      console.error("There was an error adding the data!", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wisataList.slice(indexOfFirstItem, indexOfLastItem);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
    setFormData({
      id: "",
      nama: "",
      desc: "",
      singkat: "",
      no: "",
      foto: ["", "", "", "", ""],
      tiket: "",
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      id: "",
      nama: "",
      desc: "",
      singkat: "",
      no: "",
      foto: ["", "", "", "", ""],
      tiket: "",
    });
  };

  // convert ke rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // kontrol panjang text
  const maxLength = 100;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <Container fluid>
        <div className="edit-wisata">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Wisata</h2>
            <Button variant="primary" onClick={handleAddClick}>
              Tambah Wisata
            </Button>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Wisata</th>
                  <th>Deskripsi</th>
                  <th>Deskripsi Singkat</th>
                  <th>Foto</th>
                  <th>No. Hp</th>
                  <th>Tiket</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id_wisata}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{item.nama_wisata}</td>
                    <td>{truncateText(item.desc_wisata, maxLength)}</td>
                    <td>{item.singkat_wisata}</td>
                    <td>
                      {[
                        item.foto_wisata1,
                        item.foto_wisata2,
                        item.foto_wisata3,
                        item.foto_wisata4,
                        item.foto_wisata5,
                      ]
                        .filter((foto) => foto)
                        .map((foto, idx) => (
                          <div key={idx} className="img-wisata">
                            <img
                              src={`https://api.wisatawatuaji.com/uploads/${foto}`}
                              alt={item.nama_wisata}
                              width="100"
                            />
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>{item.nohp_wisata}</td>
                    <td>{formatRupiah(item.tiket_wisata)}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(item)}
                        className="ml-2"
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
            <Modal.Header closeButton>
              <Modal.Title>Konfirmasi Hapus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Apakah Anda yakin ingin menghapus wisata "
              {itemToDelete && itemToDelete.nama_wisata}"?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteCancel}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Hapus
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showEditModal}
            onHide={handleCloseEditModal}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Wisata</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Wisata</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    className="form-control"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi Singkat</label>
                  <textarea
                    className="form-control"
                    name="singkat"
                    value={formData.singkat}
                    onChange={handleChange}
                    maxLength={"220"}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 1</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto1"
                      onChange={(e) => handleFileChange(e, 0)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(0)}
                    >
                      Hapus
                    </button>
                  </div>
                  {/* Tampilkan nama file foto yang ada */}
                  {existingPhotos[0] && <p>Nama file: {existingPhotos[0]}</p>}

                  {/* Indikasi jika foto akan dihapus */}
                  {deletePhotos[0] && <p>Foto akan dihapus</p>}
                </div>

                <div className="form-group">
                  <label>Foto 2</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto2"
                      onChange={(e) => handleFileChange(e, 1)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(1)}
                    >
                      Hapus
                    </button>
                  </div>
                  {existingPhotos[1] && <p>Nama file: {existingPhotos[1]}</p>}

                  {deletePhotos[1] && <p>Foto akan dihapus</p>}
                </div>

                <div className="form-group">
                  <label>Foto 3</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto3"
                      onChange={(e) => handleFileChange(e, 2)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(2)}
                    >
                      Hapus
                    </button>
                  </div>
                  {existingPhotos[2] && <p>Nama file: {existingPhotos[2]}</p>}

                  {deletePhotos[2] && <p>Foto akan dihapus</p>}
                </div>

                <div className="form-group">
                  <label>Foto 4</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto4"
                      onChange={(e) => handleFileChange(e, 3)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(3)}
                    >
                      Hapus
                    </button>
                  </div>
                  {existingPhotos[3] && <p>Nama file: {existingPhotos[3]}</p>}

                  {deletePhotos[3] && <p>Foto akan dihapus</p>}
                </div>

                <div className="form-group">
                  <label>Foto 5</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto5"
                      onChange={(e) => handleFileChange(e, 4)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(4)}
                    >
                      Hapus
                    </button>
                  </div>
                  {existingPhotos[4] && <p>Nama file: {existingPhotos[4]}</p>}

                  {deletePhotos[4] && <p>Foto akan dihapus</p>}
                </div>

                <div className="form-group">
                  <label>No. Hp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="no"
                    value={formData.no}
                    onChange={handleChange}
                    maxLength="16"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Harga Tiket</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tiket"
                    value={formData.tiket}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button variant="primary" type="submit">
                  Simpan
                </Button>
              </form>
            </Modal.Body>
          </Modal>

          <Modal
            show={showAddModal}
            onHide={handleCloseAddModal}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Tambah Wisata</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>Nama Wisata</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    className="form-control"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi Singkat</label>
                  <textarea
                    className="form-control"
                    name="singkat"
                    value={formData.singkat}
                    onChange={handleChange}
                    maxLength={"255"}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 1</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto1"
                    onChange={(e) => handleFileChange(e, 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 2</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto2"
                    onChange={(e) => handleFileChange(e, 1)}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 3</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto3"
                    onChange={(e) => handleFileChange(e, 2)}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 4</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto4"
                    onChange={(e) => handleFileChange(e, 3)}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 5</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto5"
                    onChange={(e) => handleFileChange(e, 4)}
                  />
                </div>
                <div className="form-group">
                  <label>No. Hp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="no"
                    defaultValue="+62"
                    value={formData.nohp_wisata}
                    onChange={handleChange}
                    maxLength="16"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Harga Tiket</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tiket"
                    value={formData.tiket}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button variant="primary" type="submit">
                  Tambah
                </Button>
              </form>
            </Modal.Body>
          </Modal>

          <div className="d-flex justify-content-center">
            <Pagination>
              {Array.from({
                length: Math.ceil(wisataList.length / itemsPerPage),
              }).map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminWisata;
