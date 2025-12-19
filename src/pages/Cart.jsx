import React from "react";
import { useCart } from "../context/CartContext";
import { Link as RouterLink } from "react-router-dom";
import SEO from "../components/SEO";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function Cart() {
  const { state, dispatch } = useCart();
  const { cartItems } = state;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <SEO 
        title="Shopping Cart - Pulse Watches"
        description="Review your shopping cart items before checkout."
        url="https://pulsewatches.pk/cart"
        noindex={true}
        nofollow={true}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} align="center" gutterBottom>Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography align="center">Your cart is empty. <Button component={RouterLink} to="/" href="/" variant="text">Go Shopping</Button></Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cartItems.map(item => (
                <Grid item xs={12} key={item._id}>
                  <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box 
                      component="img" 
                      src={`/images/${item.images?.[0]}`} 
                      alt={item.title} 
                      loading="lazy" 
                      decoding="async"
                      width="120"
                      height="120"
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        aspectRatio: '1/1',
                        objectFit: 'contain', 
                        borderRadius: 1,
                        display: 'block',
                        flexShrink: 0
                      }} 
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Rs. {item.price}</Typography>
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ min: 1 }}
                          value={item.qty}
                          onChange={e =>
                            dispatch({ type: "UPDATE_QTY", payload: { _id: item._id, qty: +e.target.value } })
                          }
                          sx={{ width: 90 }}
                        />
                        <Button color="error" onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item._id })}>Remove</Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Total: Rs. {totalPrice}</Typography>
              <Button component={RouterLink} to="/checkout" href="/checkout" variant="contained" color="primary" fullWidth>
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
    </>
  );
}
