import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import '../css/signup.css';
import { apiBaseUrl, httpFetch } from '../functions/https-request';

const SignUpContainer = styled.div``;
const SignUpForm = styled.form``;
const SignUpTitle = styled.h2``;
const InputField = styled.input``;
const SubmitButton = styled.button``;
const Asterisk = styled.span``;
const InputContainer = styled.div`
  position: relative;
  border: none;
`;

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ message: '', type: '' });
    if (password !== confirmPassword) {
      setFeedback({ message: 'As senhas não coincidem.', type: 'error' });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setFeedback({ message: 'Use uma senha entre 8 e 128 caracteres.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const result = await httpFetch('POST', `${apiBaseUrl}/register`, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setIsSubmitting(false);
    setFeedback({
      message: result.msg || 'Não foi possível concluir o cadastro.',
      type: result.status === 201 ? 'success' : 'error',
    });
  };

  return (
    <SignUpContainer className="sign-up-container">
      <SignUpForm onSubmit={handleSubmit} className="sign-up-form">
        <SignUpTitle className="sign-up-title">Inscreva-se</SignUpTitle>
        <InputContainer>
          <InputField type="text" name="name" autoComplete="name" placeholder="Nome" className="input-field" onChange={(event) => setName(event.target.value)} value={name} required maxLength={100} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField type="email" name="email" autoComplete="email" placeholder="E-mail" className="input-field" onChange={(event) => setEmail(event.target.value)} value={email} required maxLength={254} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField type="password" name="password" autoComplete="new-password" placeholder="Senha (8 a 128 caracteres)" className="input-field" onChange={(event) => setPassword(event.target.value)} value={password} required minLength={8} maxLength={128} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField type="password" name="confirmPassword" autoComplete="new-password" placeholder="Confirmar senha" className="input-field" onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} required maxLength={128} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        {feedback.message && <p className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
        <SubmitButton type="submit" className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Inscrever-se'}</SubmitButton>
        <p className="auth-switch">Já tem uma conta? <Link to="/login">Entrar</Link></p>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUp;
