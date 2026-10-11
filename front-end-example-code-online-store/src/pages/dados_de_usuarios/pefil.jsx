import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid } from '@mui/material';
import validator from 'validator';
import '../css/perfil.css';
import { apiBaseUrl, httpFetch } from '../functions/https-request';

function readProfile() {
  try {
    return JSON.parse(window.sessionStorage.getItem('dados') || '{}');
  } catch {
    return {};
  }
}

const Perfil = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const profile = readProfile();
    setNome(profile.name || '');
    setEmail(profile.email || '');
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!nome.trim() || !validator.isEmail(email.trim()) || (novaSenha && (novaSenha.length < 8 || novaSenha.length > 128))) {
      setFeedback({ message: 'Confira o nome, o e-mail e o tamanho da nova senha.', type: 'error' });
      return;
    }

    setIsSaving(true);
    const result = await httpFetch('POST', `${apiBaseUrl}/putProfile`, {
      email: email.trim().toLowerCase(),
      nome: nome.trim(),
      senha: novaSenha,
    });
    setIsSaving(false);
    setFeedback({ message: result.msg || 'Não foi possível salvar as alterações.', type: result.status === 200 ? 'success' : 'error' });

    if (result.status === 200 && result.dados) {
      window.sessionStorage.setItem('dados', JSON.stringify(result.dados));
      setNovaSenha('');
      if (result.requiresVerification) {
        window.sessionStorage.removeItem('token');
        window.setTimeout(() => navigate('/login'), 3000);
      }
    }
  };

  return (
    <Container className="container" component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" mb={4}>Perfil</Typography>
        <form onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nome" type="text" value={nome} onChange={(event) => setNome(event.target.value)} required inputProps={{ maxLength: 100 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required inputProps={{ maxLength: 254 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nova senha (opcional)" type="password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} autoComplete="new-password" inputProps={{ minLength: 8, maxLength: 128 }} />
            </Grid>
          </Grid>
          {feedback.message && <p className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
          <Box className="box_save" mt={4} mb={2}>
            <Button type="submit" variant="contained" color="primary" disabled={isSaving}>{isSaving ? 'Salvando…' : 'Salvar'}</Button>
            <Button type="button" variant="outlined" color="secondary" sx={{ marginLeft: 2 }} onClick={() => navigate('/')}>Cancelar</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Perfil;
