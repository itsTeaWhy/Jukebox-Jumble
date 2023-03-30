import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/music-logo.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
// import LogInGoogle from "./LogInGoogle";
// import { GoogleLogout } from "react-google-login";
// import { GoogleLogin } from "react-google-login";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Link,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

const Logo = styled('img')({
  height: '100%',
  marginRight: '1rem',
});

function Navbar({ setLoggedIn, loggedIn }) {
  const cookie = Cookies.get('loggedIn');
  const navigate = useNavigate();
  console.log(loggedIn);

  const handleLogout = () => {
    setLoggedIn(false);
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie)); // remove all cookies
    navigate('/login');
    window.location.reload();
  };
  // navigate("/login");
  return (
    <AppBar position='static'>
      <Toolbar>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <Box display='flex' alignItems='center'>
            <IconButton
              className='login-button'
              edge='start'
              color='inherit'
              onClick={() => (loggedIn ? navigate('/') : navigate('/login'))}
            >
              <Logo src={logo} alt='logo' />
            </IconButton>
            <Button color='inherit' onClick={() => navigate('/rules')}>
              Rules
            </Button>
          </Box>
          <Box>
            <Button color='inherit' onClick={() => navigate('/about')}>
              About Us
            </Button>

            {!loggedIn ? (
              <>
                <Button color='inherit' onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color='inherit' onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {' '}
                <Button color='inherit' onClick={handleLogout}>
                  Sign Out
                </Button>
                <Button color='inherit' onClick={() => navigate('/leaders')}>
                  Leaderboards
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
