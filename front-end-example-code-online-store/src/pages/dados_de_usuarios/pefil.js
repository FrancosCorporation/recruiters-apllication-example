import { React, useEffect, useState } from 'react';
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
import { decryptData } from '../functions/security';
import validator from 'validator';
import { Alertmessage } from '../components/message_alert';
import { httpFetch } from '../functions/https-request';
const secretkey = process.env.REACT_APP_SECRET_KEY;
const httpbase = process.env.REACT_APP_HTTPBASE;

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [errorTextNome, setErrorTextNome] = useState('');
  const [errorTextEmail, setErrorTextEmail] = useState('');
  const [errorTextSenha, setErrorTextSenha] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Obter dados da localStorage e tentar decifrá-los
    const dadosString = localStorage.getItem('dados');
    const dados = dadosString ? decryptData(dadosString, secretkey) : null;


    setNome(dados.name);
    setEmail(dados.email);

  }, []);

  useEffect(() => {
    // Use o useEffect para atualizar a mensagem de erro instantaneamente quando o campo nome ficar vazio
    setErrorTextNome(nome.trim() === '' ? 'Campo Vazio !' : '');
  }, [nome]);
  useEffect(() => {
    // Use o useEffect para atualizar a mensagem de erro instantaneamente quando o campo nome ficar vazio
    setErrorTextEmail(email.trim() === '' ? 'Campo Vazio !' : '');
  }, [email]);
  useEffect(() => {
    // Use o useEffect para atualizar a mensagem de erro instantaneamente quando o campo nome ficar vazio
    setErrorTextSenha(novaSenha.trim() === '' ? 'Campo Vazio !' : '');
  }, [novaSenha]);

  const isEmailValid = () => {
    return validator.isEmail(email);
  };

  const handleInputNameChange = (event) => {
    const novoValor = event.target.value;
    setNome(novoValor);

  };


  const handleInputEmailChange = (event) => {
    const novoValor = event.target.value;
    setEmail(novoValor);
  };


  const handleInputSenhaChange = (event) => {
    const novoValor = event.target.value;
    setNovaSenha(novoValor);
  };


  const handleSalvar = () => {
    // Verificar se os campos são válidos antes de salvar
    if (!isEmailValid()) {
      // Handle invalid email
      if (!isPopupOpen) {
        setMessage('E-mail inválido. Não foi possível salvar as alterações.');
        setPopupOpen(true);
        return
      }
    }
    if (nome === '') {
      if (!isPopupOpen) {
        setMessage('Nome Vazio. Não foi possível salvar as alterações.');
        setPopupOpen(true);
        return
      }
    } if (novaSenha === '') {
      if (!isPopupOpen) {
        setMessage('Senha Vazia. Não foi possível salvar as alterações.');
        setPopupOpen(true);
        return
      }
    }
    else {
      if (!isPopupOpen) {
        const tokenString = localStorage.getItem('token');
        const token = tokenString ? decryptData(tokenString, secretkey) : null;
        httpFetch('POST', httpbase + '/putProfile', {
          email: email,
          nome: nome,
          senha: novaSenha,
        }, token,true).then(
          data => {
            console.log(data.msg);
          }
        )
      }

    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleCancelar = () => {
    window.location.href = '/';
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
                type="text"
                variant="outlined"
                value={nome}
                onChange={handleInputNameChange}
                error={Boolean(errorTextNome)}
                helperText={errorTextNome}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleInputEmailChange}
                error={Boolean(errorTextEmail)}
                helperText={errorTextEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                type="password"
                variant="outlined"
                value={novaSenha}
                onChange={handleInputSenhaChange}
                error={Boolean(errorTextSenha)}
                helperText={errorTextSenha}
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
      {isPopupOpen && (
        <Alertmessage
          className='alertmessage'
          message={message}
          onClose={handleClosePopup}
          messagecontainer={{ color: 'red', backgroundColor: 'rgb(220, 220, 220)', borderRadius: '1.563rem', border: 'solid 3px red' }}
        />
      )}
    </Container>
  );
};

export default Perfil;
