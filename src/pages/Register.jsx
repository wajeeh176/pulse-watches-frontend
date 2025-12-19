// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import SEO from '../components/SEO';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <>
      <SEO 
        title="Register - Pulse Watches"
        description="Create a new account with Pulse Watches to start shopping for luxury timepieces."
        url="https://pulsewatches.pk/register"
        noindex={true}
        nofollow={true}
      />
      <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={800} align="center" gutterBottom>Register</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
}
