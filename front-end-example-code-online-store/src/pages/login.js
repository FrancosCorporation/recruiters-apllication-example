// Login.js

import React from 'react';
import styled from 'styled-components';
import './login.css';

const LoginContainer = styled.div``;

const LoginForm = styled.form``;

const LoginTitle = styled.h2``;

const InputField = styled.input``;

const SubmitButton = styled.button``;

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicione lógica de autenticação aqui
  };

  return (
    <LoginContainer className='login-container'>
      <LoginForm className='login-form' onSubmit={handleSubmit} >
        <LoginTitle className='login-title'>Login</LoginTitle>
        <InputField className='input-field' type="text" placeholder="Usuário" />
        <InputField className='input-field' type="password" placeholder="Senha" />
        <SubmitButton className='submit-button' type="submit">Entrar</SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
