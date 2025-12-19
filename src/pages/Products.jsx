import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../api/api';
import SEO from '../components/SEO';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get('section') || 'all';

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get('/products')
      .then(res => {
        if (!mounted) return;
        setProducts(res.data || []);
      })
      .catch(err => console.error('Failed to fetch products:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Memoize filtered products for all sections
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (section === 'new') {
      // Show most recent 12 products (assuming latest are last in array)
      return [...products].slice(-12).reverse();
    }
    if (section === 'featured') {
      // Show first 12 products as featured
      return products.slice(0, 12);
    }
    if (section === 'men') {
      // Filter products with category containing 'men'
      return products.filter(p => (p.category || '').toLowerCase().includes('men'));
    }
    if (section === 'women') {
      // Filter products with category containing 'women'
      return products.filter(p => (p.category || '').toLowerCase().includes('women'));
    }
    return products;
  }, [products, section]);

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <>
      <SEO title={section === 'new' ? 'New Arrivals - Pulse Watches' : 'Products - Pulse Watches'} description={section === 'new' ? 'Browse the latest arrivals' : 'Browse all products'} url={`https://pulsewatches.pk/products${section === 'new' ? '?section=new' : ''}`} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {section === 'new' && 'New Arrivals'}
          {section === 'featured' && 'Featured Watches'}
          {section === 'men' && "Men's Collection"}
          {section === 'women' && "Women's Collection"}
          {['all', '', null, undefined].includes(section) && 'All Products'}
        </Typography>
        <Grid container spacing={3}>
          {filteredProducts.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
