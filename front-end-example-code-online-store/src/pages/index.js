// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
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

const index = () => {
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
              <Button color="inherit" component={StyledLink} to="/itens-gerais">
                Itens Gerais
              </Button>
              <Button color="inherit" component={StyledLink} to="/itens-pessoais">
                Itens Pessoais
              </Button>
            </div>
          </StyledToolbar>
        </StyledAppBar>

        <ContentContainer>
          <Outlet />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscreva-se" element={<SignUp />} />
            <Route path="/itens-gerais" element={<GeneralItems />} />
            <Route path="/itens-pessoais" element={<PersonalItems />} />
            <Route path="/token" element={<h3>token</h3>} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
};

export default index;
