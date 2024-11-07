import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const AdminProfil = () => {
  const [showModal, setShowModal] = useState({
    username: false,
    password: false,
    background: false,
  });
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    backgroundPhotos: ["", "", "", "", ""],
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [userId, setUserId] = useState(null); // Add userId state

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "https://api.wisatawatuaji.com/api/admin-profile",
          {
            withCredentials: true,
          }
        );

        console.log("Data fetched:", response.data);
        const adminData = response.data;

        // Set the form data and userId
        setFormData({
          username: adminData.username || "",
          password: "",
          backgroundPhotos: Array.isArray(adminData.backgrounds)
            ? adminData.backgrounds
            : ["", "", "", "", ""], // Default if no background
        });
        setExistingPhotos(adminData.backgrounds || []);
        setUserId(adminData.id); // Assuming 'id' is the user ID
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  // Submit changes for the entire profile
  const handleProfileSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append username and password if provided
    if (formData.username) {
      formDataToSubmit.append("username", formData.username);
    }
    if (formData.password) {
      formDataToSubmit.append("password", formData.password);
    }

    // Append each background photo if available
    formData.backgroundPhotos.forEach((photo) => {
      if (photo) {
        formDataToSubmit.append("backgroundPhotos", photo); // Jangan ubah nama key
        console.log(`Adding file to formData:`, photo);
      }
    });

    // Logging FormData for debugging
    for (let pair of formDataToSubmit.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      // Send the PUT request to update the profile
      const response = await axios.put(
        "https://api.wisatawatuaji.com/api/admin-profile",
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Response from server:", response.data);
      alert("Profile updated successfully");

      // Close all modals
      handleCloseModal("username");
      handleCloseModal("password");
      handleCloseModal("background");

      // Fetch the updated admin profile data after save
      const profileResponse = await axios.get(
        "https://api.wisatawatuaji.com/api/admin-profile",
        { withCredentials: true }
      );

      // Update existing photos with the new data from the server
      setExistingPhotos(profileResponse.data.backgrounds || []);

      // Optionally clear the password field after success
      setFormData((prevFormData) => ({
        ...prevFormData,
        password: "", // Clear password after successful update
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      console.log("Error details:", error.response?.data);
    }
  };

  const handleShowModal = (type) => {
    setShowModal({ ...showModal, [type]: true });
  };

  const handleCloseModal = (type) => {
    setShowModal({ ...showModal, [type]: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk menghapus foto dari existingPhotos dan formData
  const handleDeletePhoto = async (photoId) => {
    console.log("Deleting photo with ID:", photoId);
    try {
      await axios.delete(`https://api.wisatawatuaji.com/assets/${photoId}`, {
        withCredentials: true,
      });
      // Filter foto yang sudah dihapus dari state
      setExistingPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId)
      );
      alert("Foto berhasil dihapus.");
    } catch (error) {
      console.error("Error menghapus foto:", error);
    }
  };

  // Fungsi untuk menambahkan foto baru
  const handleAddPhoto = () => {
    setFormData({
      ...formData,
      backgroundPhotos: [...formData.backgroundPhotos, { photo: null }],
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedPhotos = [...formData.backgroundPhotos];
    updatedPhotos[index] = file;
    setFormData({ ...formData, backgroundPhotos: updatedPhotos });
  };

  return (
    <div className="profile-page">
      <h2>Admin Profile</h2>

      {/* Username Section */}
      <table className="table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Username Section */}
          <tr>
            <td>Username</td>
            <td>{formData.username}</td>
            <td>
              <Button onClick={() => handleShowModal("username")}>
                Ganti Username
              </Button>
            </td>
          </tr>

          {/* Password Section */}
          <tr>
            <td>Password</td>
            <td>******</td>
            <td>
              <Button onClick={() => handleShowModal("password")}>
                Ganti Password
              </Button>
            </td>
          </tr>

          {/* Background Photos Section (Only for user with ID 1) */}
          {userId === 1 && (
            <tr>
              <td>Background Photos</td>
              <td>
                {formData.backgroundPhotos.length > 0 ? (
                  formData.backgroundPhotos.map((photoObj, index) => (
                    <div key={index}>
                      <p>Background Photo {index + 1}:</p>
                      <img
                        src={`https://api.wisatawatuaji.com/uploads/${photoObj.photo_path}`}
                        alt={`Background Photo ${photoObj.photo_path}`}
                        width="100"
                      />
                    </div>
                  ))
                ) : (
                  <p>No background photos uploaded.</p>
                )}
              </td>
              <td>
                <Button onClick={() => handleShowModal("background")}>
                  Ganti Background
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modals for Username */}
      <Modal
        show={showModal.username}
        onHide={() => handleCloseModal("username")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ganti Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleCloseModal("username")}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modals for Password */}
      <Modal
        show={showModal.password}
        onHide={() => handleCloseModal("password")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ganti Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleCloseModal("password")}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modals for Background Photos */}
      <Modal
        show={showModal.background}
        onHide={() => handleCloseModal("background")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ganti Background Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData.backgroundPhotos.map((photo, index) => (
            <div key={index} className="form-group">
              <label>Background Photo {index + 1}</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, index)}
              />
              {/* Display the existing photo's filename */}
              {existingPhotos[index] && existingPhotos[index].photo_path && (
                <p>Existing file: {existingPhotos[index].photo_path}</p>
              )}
              <Button
                variant="danger"
                onClick={() => handleDeletePhoto(photo.id)}
              >
                Hapus Foto
              </Button>
            </div>
          ))}

          {/* Cek jika jumlah foto kurang dari 5 */}
          {formData.backgroundPhotos.length < 5 && (
            <Button onClick={handleAddPhoto}>Tambah Foto</Button>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleCloseModal("background")}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProfil;
