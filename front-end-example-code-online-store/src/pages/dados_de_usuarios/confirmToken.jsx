import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/confirmToken.css';
import { apiBaseUrl, httpFetch } from '../functions/https-request';

const ConfirmToken = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('token');
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);

    if (!token) {
      setMessage('O link de ativação é inválido ou está incompleto. Solicite um novo cadastro.');
      setIsLoading(false);
      return undefined;
    }

    httpFetch('POST', `${apiBaseUrl}/token`, { token })
      .then((result) => {
        if (active) setMessage(result.msg || 'Não foi possível ativar a conta.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="container">
      <div className="notification-container">
        <div className="notification" aria-live="polite">
          {isLoading ? <p>Verificando seu link…</p> : <><h1>{message}</h1><Link to="/login">Ir para o login</Link></>}
        </div>
      </div>
    </div>
  );
};

export default ConfirmToken;
