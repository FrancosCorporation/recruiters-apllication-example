// SignUp.js
import React from 'react';
import './signup.css'; // Importa o arquivo CSS externo
import styled from 'styled-components';

const SignUpContainer = styled.div``;

const SignUpForm = styled.form``;

const SignUpTitle = styled.h2``;

const InputField = styled.input``;

const SubmitButton = styled.button``;

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicione lógica de criação de conta aqui
  };

  return (
    <SignUpContainer className='sign-up-container'>
      <SignUpForm onSubmit={handleSubmit} className='sign-up-form'>
        <SignUpTitle className='sign-up-title'> Inscreva-se</SignUpTitle>
        <InputField type="text" placeholder="Nome" className="input-field" />
        <InputField type="email" placeholder="Email" className="input-field" />
        <InputField type="password" placeholder="Senha" className="input-field" />
        <InputField type="password" placeholder="Confirmar Senha" className="input-field" />
        <SubmitButton type="submit" className="submit-button">
          Inscrever-se
        </SubmitButton>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUp;
