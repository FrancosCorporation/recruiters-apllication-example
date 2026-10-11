import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MenuList, Drawer, Avatar, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/menuLateral.css';
import UploadPhoto from '../components/upload';

function readProfile() {
  try {
    return JSON.parse(window.sessionStorage.getItem('dados') || '{}');
  } catch {
    return {};
  }
}

const MenuLateral = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(readProfile);
  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  const handleLogout = () => {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('dados');
    onClose();
    window.location.assign('/login');
  };

  return (
    <Drawer className="menulateral" anchor="right" open={isOpen} onClose={onClose}>
      <MenuList>
        <Avatar className="Avatar-profile" alt="Foto do perfil" src={profile.foto || undefined} onClick={() => setUploadPhotoVisible((visible) => !visible)}>
          {(profile.name || 'P').charAt(0).toUpperCase()}
        </Avatar>
        <Typography className="typography">{profile.name || 'Meu perfil'}</Typography>
        <MenuItem component={Link} to="/perfil" onClick={onClose}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Perfil" />
        </MenuItem>
        {isUploadPhotoVisible && <UploadPhoto />}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </MenuList>
    </Drawer>
  );
};

export default MenuLateral;
