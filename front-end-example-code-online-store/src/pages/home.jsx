import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './css/home.css';

const Home = () => (
  <main className="home-container">
    <h1>Bem-vindo à loja de demonstração</h1>
    <p>Explore os itens de exemplo ou crie uma conta para acessar seu perfil e sua área pessoal.</p>
    <div className="home-actions">
      <Button component={Link} to="/itens-gerais/listar" variant="contained">Ver itens</Button>
      <Button component={Link} to="/inscreva-se" variant="outlined">Criar uma conta</Button>
    </div>
  </main>
);

export default Home;
