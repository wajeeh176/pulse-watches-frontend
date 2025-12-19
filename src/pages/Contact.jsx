import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

export default function Contact(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    // Validation
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact', {
        name,
        email,
        subject,
        message
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Clear form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'support@pulsewatches.pk',
      subtitle: 'Send us an email anytime'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      content: '+92 300 1234567',
      subtitle: 'Mon-Sat from 10am to 8pm'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Location',
      content: 'Karachi, Pakistan',
      subtitle: 'Pakistan-wide delivery'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Working Hours',
      content: '10:00 AM - 8:00 PM',
      subtitle: 'Monday to Saturday'
    }
  ];

  return (
    <Box>
      <SEO 
        title="Contact Us - Pulse Watches"
        description="Get in touch with Pulse Watches. Contact our customer service team for inquiries about luxury watches, orders, or any questions. We're here to help 24/7."
        keywords="contact pulse watches, watch store contact, luxury watches inquiry, customer service pakistan, watch questions"
        url="https://pulsewatches.pk/contact"
      />
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        py: 8, 
        borderBottom: 1, 
        borderColor: 'divider',
        backgroundImage: 'linear-gradient(135deg, rgba(196, 151, 91, 0.05) 0%, rgba(15, 23, 32, 0.8) 100%)'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={900} align="center" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 700, mx: 'auto' }}>
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{info.icon}</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {info.title}
                </Typography>
                <Typography variant="body1" color="text.primary" gutterBottom>
                  {info.content}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Send Us a Message
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Fill out the form below and our team will get back to you within 24 hours.
            </Typography>
            <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider' }}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField 
                  label="Your Name" 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  fullWidth 
                  sx={{ mb: 3 }} 
                  required
                  disabled={loading}
                />
                <TextField 
                  type="email" 
                  label="Your Email" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  fullWidth 
                  sx={{ mb: 3 }} 
                  required
                  disabled={loading}
                />
                <TextField 
                  label="Subject" 
                  value={subject} 
                  onChange={e=>setSubject(e.target.value)} 
                  fullWidth 
                  sx={{ mb: 3 }} 
                  required
                  disabled={loading}
                  placeholder="What is this regarding?"
                />
                <TextField 
                  label="Your Message" 
                  value={message} 
                  onChange={e=>setMessage(e.target.value)} 
                  fullWidth 
                  multiline 
                  minRows={5} 
                  sx={{ mb: 3 }} 
                  required
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />} 
                  color="primary" 
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Visit Our Store
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Experience our collection in person. Our team of watch experts is ready to help you find the perfect timepiece.
            </Typography>
            <Paper 
              elevation={0}
              sx={{ 
                height: 400, 
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <LocationOnIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Karachi, Pakistan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Delivering luxury timepieces across Pakistan
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} align="center" gutterBottom sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Do you offer cash on delivery?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Yes! We offer cash on delivery for all orders across Pakistan.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Are all watches authentic?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Absolutely. Every watch comes with authentication certificates and manufacturer warranty.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                What is your return policy?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We offer a 7-day return policy for unworn watches in original packaging.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}


