import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';
import { apiBaseUrl, httpFetch } from '../functions/https-request';

const LoginContainer = styled.div``;
const LoginForm = styled.form``;
const LoginTitle = styled.h2``;
const InputField = styled.input``;
const Asterisk = styled.span``;
const SubmitButton = styled.button``;
const InputContainer = styled.div`
  position: relative;
  border: none;
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ message: '', type: '' });
    setIsSubmitting(true);

    const result = await httpFetch('POST', `${apiBaseUrl}/login`, {
      email: email.trim().toLowerCase(),
      password,
    });
    setIsSubmitting(false);

    if (result.status !== 200 || !result.token) {
      setFeedback({ message: result.msg || 'Não foi possível entrar.', type: 'error' });
      return;
    }

    window.sessionStorage.setItem('token', result.token);
    window.sessionStorage.setItem('dados', JSON.stringify(result.dados ?? {}));
    setFeedback({ message: 'Login realizado. Redirecionando…', type: 'success' });
    navigate('/');
  };

  return (
    <LoginContainer className="login-container">
      <LoginForm className="login-form" onSubmit={handleSubmit}>
        <LoginTitle className="login-title">Login</LoginTitle>
        <InputContainer>
          <InputField className="input-field" type="email" id="email" name="email" autoComplete="email" required maxLength={254} placeholder="E-mail" onChange={(event) => setEmail(event.target.value)} value={email} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        <InputContainer>
          <InputField className="input-field" type="password" id="senha" name="password" autoComplete="current-password" required maxLength={128} placeholder="Senha" onChange={(event) => setPassword(event.target.value)} value={password} />
          <Asterisk aria-hidden="true">*</Asterisk>
        </InputContainer>
        {feedback.message && <p className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
        <SubmitButton className="submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando…' : 'Entrar'}</SubmitButton>
        <p className="auth-switch">Ainda não tem uma conta? <Link to="/inscreva-se">Cadastre-se</Link></p>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
