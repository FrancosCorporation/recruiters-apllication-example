// ConfirmToken.jsx
import React, {useState, useEffect } from 'react';
import '../css/confirmToken.css';
import { httpFetch } from '../functions/https-request';
const httpbase = process.env.REACT_APP_HTTPBASE;// Substitua isso pelo caminho real da sua biblioteca HTTP

const ConfirmToken = () => {
    const [message, setMessage] = useState('Token inválido. Entre em contato com o suporte !');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Obter os parâmetros da consulta
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var token = urlParams.get('token');

        httpFetch('POST', `${httpbase}/token`, { 'token': token })
            .then(data => {
                setMessage(data.msg);
            })
            .catch(error => {
                console.error('Erro na solicitação:', error);
                setMessage('Erro ao processar o token. Entre em contato com o suporte!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // O segundo parâmetro vazio garante que o efeito seja executado apenas uma vez, equivalente ao componentDidMount

    return (
        <div className="container">
            <div className="notification-container">
                <div className="notification">
                    {isLoading ? <p>Verificando token...</p> : <h1>{message}</h1>}
                </div>
            </div>
        </div>
    );
};

export default ConfirmToken;
