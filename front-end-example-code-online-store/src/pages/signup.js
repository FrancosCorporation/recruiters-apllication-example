// SignUp.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { httpFetch } from './functions/https-request';
import './css/signup.css'; // Importa o arquivo CSS externo
import { elementred, setvibility, resetborder } from './functions/uteis'


const SignUpContainer = styled.div``;

const SignUpForm = styled.form``;

const SignUpTitle = styled.h2``;

const InputField = styled.input``;

const SubmitButton = styled.button``;

const Asterisk = styled.span``;

const InputContainer = styled.div`
  position: relative;
  border:none;
  width:20em;
`;

const SignUp = () => {
  const emailvalidt = document.querySelector('input[placeholder="Email"]')
  const namevalidt = document.querySelector('input[placeholder="Nome"]')
  const senhavalidt = document.querySelector('input[placeholder="Senha"]')
  const confirmsenhavalidt = document.querySelector('input[placeholder="Confirmar Senha"]')

  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [senhaValue, setSenhaValue] = useState('');
  const [confirmsenhaValue, setConfirmSenhaValue] = useState('');

  const handleTabPress = (event, ref) => {
    if (event.key === 'Tab') {
      event.preventDefault(); // Impede o comportamento padrão da tecla Tab
      ref.current.focus(); // Move o foco para o próximo campo
    }
  };

  const handleInputEmailChange = (event) => {
    const novoValor = event.target.value;
    setEmailValue(novoValor);
    if (emailvalidt !== null) {
      setvibility(emailvalidt, '', false);
      resetborder(emailvalidt)
    }
  };

  const handleInputNameChange = (event) => {
    const novoValor = event.target.value;
    setNameValue(novoValor);
    if (emailvalidt !== null) {
      setvibility(emailvalidt, '', false);
      resetborder(namevalidt)
    }
  };

  const handleInputSenhaChange = (event) => {
    const novoValor = event.target.value;
    setSenhaValue(novoValor);
    if (emailvalidt !== null) {
      setvibility(emailvalidt, '', false);
      setvibility(senhavalidt, '', false);
      resetborder(senhavalidt)
    }
  };

  const handleInputConfirmSenhaChange = (event) => {
    const novoValor = event.target.value;
    setConfirmSenhaValue(novoValor);
    if (emailvalidt !== null) {
      setvibility(emailvalidt, '', false);
      setvibility(senhavalidt, '', false);
      resetborder(confirmsenhavalidt)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (senhaValue !== confirmsenhaValue) {
      // Exibe uma mensagem de erro ou toma outra ação apropriada
      setvibility(senhavalidt, 'As senhas não coincidem', true);
      return;
    }
    if (emailvalidt.value === '') {
      elementred(emailvalidt)
    } if (senhavalidt.value === '') {
      elementred(senhavalidt)
    } if (namevalidt.value === '') {
      elementred(namevalidt)
    } if (confirmsenhavalidt.value === '') {
      elementred(confirmsenhavalidt)
    }
    else{
      httpFetch('POST', 'http://localhost:3002/register', {
        'email': emailvalidt.value, 'password': senhavalidt.value, 'name': namevalidt.value
      }).then(
        data => {
          console.log(data)
          setvibility(emailvalidt, data.msg, true)
    
          if (data.status === 201) {
            setTimeout(() => {
              // Recarregar a página após 7 segundos
              window.location.reload();
            }, 5000);
          }
        }
    
      );
      };
    }
  
  //data.then(data => console.log(data))





  return (
    <SignUpContainer className='sign-up-container'>
      <SignUpForm onSubmit={handleSubmit} className='sign-up-form'>
        <SignUpTitle className='sign-up-title'> Inscreva-se</SignUpTitle>
        <InputContainer onKeyDown={(e) => handleTabPress(e, emailvalidt)}>
          <InputField type="text" placeholder="Nome" className="input-field" onChange={handleInputNameChange} value={nameValue} ref={namevalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer>
        <InputContainer onKeyDown={(e) => handleTabPress(e, senhavalidt)}>
          <InputField type="email" placeholder="Email" className="input-field" onChange={handleInputEmailChange} value={emailValue} ref={emailvalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer>
        <InputContainer onKeyDown={(e) => handleTabPress(e, confirmsenhavalidt)}>
          <InputField type="password" placeholder="Senha" className="input-field" onChange={handleInputSenhaChange} value={senhaValue} ref={senhavalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField type="password" placeholder="Confirmar Senha" className="input-field" onChange={handleInputConfirmSenhaChange} value={confirmsenhaValue} ref={confirmsenhavalidt} />
          <Asterisk className='asterisk'>*</Asterisk>
        </InputContainer >
        <SubmitButton type="submit" className="submit-button" onKeyDown={(e) => handleTabPress(e, namevalidt)} >
          Inscrever-se
        </SubmitButton>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUp;
