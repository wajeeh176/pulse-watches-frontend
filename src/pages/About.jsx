import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SEO from '../components/SEO';

export default function About(){
  const features = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: '100% Authentic',
      description: 'Every watch is guaranteed authentic with proper documentation and verification.'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Fast Delivery',
      description: 'Pakistan-wide delivery with tracking. Free shipping on orders above Rs. 10,000.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Warranty Support',
      description: 'All watches come with manufacturer warranty and our dedicated support.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Our customer service team is always ready to assist you with any queries.'
    }
  ];

  return (
    <Box>
      <SEO 
        title="About Us - Pulse Watches"
        description="Learn about Pulse Watches, Pakistan's premier destination for authentic luxury timepieces. We offer 100% authentic watches with fast delivery and exceptional customer service."
        keywords="about pulse watches, luxury watches pakistan, authentic watches, watch store pakistan, premium watches"
        url="https://pulsewatches.pk/about"
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
            About Pulse Watches
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ maxWidth: 700, mx: 'auto' }}>
            Pakistan's premier destination for authentic luxury timepieces
          </Typography>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Founded with a passion for horology, Pulse Watches has become Pakistan's most trusted source for authentic luxury watches. We understand that a watch is more than just a timepiece—it's a statement of style, a mark of achievement, and often, a cherished heirloom.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our commitment to authenticity, quality service, and customer satisfaction has made us the go-to destination for watch enthusiasts across the country. Every piece in our collection is carefully selected and verified to ensure you receive only the finest timepieces.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              height: 400, 
              borderRadius: 3, 
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <Box
                component="img"
                src="/images/rolex.png"
                alt="Luxury Watch Collection"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
                sx={{ 
                  width: '80%', 
                  height: 'auto',
                  maxHeight: 400,
                  aspectRatio: '3/2',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  display: 'block'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} align="center" gutterBottom sx={{ mb: 6 }}>
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    textAlign: 'center',
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
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          To make luxury timepieces accessible to everyone in Pakistan while maintaining the highest standards of authenticity and service. We believe everyone deserves to own a watch that tells their unique story.
        </Typography>
      </Container>
    </Box>
  )
}


