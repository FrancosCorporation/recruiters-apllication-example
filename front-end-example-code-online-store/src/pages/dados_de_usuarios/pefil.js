import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from '@mui/material';
import '../css/perfil.css'

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const handleSalvar = () => {
    // Lógica para salvar as alterações
    console.log('Salvando alterações:', { nome, email, novaSenha });
  };

  const handleCancelar = () => {
    // Lógica para cancelar as alterações
    console.log('Alterações canceladas');
  };

  return (
    <Container className='container' component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" mb={4}>
          Perfil
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                variant="outlined"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                type="password"
                variant="outlined"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box className='box_save' mt={4} mb={2} >
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleSalvar}
              sx={{ marginRight: 2 }}
            >
              Salvar
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Perfil;
