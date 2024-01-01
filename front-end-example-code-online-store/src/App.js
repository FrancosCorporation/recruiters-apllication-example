// App.js

import './pages/css/global.css'
import './pages/css/app.css'
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Home from './pages/home';
import Login from './pages/dados_de_usuarios/login';
import SignUp from './pages/dados_de_usuarios/signup';
import {Generalitens} from './pages/generalitems';
import PersonalItems from './pages/personalitems';
import styled from 'styled-components';
import logo from './images/logo.png';
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
  && {
    margin-left: auto;
  }
`;

// ... (importações e código anterior)

const App = () => {
  const [anchorElGerais, setAnchorElGerais] = useState(null);
  const [anchorElPessoais, setAnchorElPessoais] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenGerais = (event) => {
    setAnchorElGerais(event.currentTarget);
  };

  const handleCloseGerais = () => {
    setAnchorElGerais(null);
  };

  const handleOpenPessoais = (event) => {
    setAnchorElPessoais(event.currentTarget);
  };

  const handleClosePessoais = () => {
    setAnchorElPessoais(null);
  };
  const handleToggleMenu = () => {
    if (localStorage.getItem('token') !== null & localStorage.getItem('token') !== '') {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };



  return (
    <Router>
      <div className='containerPai'>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Button color="inherit" component={StyledLink} to="/">
              <img src={logo} alt="logo" height={70} />
            </Button>
            <div>
              <Button color="inherit" component={StyledLink} to="/">
                Home
              </Button>
              <Button color="inherit" component={StyledLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={StyledLink} to="/inscreva-se">
                Inscreva-se
              </Button>
              {/* Itens Gerais */}
              <Button color="inherit" onClick={handleOpenGerais} aria-haspopup="true">
                Itens Gerais <ArrowDropDownIcon />
              </Button>
              <Menu
                id="itens-gerais-menu"
                anchorEl={anchorElGerais}
                open={Boolean(anchorElGerais)}
                onClose={handleCloseGerais}
              >
                <MenuItem component={StyledLink} to="/itens-gerais/listar" onClick={handleCloseGerais}>
                  Listar
                </MenuItem>
                <MenuItem component={StyledLink} to="/itens-gerais/criar" onClick={handleCloseGerais}>
                  Criar
                </MenuItem>
              </Menu>
              {/* Itens Pessoais */}
              <Button color="inherit" onClick={handleOpenPessoais} aria-haspopup="true">
                Itens Pessoais <ArrowDropDownIcon />
              </Button>
              <Menu
                id="itens-pessoais-menu"
                anchorEl={anchorElPessoais}
                open={Boolean(anchorElPessoais)}
                onClose={handleClosePessoais}
              >
                <MenuItem component={StyledLink} to="/itens-pessoais/listar" onClick={handleClosePessoais}>
                  Listar
                </MenuItem>
                <MenuItem component={StyledLink} to="/itens-pessoais/criar" onClick={handleClosePessoais}>
                  Criar
                </MenuItem>
              </Menu>
              <MenuButton color="inherit" onClick={handleToggleMenu}>
                <MenuIcon />
              </MenuButton>
            </div>
          </StyledToolbar>
        </StyledAppBar>
        <Outlet />


        {isMenuOpen && (<MenuLateral isOpen={isMenuOpen} onClose={handleMenuClose} />)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/token" element={<ConfirmToken />} />
          <Route path="/inscreva-se" element={<SignUp />} />
          <Route path="/itens-gerais" element={<Generalitens />}>
            <Route path="listar" element={"<ListarItensGerais />"} />
            <Route path="criar" element={"<CriarItensGerais />"} />
          </Route>
          <Route path="/itens-pessoais" element={<PersonalItems />}>
            <Route path="listar" element={"<ListarItensPessoais />"} />
            <Route path="criar" element={"<CriarItensPessoais />"} />
          </Route>
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </Router>


  );
};

export default App;
