// Login.js

import React, { useState } from 'react';
import styled from 'styled-components';
import './css/login.css';
import { httpFetch } from './functions/https-request';
import { elementred, resetborder, setvibility } from './functions/uteis';

const LoginContainer = styled.div``;

const LoginForm = styled.form``;

const LoginTitle = styled.h2``;

const InputField = styled.input``;

const SubmitButton = styled.button``;

const Login = () => {

  const emailvalidt = document.querySelector('input[placeholder="Usuário"]')
  const senhavalidt = document.querySelector('input[placeholder="Senha"]')
  const [emailValue, setEmailValue] = useState('');
  const [senhaValue, setSenhaValue] = useState('');


  const handleInputEmailChange = (event) => {
    const novoValor = event.target.value;
    setEmailValue(novoValor);
    if (emailvalidt !== null) {
      setvibility(emailvalidt, '', false);
      resetborder(emailvalidt)
    }
  };

  const handleInputSenhaChange = (event) => {
    const novoValor = event.target.value;
    setSenhaValue(novoValor);
    if (senhavalidt !== null) {
      setvibility(emailvalidt, '', false);
      resetborder(senhavalidt)
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicione lógica de autenticação aqui
    console.log(emailvalidt.value, senhavalidt.value)
    if (emailvalidt.value === '') {
      elementred(emailvalidt)
    } if (senhavalidt.value === '') {
      elementred(senhavalidt)
    }
    else {
      httpFetch('POST', 'http://localhost:3002/login', {
        'email': emailvalidt.value, 'password': senhavalidt.value
      }).then(
        data => {
          console.log(data)
          if (data.token != null) {

            // Armazenar o token em algum lugar seguro, como localStorage ou cookies
            // Aqui, estou armazenando no localStorage para fins de exemplo
            localStorage.setItem('token', data.token);

            // Redirecionar o usuário para a página "/primeirasmordidas.html"
            window.location.href = '/';

          } else {
            setvibility(emailvalidt, data.msg, true)
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
        <InputField className='input-field' type="text" placeholder="Usuário" onChange={handleInputEmailChange} value={emailValue} />
        <InputField className='input-field' type="password" placeholder="Senha" onChange={handleInputSenhaChange} value={senhaValue} />
        <SubmitButton className='submit-button' type="submit">Entrar</SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
