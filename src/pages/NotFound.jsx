import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SEO from '../components/SEO';

export default function NotFound(){
  return (
    <>
      <SEO 
        title="404 - Page Not Found - Pulse Watches"
        description="The page you are looking for could not be found."
        url="https://pulsewatches.pk/404"
        noindex={true}
      />
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h2" fontWeight={900}>404</Typography>
      <Typography variant="h6" color="text.secondary">Page not found</Typography>
    </Container>
    </>
  )
}


