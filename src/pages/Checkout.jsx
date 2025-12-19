import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import SEO from '../components/SEO';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { state, dispatch } = useCart();
  const { cartItems } = state;
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !address) return toast.error('Please fill all fields');
    if (!cartItems.length) return toast.error('Your cart is empty');

    const orderItems = cartItems.map(item => ({ product: item._id, qty: item.qty, price: item.price }));
    const shippingAddress = { name, email, address };

    try {
      await API.post('/orders', { orderItems, shippingAddress, paymentMethod: 'Cash on Delivery', totalPrice }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: 'CLEAR_CART' });
      setSubmitted(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Order could not be placed');
    }
  };

  const handleStripeCheckout = async () => {
    if (!name || !email || !address) return toast.error('Please fill all fields');
    if (!cartItems.length) return toast.error('Your cart is empty');

    try {
      const items = cartItems.map(item => ({ _id: item._id, title: item.title, price: item.price, qty: item.qty, description: item.description || item.title }));
      const shippingAddress = { name, email, address };
      const res = await API.post('/payments/create-checkout-session', { items, shippingAddress }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Could not create checkout session');
        console.error('Stripe create session response:', res);
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  if (submitted)
    return (
      <>
        <SEO 
          title="Order Confirmed - Pulse Watches"
          description="Your order has been placed successfully."
          url="https://pulsewatches.pk/checkout"
          noindex={true}
          nofollow={true}
        />
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>🎉 Thank You!</Typography>
        <Typography variant="h6" color="text.secondary">Your order has been placed successfully.</Typography>
      </Container>
      </>
    );

  if (!cartItems.length)
    return (
      <>
        <SEO 
          title="Checkout - Pulse Watches"
          description="Complete your order."
          url="https://pulsewatches.pk/checkout"
          noindex={true}
          nofollow={true}
        />
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>🛒 Your cart is empty</Typography>
        <Typography variant="h6" color="text.secondary">Add some products to proceed to checkout.</Typography>
      </Container>
      </>
    );

  return (
    <>
      <SEO 
        title="Checkout - Pulse Watches"
        description="Complete your order and shipping information."
        url="https://pulsewatches.pk/checkout"
        noindex={true}
        nofollow={true}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} align="center" gutterBottom>Checkout</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Shipping Information</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
              <TextField type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required sx={{ mb: 2 }} />
              <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} fullWidth required multiline minRows={3} sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>Place Order</Button>
              <Button type="button" variant="outlined" color="secondary" fullWidth onClick={handleStripeCheckout}>Pay with Card</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {cartItems.map(item => (
                <Box component="li" key={item._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <Box 
                      component="img" 
                      src={`/images/${item.images?.[0]}`} 
                      alt={item.title} 
                      loading="lazy" 
                      decoding="async"
                      width="56"
                      height="56"
                      sx={{ 
                        width: 56, 
                        height: 56,
                        aspectRatio: '1/1',
                        objectFit: 'cover', 
                        borderRadius: 1,
                        display: 'block',
                        flexShrink: 0
                      }} 
                    />
                    <Typography variant="body2">{item.title} x {item.qty}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>Rs. {item.price * item.qty}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 2, textAlign: 'right' }}>Total: Rs. {totalPrice}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}
