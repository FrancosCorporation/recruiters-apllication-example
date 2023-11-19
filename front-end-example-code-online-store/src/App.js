// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signup';
import GeneralItems from './pages/generalitems';
import PersonalItems from './pages/personalitems';
import styled from 'styled-components';
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

// ... (importações e código anterior)

const App = () => {
  const [anchorElGerais, setAnchorElGerais] = useState(null);
  const [anchorElPessoais, setAnchorElPessoais] = useState(null);

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

  return (
    <Router>
      <AppContainer>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Button color="inherit" component={StyledLink} to="/">
              Logo
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
        </ContentContainer>
      </AppContainer>
    </Router>
  );
};

export default App;
