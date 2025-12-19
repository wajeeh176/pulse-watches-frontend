// client/src/pages/Product.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/api';
import SEO from '../components/SEO';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    API.get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );
  if (!product) return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6">Product not found</Typography>
    </Container>
  );

  const inStock = product.countInStock > 0
  const productUrl = `https://pulsewatches.pk/product/${product.slug}`;
  const productImage = product.images?.[0] 
    ? `https://pulsewatches.pk/images/${product.images[0]}` 
    : 'https://pulsewatches.pk/images/hero-bg.jpg';

  return (
    <>
      <SEO 
        title={`${product.title} - Pulse Watches`}
        description={product.description || `Buy ${product.title} at Pulse Watches. Authentic luxury watch with fast delivery across Pakistan.`}
        keywords={`${product.title}, ${product.brand || ''}, luxury watch, authentic watch, ${product.category || ''}, watches pakistan`}
        image={productImage}
        url={productUrl}
        type="product"
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <Box
              component="img"
              src={`/images/${product.images?.[0] || 'product1.png'}`}
              alt={product.title}
              loading="lazy"
              decoding="async"
              width="800"
              height="520"
              fetchpriority="high"
              sx={{ 
                width: '100%', 
                maxHeight: 520,
                minHeight: 400,
                aspectRatio: '3/4',
                objectFit: 'contain', 
                borderRadius: 1,
                display: 'block',
                // Prevent layout shift
                contentVisibility: 'auto'
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={800} gutterBottom>{product.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {typeof product.description === 'string'
              ? product.description.replace(/^<p>|<\/p>$/gi, '')
              : product.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={800}>Rs. {product.price}</Typography>
            <Chip label={inStock ? 'In Stock' : 'Out of Stock'} color={inStock ? 'success' : 'error'} variant="outlined" />
          </Box>
          <Button
            size="large"
            variant="contained"
            color="primary"
            disabled={!inStock}
            onClick={() => {
              dispatch({ type: 'ADD_ITEM', payload: product });
              toast.success('Added to cart!');
            }}
          >
            Add to cart
          </Button>
          <Box sx={{ mt: 6, p: 2, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Why buy from Pulse Watches?</Typography>
            <ul>
              <li>Authentic brands & warranty</li>
              <li>Cash on Delivery across Pakistan</li>
              <li>Free shipping above Rs. 10,000</li>
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}
