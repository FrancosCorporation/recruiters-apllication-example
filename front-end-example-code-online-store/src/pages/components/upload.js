import React, { useState } from 'react';
import { decryptData } from '../functions/security';
import { Alertmessage } from './message_alert';
import { httpFetch } from '../functions/https-request';
const secretkey = process.env.REACT_APP_SECRET_KEY;
const httpbase = process.env.REACT_APP_HTTPBASE;

const UploadPhoto = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [colorPopup, setColorPopup] = useState('');
    const [messagePopup, setMessagePopup] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    const handleUpload = async () => {
        const tokenString = localStorage.getItem('token');
        const token = tokenString ? decryptData(tokenString, secretkey) : null;
        const formData = new FormData();
        formData.append('fotoPerfil', selectedFile);
        formData.append('email', 'rodolfofranco14@hotmail.com'); // Substitua pelo email do usuário autenticado

        if (selectedFile) {
            try {
                httpFetch('POST', httpbase + '/uploadPhotoProfile', formData, token)
                    .then(
                        data => {
                            setMessagePopup(data.msg)
                            if (data.status === 200) {
                                setColorPopup('green')
                                setPopupOpen(true);
                                setTimeout(() => {
                                    // Recarregar a página após 3 segundos
                                    window.location.href = '/itens-pessoais/listar';
                                }, 3000);

                            } else {
                                setColorPopup('red')
                                setPopupOpen(true);
                            }
                        }

                    );


            } catch (error) {
                console.error('Erro ao fazer upload:', error);
            }
        }
    };

    return (
        <div>
            <Alertmessage
                className='alertmessage'
                message={messagePopup}
                onClose={handleClosePopup}
                messagecontainer={{ color: colorPopup, backgroundColor: 'rgb(220, 220, 220)', border: 'solid 3px ' + colorPopup }}
            >
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar Foto</button>
            </Alertmessage>
            {isPopupOpen && (
                <Alertmessage
                    className='alertmessage'
                    message={messagePopup}
                    onClose={handleClosePopup}
                    messagecontainer={{ color: colorPopup, backgroundColor: 'rgb(220, 220, 220)', border: 'solid 3px ' + colorPopup }}
                />
            )}
        </div>
    );
};

export default UploadPhoto;