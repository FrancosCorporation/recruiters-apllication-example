// Login.js

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import '../css/login.css';
import { httpFetch } from '../functions/https-request';
import { elementred, resetborder, setvibility } from '../functions/uteis';
import {  encryptData } from '../functions/security';


const httpbase = process.env.REACT_APP_HTTPBASE;

const secretkey = process.env.REACT_APP_SECRET_KEY;

const LoginContainer = styled.div``;

const LoginForm = styled.form``;

const LoginTitle = styled.h2``;

const InputField = styled.input``;

const Asterisk = styled.span``;

const SubmitButton = styled.button``;

const InputContainer = styled.div`
  position: relative;
  border:none;
`;

const Login = () => {
  const [emailValue, setEmailValue] = useState('');
  const [senhaValue, setSenhaValue] = useState('');
  const emailvalidt = useRef();
  const senhavalidt = useRef();



  const handleInputEmailChange = (event) => {
    const novoValor = event.target.value;
    setEmailValue(novoValor);
    if (emailvalidt.current !== null) {
      setvibility(emailvalidt.current, '', false);
      resetborder(emailvalidt.current)
    }
  };

  const handleInputSenhaChange = (event) => {
    const novoValor = event.target.value;
    setSenhaValue(novoValor);
    if (senhavalidt.current !== null) {
      setvibility(emailvalidt.current, '', false);
      resetborder(senhavalidt.current)
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicione lógica de autenticação aqui
    if (emailvalidt.current.value === '') {
      elementred(emailvalidt.current)
    } if (senhavalidt.current.value === '') {
      elementred(senhavalidt.current)
    }
    else {
      httpFetch('POST', httpbase + '/login', {
        'email': emailvalidt.current.value, 'password': senhavalidt.current.value
      }).then(
        data => {
          console.log(data)
          if (data.token != null) {
            console.log(data.dados)
            // Armazenar o token em algum lugar seguro, como localStorage ou cookies
            // Aqui, estou armazenando no localStorage para fins de exemplo
            localStorage.setItem('token', encryptData(data.token, secretkey));
            localStorage.setItem('dados', encryptData(data.dados, secretkey));

            // Recuperar e descriptografar os dados do localStorage
            //const dadosArmazenados = localStorage.getItem('dados');
            //const dadosDescriptografados = decryptData(dadosArmazenados, secret);

            //console.log(dadosDescriptografados);
            // Redirecionar o usuário para a página "/primeirasmordidas.html"
            //window.location.href = '/';
          } else {
            setvibility(emailvalidt.current, data.msg, true)
          }


          if (data.status === 201) {
            setTimeout(() => {
              // Recarregar a página após 7 segundos
              window.location.reload();
            }, 5000);
          }
        }

      );
    }
  };

  return (
    <LoginContainer className='login-container'>
      <LoginForm className='login-form' onSubmit={handleSubmit} >
        <LoginTitle className='login-title'>Login</LoginTitle>
        <InputContainer>
          <InputField className='input-field' type="text" id='email' placeholder="email" onChange={handleInputEmailChange} value={emailValue} ref={emailvalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField className='input-field' type="password" id='senha' placeholder="Senha" onChange={handleInputSenhaChange} value={senhaValue} ref={senhavalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer>
        <SubmitButton className='submit-button' type="submit">Entrar</SubmitButton>
      </LoginForm>
    </LoginContainer>

  );

};

export default Login;
