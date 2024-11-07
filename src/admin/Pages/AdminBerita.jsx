import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Modal, Container } from "react-bootstrap";

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [addItem, setAddItem] = useState(null);
  const [files, setFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState(["", "", "", "", ""]);
  const [photoDescriptions, setPhotoDescriptions] = useState([
    { photo: null, description: "" },
  ]);

  const [deletePhotos, setDeletePhotos] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [formData, setFormData] = useState({
    judul: "",
    desc1: "",
    desc2: "",
    desc3: "",
    desc4: "",
    desc5: "",
    foto: ["", "", "", "", ""],
    penulis: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/berita", { withCredentials: true })
      .then((response) => {
        setBeritaList(response.data);
      });
  }, []);

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      id: item.id_berita,
      judul: item.judul_berita,
      desc1: item.desc1_berita,
      desc2: item.desc2_berita,
      desc3: item.desc3_berita,
      desc4: item.desc4_berita,
      desc5: item.desc5_berita,
      foto: [
        item.foto1_berita,
        item.foto2_berita,
        item.foto3_berita,
        item.foto4_berita,
        item.foto5_berita,
      ],
      penulis: item.penulis,
    });
    // Set existing photos to be displayed
    setExistingPhotos([
      item.foto1_berita || "",
      item.foto2_berita || "",
      item.foto3_berita || "",
      item.foto4_berita || "",
      item.foto5_berita || "",
    ]);
    setShowEditModal(true);
  };

  const handleAddClick = (item) => {
    setAddItem(item);
    setFormData({
      id: "",
      judul: "",
      desc1: "",
      desc2: "",
      desc3: "",
      desc4: "",
      desc5: "",
      foto: ["", "", "", "", ""],
      penulis: "",
    });
    setExistingPhotos([""]); // Hanya memulai dengan satu foto kosong
    setPhotoDescriptions([""]);
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
          `https://api.wisatawatuaji.com/berita/${itemToDelete.id_berita}`,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setBeritaList(
            beritaList.filter(
              (item) => item.id_berita !== itemToDelete.id_berita
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  // edit item
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("judul", formData.judul);
    formDataToSend.append("desc1", formData.desc1);
    formDataToSend.append("desc2", formData.desc2);
    formDataToSend.append("desc3", formData.desc3);
    formDataToSend.append("desc4", formData.desc4);
    formDataToSend.append("desc5", formData.desc5);
    formDataToSend.append("penulis", formData.penulis);

    // Append new photo only if it exists
    files.forEach((file, index) => {
      if (file) {
        formDataToSend.append(`foto${index + 1}_berita`, file);
      }
    });

    // Append delete flags
    deletePhotos.forEach((deleteFlag, index) => {
      formDataToSend.append(`delete_foto${index + 1}_berita`, deleteFlag);
    });

    try {
      await axios.put(
        `https://api.wisatawatuaji.com/berita/${formData.id}`,
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
        judul: "",
        desc1: "",
        desc2: "",
        desc3: "",
        desc4: "",
        desc5: "",
        penulis: "",
        foto: ["", "", "", "", ""],
      });
      setDeletePhotos([false, false, false, false, false]);
      setFiles([]);
      setShowEditModal(false);
      axios
        .get("https://api.wisatawatuaji.com/berita", { withCredentials: true })
        .then((response) => {
          setBeritaList(response.data);
        });
    } catch (error) {
      console.error("There was an error updating the data!", error);
    }
  };

  // manambahkan item
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("judul", formData.judul);
    formDataToSend.append("desc1", formData.desc1);
    formDataToSend.append("desc2", formData.desc2);
    formDataToSend.append("desc3", formData.desc3);
    formDataToSend.append("desc4", formData.desc4);
    formDataToSend.append("desc5", formData.desc5);
    formDataToSend.append("penulis", formData.penulis);

    if (files[0]) formDataToSend.append("foto1_berita", files[0]);
    if (files[1]) formDataToSend.append("foto2_berita", files[1]);
    if (files[2]) formDataToSend.append("foto3_berita", files[2]);
    if (files[3]) formDataToSend.append("foto4_berita", files[3]);
    if (files[4]) formDataToSend.append("foto5_berita", files[4]);

    try {
      await axios.post("https://api.wisatawatuaji.com/berita", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // Reset form and state
      setFormData({
        id: "",
        judul: "",
        desc1: "",
        desc2: "",
        desc3: "",
        desc4: "",
        desc5: "",
        foto: ["", "", "", "", ""],
        penulis: "",
      });
      setFiles([]);
      setShowAddModal(false);
      axios
        .get("https://api.wisatawatuaji.com/berita", { withCredentials: true })
        .then((response) => {
          setBeritaList(response.data);
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
  const currentItems = beritaList.slice(indexOfFirstItem, indexOfLastItem);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
    setFormData({
      id: "",
      judul: "",
      desc1: "",
      desc2: "",
      desc3: "",
      desc4: "",
      desc5: "",
      foto: ["", "", "", "", ""],
      penulis: "",
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      id: "",
      judul: "",
      desc1: "",
      desc2: "",
      desc3: "",
      desc4: "",
      desc5: "",
      foto: ["", "", "", "", ""],
      penulis: "",
    });
  };

  const maxPhotos = 5;
  const handleAddPhotoDescription = () => {
    if (photoDescriptions.length < maxPhotos) {
      setPhotoDescriptions([
        ...photoDescriptions,
        { photo: null, description: "" },
      ]);
    } else {
      alert("Maksimal 5 foto saja");
    }
  };

  const handleRemovePhotoDescription = (index) => {
    const updatedPhotos = [...photoDescriptions];
    updatedPhotos.splice(index, 1); // Remove the field at the given index
    setPhotoDescriptions(updatedPhotos);
  };

  const handlePhotoChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleDescriptionChange = (e, index) => {
    const updatedPhotos = [...photoDescriptions];
    updatedPhotos[index].description = e.target.value;
    setPhotoDescriptions(updatedPhotos);
  };
  const maxLength = 100; // Batas panjang karakter yang ingin ditampilkan

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <Container fluid>
        <div className="edit-berita">
          <div className="d-flex justify-content-between align-items-center">
            <h2>BERITA</h2>
            <Button variant="primary" onClick={handleAddClick}>
              Tambah Berita
            </Button>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul berita</th>
                  <th>Deskripsi</th>
                  <th>Foto</th>
                  <th>Penulis</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id_berita}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{item.judul_berita}</td>
                    <td>{truncateText(item.desc1_berita, maxLength)}</td>
                    <td>
                      {[
                        item.foto1_berita,
                        item.foto2_berita,
                        item.foto3_berita,
                        item.foto4_berita,
                        item.foto5_berita,
                      ]
                        .filter((foto) => foto)
                        .map((foto, idx) => (
                          <div key={idx}>
                            <img
                              src={`https://api.wisatawatuaji.com/uploads/${foto}`}
                              alt={item.judul_berita}
                              width="100"
                            />
                            <br />
                          </div>
                        ))}
                    </td>
                    <td>{item.penulis}</td>
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
              Apakah Anda yakin ingin menghapus berita "
              {itemToDelete && itemToDelete.judul_berita}"?
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
              <Modal.Title>Edit Berita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>judul berita</label>
                  <input
                    type="text"
                    className="form-control"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Foto 1</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto1_berita"
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
                  {existingPhotos[0] && <p>Nama file : {existingPhotos[0]}</p>}
                  {deletePhotos[0] && <p>Foto akan dihapus</p>}
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    className="form-control"
                    name="desc1"
                    value={formData.desc1}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 2</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto2_berita"
                      onChange={(e) => handleFileChange(e, 1)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleDeletePhoto(0)}
                    >
                      Hapus
                    </button>
                  </div>
                  {existingPhotos[1] && <p>Nama file : {existingPhotos[1]}</p>}
                  {deletePhotos[1] && <p>Foto akan dihapus</p>}
                </div>
                <div className="form-group">
                  <label>Deskripsi 2</label>
                  <textarea
                    className="form-control"
                    name="desc2"
                    value={formData.desc2}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 3</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto3_berita"
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
                  {existingPhotos[2] && <p>Nama file : {existingPhotos[2]}</p>}
                  {deletePhotos[2] && <p>Foto akan dihapus</p>}
                </div>
                <div className="form-group">
                  <label>Deskripsi 3</label>
                  <textarea
                    className="form-control"
                    name="desc3"
                    value={formData.desc3}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 4</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto4_berita"
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
                  {existingPhotos[3] && <p>Nama file : {existingPhotos[3]}</p>}
                  {deletePhotos[3] && <p>Foto akan dihapus</p>}
                </div>
                <div className="form-group">
                  <label>Deskripsi 4</label>
                  <textarea
                    className="form-control"
                    name="desc4"
                    value={formData.desc4}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Foto 5</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      name="foto5_berita"
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
                  {existingPhotos[4] && <p>Nama file : {existingPhotos[4]}</p>}
                  {deletePhotos[4] && <p>Foto akan dihapus</p>}
                </div>
                <div className="form-group">
                  <label>Deskripsi 5</label>
                  <textarea
                    className="form-control"
                    name="desc5"
                    value={formData.desc5}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>penulis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="penulis"
                    value={formData.penulis}
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
              <Modal.Title>Tambah Berita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>Judul Berita</label>
                  <input
                    type="text"
                    className="form-control"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Render dinamis input foto dan deskripsi */}
                {photoDescriptions.map((photo, index) => (
                  <div key={index} className="form-group">
                    <label>Foto {index + 1}</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        name={`foto${index + 1}_berita`}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleRemovePhotoDescription(index)}
                      >
                        Hapus
                      </button>
                    </div>
                    {existingPhotos[index] && (
                      <p>Nama file: {existingPhotos[index]}</p>
                    )}
                    <div className="form-group">
                      <label>Deskripsi Foto {index + 1}</label>
                      <textarea
                        className="form-control"
                        name={`desc${index + 1}`}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                  </div>
                ))}

                {/* Tombol untuk menambah input foto dan deskripsi */}
                {photoDescriptions.length < maxPhotos && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddPhotoDescription}
                  >
                    Tambah Foto
                  </button>
                )}

                <div className="form-group">
                  <label>Penulis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="penulis"
                    value={formData.penulis}
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
                length: Math.ceil(beritaList.length / itemsPerPage),
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

export default AdminBerita;
