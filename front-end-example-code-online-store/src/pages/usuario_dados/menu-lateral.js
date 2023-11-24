import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MenuList, Drawer, Avatar, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/menuLateral.css';

const MenuLateral = ({ isOpen, onClose }) => {

  return (
    <Drawer className='menulateral' anchor="right" open={isOpen} onClose={onClose}>
      <MenuList>
        {/* Adicione a foto do perfil e informações do usuário aqui */}
        <Avatar className="Avatar-profile">P</Avatar>;

        {/* Opções do menu */}
        <MenuItem component={Link} to="/perfil" onClick={onClose}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Perfil" />
        </MenuItem>

        <MenuItem component={Link} to="/configuracoes" onClick={onClose}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </MenuItem>

        <MenuItem component={Link} to="/logout" onClick={onClose}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </MenuList>

    </Drawer>
  );
};

export default MenuLateral;
