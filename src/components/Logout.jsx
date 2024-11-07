import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus token atau sesi
    localStorage.removeItem('token');

    // Redirect ke halaman login
    navigate('/loginAdmin');
  }, [navigate]);

  return null; // Atau Anda bisa menampilkan pesan loading sementara
};

export default Logout;