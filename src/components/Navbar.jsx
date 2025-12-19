import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={2} 
      sx={{ 
        backdropFilter: 'blur(10px)', 
        bgcolor: 'rgba(15, 23, 32, 0.95)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1.5 }}>
          {/* Logo */}
          <Button component={Link} to="/" href="/" color="inherit" sx={{ gap: 1.5, minWidth: 'auto' }}>
            <Box 
              component="img" 
              src={logo} 
              alt="Pulse Watches" 
              width="45"
              height="45"
              loading="eager"
              fetchpriority="high"
              sx={{ 
                width: 45, 
                height: 45,
                minWidth: 45,
                minHeight: 45,
                borderRadius: 2,
                display: 'block',
                flexShrink: 0,
                // Prevent layout shift
                aspectRatio: '1/1'
              }} 
            />
            <Typography variant="h6" fontWeight={800} sx={{ display: { xs: 'none', sm: 'block' } }}>Pulse Watches</Typography>
          </Button>

          {/* Search Bar */}
          <Box sx={{ flex: 1, maxWidth: 500, mx: 3, display: { xs: 'none', lg: 'block' } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search watches..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/?q=${encodeURIComponent(q)}`)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center' }}>
            <Button component={Link} to="/products?section=featured" href="/products?section=featured" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>Featured</Button>
            <Button component={Link} to="/products?section=men" href="/products?section=men" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>Men's</Button>
            <Button component={Link} to="/products?section=women" href="/products?section=women" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>Women's</Button>
            <Button component={Link} to="/products?section=new" href="/products?section=new" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>New</Button>
            <Button component={Link} to="/cart" href="/cart" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>Cart</Button>
            <Button component={Link} to="/about" href="/about" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>About</Button>
            <Button component={Link} to="/contact" href="/contact" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(196, 151, 91, 0.1)' } }}>Contact</Button>
          </Stack>

          {/* User Actions */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 'auto' }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ display: { xs: 'none', lg: 'inline-flex' }, mr: 1 }}>Hi, {user.name}</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" href="/login" color="inherit" size="small">Login</Button>
                <Button component={Link} to="/register" href="/register" variant="contained" color="primary" size="small">Register</Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
