// App.js

import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem, Drawer, MenuList, Avatar, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signup';
import GeneralItems from './pages/generalitems';
import PersonalItems from './pages/personalitems';
import styled from 'styled-components';
import logo from './images/logo.png';
import './pages/css/global.css'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  
`;

const StyledAppBar = styled(AppBar)`
  background-color: #ffffff; /* Azul BB */
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

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 16px;
  
`;

const MenuButton = styled(Button)`
  && {
    margin-left: auto;
  }
`;

const StyledDrawer = styled(Drawer)`
  width: 250px;
`;

const StyledAvatar = styled(Avatar)`
  margin: 16px auto;
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
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <Router>
      <AppContainer>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Button color="inherit" component={StyledLink} to="/">
              <img src={logo} alt="logo" height={70}/>
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

        <ContentContainer>
          <Outlet />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscreva-se" element={<SignUp />} />
            <Route path="/itens-gerais" element={<GeneralItems />}>
              <Route path="listar" element={"<ListarItensGerais />"} />
              <Route path="criar" element={"<CriarItensGerais />"} />
            </Route>
            <Route path="/itens-pessoais" element={<PersonalItems />}>
              <Route path="listar" element={"<ListarItensPessoais />"} />
              <Route path="criar" element={"<CriarItensPessoais />"} />
            </Route>
          </Routes>
          {isMenuOpen && (
            <StyledDrawer anchor="right" open={isMenuOpen} onClose={handleMenuClose}>
            <MenuList>
              {/* Adicione a foto do perfil e informações do usuário aqui */}
              <StyledAvatar>A</StyledAvatar>
      
              {/* Opções do menu */}
              <MenuItem component={StyledLink} to="/perfil" onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Perfil" />
              </MenuItem>
      
              <MenuItem component={StyledLink} to="/configuracoes" onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </MenuItem>
      
              <MenuItem component={StyledLink} to="/logout" onClick={handleMenuClose}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </MenuItem>
            </MenuList>
          </StyledDrawer>
          )}
        </ContentContainer>
      </AppContainer>
    </Router>
  );
};

export default App;
