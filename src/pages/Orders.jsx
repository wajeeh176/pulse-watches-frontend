import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import API from '../api/api';
import SEO from '../components/SEO';

export default function Orders(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    API.get('/orders/mine')
      .then(res=> setOrders(res.data || []))
      .catch(()=>{})
      .finally(()=> setLoading(false));
  },[])

  return (
    <>
      <SEO 
        title="My Orders - Pulse Watches"
        description="View your order history and track your purchases."
        url="https://pulsewatches.pk/orders"
        noindex={true}
        nofollow={true}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>My Orders</Typography>
      {loading ? 'Loading...' : (
        <Grid container spacing={2}>
          {orders.map(order => (
            <Grid item xs={12} key={order._id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>Order #{order._id}</Typography>
                <Typography variant="body2" color="text.secondary">Total: Rs. {order.totalPrice}</Typography>
                <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                  {order.orderItems?.map(it => (
                    <li key={`${order._id}-${it.product}`}>{it.qty} x {it.product?.title || it.product} — Rs. {it.price * it.qty}</li>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
          {orders.length === 0 && (
            <Grid item xs={12}><Typography>No orders yet.</Typography></Grid>
          )}
        </Grid>
      )}
    </Container>
    </>
  )
}


