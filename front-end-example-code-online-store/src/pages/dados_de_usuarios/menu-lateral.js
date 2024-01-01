import { React, useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MenuList, Drawer, Avatar, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/menuLateral.css';
import { decryptData } from '../functions/security';
import UploadPhoto from '../components/upload'; // Importe o componente UploadPhoto
const secretkey = process.env.REACT_APP_SECRET_KEY;

const MenuLateral = ({ isOpen, onClose }) => {
  const [name, setName] = useState('Profile');
  const [urlFoto, setUrlFoto] = useState('P');
  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);
  
  const handleAvatarClick = () => {
    // Chame a função que renderiza o UploadPhoto quando o Avatar for clicado
    setUploadPhotoVisible(!isUploadPhotoVisible);
  };

  useEffect(() => {
    // Obter dados da localStorage e tentar decifrá-los
    const dadosString = localStorage.getItem('dados');
    const dados = dadosString ? decryptData(dadosString, secretkey) : null;

    // Verificar se os dados são válidos antes de atualizar os estados
    if (dados && dados.name) {
      setName(dados.name);
    }

    if (dados && dados.foto) {
      setUrlFoto(dados.foto);
    }
  }, []);


  return (
    <Drawer className='menulateral' anchor="right" open={isOpen} onClose={onClose}>
      <MenuList>
        {/* Adicione a foto do perfil e informações do usuário aqui */}
        <Avatar className="Avatar-profile" alt="Foto do Perfil" src={urlFoto} onClick={handleAvatarClick}>
          P
        </Avatar>
        <Typography className="typography">{name}</Typography>

        {/* Opções do menu */}
        <MenuItem component={Link} to="/perfil" onClick={onClose}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Perfil" />
        </MenuItem>

        {isUploadPhotoVisible && <UploadPhoto />}

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
