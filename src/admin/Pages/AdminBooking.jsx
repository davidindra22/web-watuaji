import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Modal, Container } from "react-bootstrap";

const AdminBooking = () => {
  const [bookingList, setBookingList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    tanggal: "",
    nama: "",
    no: "",
    keterangan: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/reservasi", { withCredentials: true })
      .then((response) => {
        setBookingList(response.data);
      });
  }, []);

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      id: item.id_reservasi,
      tanggal: item.tanggal_reservasi ? item.tanggal_reservasi : "", // Ensure a valid date or empty string
      nama: item.nama_reserv,
      no: item.nohp_reserv,
      keterangan: item.keterangan,
    });
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      id: "",
      tanggal: "",
      nama: "",
      no: "",
      keterangan: "",
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
          `https://api.wisatawatuaji.com/reservasi/${itemToDelete.id_reservasi}`,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setBookingList(
            bookingList.filter(
              (item) => item.id_reservasi !== itemToDelete.id_reservasi
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(formData.tanggal)
      .toISOString()
      .split("T")[0];

    const dataToSend = {
      tanggal_reservasi: formattedDate,
      nama_reserv: formData.nama,
      nohp_reserv: formData.no,
      keterangan: formData.keterangan,
    };

    try {
      await axios.put(
        `https://api.wisatawatuaji.com/reservasi/${formData.id}`,
        dataToSend,
        {
          withCredentials: true,
        }
      );
      setFormData({
        id: "",
        tanggal: "",
        nama: "",
        no: "",
        keterangan: "",
      });
      setShowEditModal(false);
      axios
        .get("https://api.wisatawatuaji.com/reservasi", {
          withCredentials: true,
        })
        .then((response) => {
          setBookingList(response.data);
        });
    } catch (error) {
      console.error(
        "There was an error updating the data!",
        error.response?.data || error.message
      );
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      tanggal_reservasi: formData.tanggal,
      nama_reserv: formData.nama,
      nohp_reserv: formData.no,
      keterangan: formData.keterangan,
    };

    try {
      await axios.post("https://api.wisatawatuaji.com/reservasi", dataToSend, {
        withCredentials: true,
      });
      setFormData({
        id: "",
        tanggal: "",
        nama: "",
        no: "",
        keterangan: "",
      });
      setShowAddModal(false);
      axios
        .get("https://api.wisatawatuaji.com/reservasi", {
          withCredentials: true,
        })
        .then((response) => {
          setBookingList(response.data);
        });
    } catch (error) {
      console.error(
        "There was an error adding the data!",
        error.response?.data || error.message
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingList.slice(indexOfFirstItem, indexOfLastItem);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
    setFormData({
      id: "",
      tanggal: "",
      nama: "",
      no: "",
      keterangan: "",
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      id: "",
      tanggal: "",
      nama: "",
      no: "",
      keterangan: "",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Return an empty string if dateString is undefined or null
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return an empty string if the date is invalid
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Container fluid>
        <div className="edit-booking">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Booking Wisata</h2>
            <Button variant="primary" onClick={handleAddClick}>
              Tambah Booking
            </Button>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal Booking</th>
                  <th>Nama</th>
                  <th>No. Hp</th>
                  <th>Keterangan</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id_reservasi}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>
                      {new Date(item.tanggal_reservasi).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td>{item.nama_reserv}</td>
                    <td>{item.nohp_reserv}</td>
                    <td>{item.keterangan}</td>
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
              Apakah Anda yakin ingin menghapus booking "
              {itemToDelete && itemToDelete.keterangan}"?
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
              <Modal.Title>Edit Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tanggal booking</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formatDate(formData.tanggal)}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama</label>
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
                  <label>No Hp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="no"
                    value={formData.no}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Keterangan</label>
                  <textarea
                    className="form-control"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    required
                  ></textarea>
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
              <Modal.Title>Tambah Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>Tanggal booking</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama</label>
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
                  <label>No Hp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="no"
                    value={formData.no}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Keterangan</label>
                  <textarea
                    className="form-control"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <Button variant="primary" type="submit">
                  Simpan
                </Button>
              </form>
            </Modal.Body>
          </Modal>

          <Pagination className="d-flex justify-content-center">
            {Array(Math.ceil(bookingList.length / itemsPerPage))
              .fill()
              .map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
          </Pagination>
        </div>
      </Container>
    </div>
  );
};

export default AdminBooking;
