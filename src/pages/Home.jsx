import React, {useEffect, useState, useMemo, useCallback} from 'react'
import API from '../api/api'
import axios from 'axios'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

function useQuery(){ return new URLSearchParams(useLocation().search) }

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const q = useQuery()
  const section = q.get('section') || 'featured'
  const searchQ = (q.get('q') || '').toLowerCase()
  const [sort, setSort] = useState('popular')

  useEffect(() => {
    setLoading(true);
    
    // Add cache control headers
    const controller = new AbortController();
    const signal = controller.signal;
    
    API.get("/products", { signal })
      .then((res) => {
        // Handle both array and object response formats
        let productsData = res.data;
        if (productsData && productsData.products && Array.isArray(productsData.products)) {
          productsData = productsData.products;
        } else if (!Array.isArray(productsData)) {
          productsData = [];
        }
        setProducts(productsData || []);
      })
      .catch((e) => {
        if (!axios.isCancel(e)) {
          console.error('Error fetching products:', e);
          console.error('Response:', e.response);
          // Set empty array on error
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));
      
    return () => controller.abort();
  }, []);

  // Memoize the filtering function to avoid unnecessary recalculations
  const filterBy = useCallback((cat, products, searchQuery, sortOrder) => {
    let base = products
    if (cat === 'featured') base = products.slice(0, 12)
    if (cat === 'men') base = products.filter(p => (p.category || '').toLowerCase().includes('men'))
    if (cat === 'women') base = products.filter(p => (p.category || '').toLowerCase().includes('women'))
    if (cat === 'new') base = products.slice(0, 12).reverse()
    if (searchQuery) base = base.filter(p => `${p.title} ${p.description || ''}`.toLowerCase().includes(searchQuery))
    if (sortOrder === 'price-asc') base = [...base].sort((a,b)=>a.price-b.price)
    if (sortOrder === 'price-desc') base = [...base].sort((a,b)=>b.price-a.price)
    return base
  }, [])

  // Memoize the filtered list to prevent recalculation on every render
  const list = useMemo(() => {
    if (!products || products.length === 0) return [];
    return filterBy(section, products, searchQ, sort);
  }, [section, products, searchQ, sort, filterBy])
  const title = section === 'featured' ? 'Featured Watches' : section === 'men' ? "Men's Collection" : section === 'women' ? "Women's Collection" : 'New Arrivals'

  const categories = [
    { name: "Men's Watches", img: '/images/rolex.png', link: '/products?section=men' },
    { name: "Women's Watches", img: '/images/tissot.png', link: '/products?section=women' },
    { name: 'Luxury Collection', img: '/images/patek.png', link: '/products?section=featured' },
    { name: 'New Arrivals', img: '/images/citizen.png', link: '/products?section=new' },
  ]

  return (
    <div>
      <SEO 
        title="Pulse Watches - Premium Luxury Watches in Pakistan"
        description="Discover authentic luxury timepieces from world-renowned brands at Pulse Watches. Browse our collection of premium watches including Rolex, Patek Philippe, Tissot, and Citizen. Fast delivery across Pakistan with 100% authentic guarantee."
        keywords="luxury watches, premium watches, rolex, patek philippe, tissot, citizen, watches pakistan, authentic watches, men watches, women watches, buy watches online"
        url="https://pulsewatches.pk/"
      />
      <Hero title='Discover Premium Watches' subtitle='Authentic timepieces from world-renowned brands • Fast delivery across Pakistan' />
      
      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={800} align="center" gutterBottom>Shop by Category</Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Explore our curated collections
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'nowrap', overflowX: 'auto', pb: 2 }}>
          {categories.map((cat, idx) => (
            <Card 
              key={idx}
              component={RouterLink} 
              to={cat.link}
              href={cat.link}
              sx={{ 
                minWidth: 220,
                maxWidth: 260,
                textDecoration: 'none',
                height: '100%',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                image={cat.img}
                alt={cat.name}
                loading="lazy"
                width="180"
                height="100"
                fetchpriority="low"
                sx={{ 
                  height: 100,
                  width: 180,
                  aspectRatio: '2/1',
                  objectFit: 'contain', 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.02)',
                  display: 'block',
                  minHeight: 100,
                  contentVisibility: 'auto'
                }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} align="center">
                  {cat.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Divider />

      {/* Promotional Banner */}
      <Box sx={{ bgcolor: 'primary.main', color: 'black', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight={800}>Limited Time Offer</Typography>
              <Typography variant="body1">Get free shipping on orders above Rs. 10,000</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/products"
                sx={{ bgcolor: 'black', color: 'primary.main', '&:hover': { bgcolor: '#333' } }}
              >
                Shop Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Products Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>{title}</Typography>
            {searchQ && <Typography variant="body2" color="text.secondary">Search: "{searchQ}"</Typography>}
          </Box>
          <TextField select size="small" label="Sort by" value={sort} onChange={(e)=>setSort(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="popular">Most popular</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={['featured','men','women','new'].indexOf(section)} onChange={(e, idx)=>{
            const next = ['featured','men','women','new'][idx] || 'featured'
            window.history.pushState({}, '', `/?section=${next}${searchQ?`&q=${encodeURIComponent(searchQ)}`:''}`)
          }} variant="scrollable" allowScrollButtonsMobile>
            <Tab label="Featured" />
            <Tab label="Men's" />
            <Tab label="Women's" />
            <Tab label="New" />
          </Tabs>
        </Box>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '600px',
            py: 6 
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ minHeight: '600px' }}>
            {products.length === 0 ? (
              <Typography align="center" sx={{ py: 4, minHeight: '200px' }}>
                No products available. Please check if the server is running and products are seeded.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {list.length > 0 ? (
                  list.map(p=> (
                    <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
                      <ProductCard product={p} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center" sx={{ py: 4, minHeight: '200px' }}>
                      No products match your selection. Try a different category or search term.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        )}
      </Container>

      {/* Trust Indicators */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" fontWeight={900}>100%</Typography>
              <Typography variant="subtitle1" fontWeight={700}>Authentic</Typography>
              <Typography variant="body2" color="text.secondary">Genuine products only</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" fontWeight={900}>24/7</Typography>
              <Typography variant="subtitle1" fontWeight={700}>Support</Typography>
              <Typography variant="body2" color="text.secondary">Always here to help</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" fontWeight={900}>Fast</Typography>
              <Typography variant="subtitle1" fontWeight={700}>Delivery</Typography>
              <Typography variant="body2" color="text.secondary">Pakistan-wide shipping</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
