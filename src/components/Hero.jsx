import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Link as RouterLink } from 'react-router-dom'

export default function Hero({ title = 'Luxury Watches', subtitle = 'Premium collections' }){
  return (
    <Box
      component="section"
      role="region"
      aria-label="Hero section"
      sx={{
        position: 'relative',
        minHeight: { xs: '400px', md: '500px' },
        height: { xs: '400px', md: '500px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        // Prevent layout shift - reserve space
        backgroundColor: '#0e0e10',
        // Optimize rendering
        willChange: 'auto'
      }}
    >
      {/* Optimized hero image for LCP - Single source for fastest load */}
      {/* For LCP, use single optimized image rather than picture element to avoid delay */}
      <Box
        component="img"
        src="/images/hero-bg.jpg"
        alt=""
        role="presentation"
        width="1920"
        height="800"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        sizes="100vw"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          // Prevent layout shift - exact dimensions
          minWidth: '100%',
          minHeight: '100%',
          // Optimize rendering for faster paint
          willChange: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(14,14,16,0.85) 0%, rgba(14,14,16,0.70) 100%)',
          zIndex: 1
        }}
      />
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <Container maxWidth="md">
          <Typography 
          variant="overline" 
          sx={{ 
            color: 'primary.main', 
            letterSpacing: 3, 
            fontWeight: 700,
            mb: 2,
            display: 'block',
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}
        >
          PREMIUM COLLECTION
        </Typography>
        <Typography 
          variant="h1" 
          fontWeight={900} 
          sx={{ 
            color: 'white',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.1
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.85)',
            mb: 5,
            maxWidth: 600,
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          {subtitle}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
          <Button 
            component={RouterLink} 
            to="/products"
            href="/products"
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ px: 5, py: 1.8, fontWeight: 700, fontSize: '1.1rem' }}
          >
            Shop Now
          </Button>
          {/* Removed New Arrivals button */}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
