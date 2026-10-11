import React, { useEffect, useState } from 'react';
import './pages/css/global.css';
import './pages/css/app.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from 'styled-components';
import logo from './images/logo.png';
import Home from './pages/home';
import Login from './pages/dados_de_usuarios/login';
import SignUp from './pages/dados_de_usuarios/signup';
import { Generalitens } from './pages/generalitems';
import PersonalItems from './pages/personalitems';
import MenuLateral from './pages/dados_de_usuarios/menu-lateral';
import Perfil from './pages/dados_de_usuarios/pefil';
import ConfirmToken from './pages/dados_de_usuarios/confirmToken';

const StyledAppBar = styled(AppBar)`
  position: relative;
`;
const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const MenuButton = styled(Button)`
  && { margin-left: auto; }
`;

function RequireAuth({ children }) {
  return window.sessionStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

function EmptyPage({ title, description }) {
  return (
    <section className="store-empty">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

const App = () => {
  const [anchorElGerais, setAnchorElGerais] = useState(null);
  const [anchorElPessoais, setAnchorElPessoais] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Remove the old client-side encrypted values; the shared key was bundled into the browser.
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('dados');
  }, []);

  const handleToggleMenu = () => {
    if (!window.sessionStorage.getItem('token')) {
      window.location.assign('/login');
      return;
    }
    setIsMenuOpen((open) => !open);
  };

  return (
    <Router>
      <div className="containerPai">
        <StyledAppBar position="static">
          <StyledToolbar>
            <Button color="inherit" component={StyledLink} to="/" aria-label="Página inicial">
              <img src={logo} alt="Logo" height={64} />
            </Button>
            <nav className="main-navigation" aria-label="Navegação principal">
              <Button color="inherit" component={StyledLink} to="/">Início</Button>
              <Button color="inherit" component={StyledLink} to="/login">Entrar</Button>
              <Button color="inherit" component={StyledLink} to="/inscreva-se">Criar conta</Button>
              <Button color="inherit" onClick={(event) => setAnchorElGerais(event.currentTarget)} aria-haspopup="true" aria-expanded={Boolean(anchorElGerais)}>
                Itens gerais <ArrowDropDownIcon />
              </Button>
              <Menu anchorEl={anchorElGerais} open={Boolean(anchorElGerais)} onClose={() => setAnchorElGerais(null)}>
                <MenuItem component={StyledLink} to="/itens-gerais/listar" onClick={() => setAnchorElGerais(null)}>Ver itens</MenuItem>
                <MenuItem component={StyledLink} to="/itens-gerais/criar" onClick={() => setAnchorElGerais(null)}>Criar item</MenuItem>
              </Menu>
              <Button color="inherit" onClick={(event) => setAnchorElPessoais(event.currentTarget)} aria-haspopup="true" aria-expanded={Boolean(anchorElPessoais)}>
                Minha área <ArrowDropDownIcon />
              </Button>
              <Menu anchorEl={anchorElPessoais} open={Boolean(anchorElPessoais)} onClose={() => setAnchorElPessoais(null)}>
                <MenuItem component={StyledLink} to="/itens-pessoais/listar" onClick={() => setAnchorElPessoais(null)}>Meus itens</MenuItem>
                <MenuItem component={StyledLink} to="/itens-pessoais/criar" onClick={() => setAnchorElPessoais(null)}>Criar item</MenuItem>
                <MenuItem component={StyledLink} to="/perfil" onClick={() => setAnchorElPessoais(null)}>Perfil</MenuItem>
              </Menu>
              <MenuButton color="inherit" onClick={handleToggleMenu} aria-label="Abrir menu da conta">
                <MenuIcon />
              </MenuButton>
            </nav>
          </StyledToolbar>
        </StyledAppBar>

        {isMenuOpen && <MenuLateral isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/token" element={<ConfirmToken />} />
          <Route path="/inscreva-se" element={<SignUp />} />
          <Route path="/itens-gerais/listar" element={<Generalitens />} />
          <Route path="/itens-gerais/criar" element={<EmptyPage title="Criar item" description="O cadastro de itens gerais ainda não está disponível neste exemplo." />} />
          <Route path="/itens-pessoais/listar" element={<RequireAuth><PersonalItems /></RequireAuth>} />
          <Route path="/itens-pessoais/criar" element={<RequireAuth><EmptyPage title="Criar item pessoal" description="O cadastro de itens pessoais ainda não está disponível neste exemplo." /></RequireAuth>} />
          <Route path="/perfil" element={<RequireAuth><Perfil /></RequireAuth>} />
          <Route path="*" element={<EmptyPage title="Página não encontrada" description="Confira o endereço ou volte para a página inicial." />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
