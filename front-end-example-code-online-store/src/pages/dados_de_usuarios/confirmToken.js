// ConfirmToken.jsx
import React, {useState } from 'react';
import '../css/confirmToken.css';
import { httpFetch } from '../functions/https-request';
const httpbase = process.env.REACT_APP_HTTPBASE;

const ConfirmToken = () => {

    // Estado para armazenar a mensagem
    const [message, setMessage] = useState('Token inválido. Entre em contato com o suporte !');
    // Obter os parâmetros da consulta
    var queryString = window.location.search;

    // Criar um objeto URLSearchParams para facilitar a manipulação dos parâmetros
    var urlParams = new URLSearchParams(queryString);

    // Obter o valor do parâmetro 'nome'
    var token = urlParams.get('token');

    httpFetch('POST', httpbase + '/token', {
        'token': token
    }).then(
        data => {
            // Atualizar o estado com a mensagem recebida
            setMessage(data.msg);

        }

    );
    setTimeout(() => {
        // Recarregar a página após 7 segundos
        //window.location.href = '/';
    }, 5000);

    return (
        <div className="container">
            <div className="notification-container">
                <div className="notification">
                    <h1>{message}</h1>
                </div>
            </div>
        </div>
    );
};

export default ConfirmToken;
