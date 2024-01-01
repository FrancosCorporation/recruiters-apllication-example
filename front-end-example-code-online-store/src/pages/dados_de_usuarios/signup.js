// SignUp.js
import React, { useState , useRef} from 'react';
import styled from 'styled-components';
import { httpFetch } from '../functions/https-request';
import '../css/signup.css'; // Importa o arquivo CSS externo
import { elementred, setvibility, resetborder } from '../functions/uteis'

const httpbase = process.env.REACT_APP_HTTPBASE;

const SignUpContainer = styled.div``;

const SignUpForm = styled.form``;

const SignUpTitle = styled.h2``;

const InputField = styled.input``;

const SubmitButton = styled.button``;

const Asterisk = styled.span``;

const InputContainer = styled.div`
  position: relative;
  border:none;
`;

const SignUp = () => {
  const emailvalidt = useRef();
  const namevalidt = useRef();
  const senhavalidt = useRef();
  const confirmsenhavalidt = useRef();

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

  const handleInputNameChange = (event) => {
    const novoValor = event.target.value;
    setNameValue(novoValor);
    if (emailvalidt.current !== null) {
      setvibility(emailvalidt.current, '', false);
      resetborder(namevalidt.current)
    }
  };


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
    if (emailvalidt.current !== null) {
      setvibility(emailvalidt.current, '', false);
      setvibility(senhavalidt.current, '', false);
      resetborder(senhavalidt.current)
    }
  };

  const handleInputConfirmSenhaChange = (event) => {
    const novoValor = event.target.value;
    setConfirmSenhaValue(novoValor);
    if (emailvalidt.current !== null) {
      setvibility(emailvalidt.current, '', false);
      setvibility(senhavalidt.current, '', false);
      resetborder(confirmsenhavalidt.current)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (senhaValue !== confirmsenhaValue) {
      // Exibe uma mensagem de erro ou toma outra ação apropriada
      setvibility(senhavalidt.current, 'As senhas não coincidem', true);
      return;
    }
    if (emailvalidt.current.value === '') {
      elementred(emailvalidt.current)
    } if (senhavalidt.current.value === '') {
      elementred(senhavalidt.current)
    } if (namevalidt.current.value === '') {
      elementred(namevalidt.current)
    } if (confirmsenhavalidt.current.value === '') {
      elementred(confirmsenhavalidt.current)
    }
    else{
      httpFetch('POST', httpbase+'/register', {
        'email': emailvalidt.current.value, 'password': senhavalidt.current.value, 'name': namevalidt.current.value
      }).then(
        data => {
          setvibility(emailvalidt.current, data.msg, true)
    
          if (data.status === 201) {
            setTimeout(() => {
              // Recarregar a página após 7 segundos
              window.location.href = '/login';
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
