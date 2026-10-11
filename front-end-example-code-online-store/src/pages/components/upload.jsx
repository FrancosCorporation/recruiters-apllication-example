import React, { useState } from 'react';
import { apiBaseUrl, httpFetch } from '../functions/https-request';

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxFileSize = 5 * 1024 * 1024;

const UploadPhoto = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage('Escolha uma foto antes de enviar.');
      return;
    }
    if (!acceptedTypes.has(selectedFile.type) || selectedFile.size > maxFileSize) {
      setMessage('Escolha uma imagem JPEG, PNG ou WebP de até 5 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('fotoPerfil', selectedFile);
    setIsUploading(true);
    const result = await httpFetch('POST', `${apiBaseUrl}/uploadPhotoProfile`, formData);
    setIsUploading(false);
    setMessage(result.msg || 'Não foi possível enviar a foto.');
    if (result.status === 200) {
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <form className="profile-upload" onSubmit={handleUpload}>
      <label htmlFor="profile-photo">Foto de perfil</label>
      <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
      <button type="submit" disabled={isUploading}>{isUploading ? 'Enviando…' : 'Enviar foto'}</button>
      {message && <p className="auth-feedback" role="status">{message}</p>}
    </form>
  );
};

export default UploadPhoto;
