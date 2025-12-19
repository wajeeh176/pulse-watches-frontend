import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import API from '../../api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products'),
          API.get('/auth/users')
        ]);

        const orders = ordersRes.data || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: productsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          recentOrders: orders.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUpIcon />, color: '#4caf50' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCartIcon />, color: '#2196f3' },
    { title: 'Total Products', value: stats.totalProducts, icon: <InventoryIcon />, color: '#ff9800' },
    { title: 'Total Users', value: stats.totalUsers, icon: <PeopleIcon />, color: '#9c27b0' },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the admin panel. Here's an overview of your store.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', bgcolor: card.color, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {card.title}
                  </Typography>
                  {card.icon}
                </Box>
                <Typography variant="h4" fontWeight={900}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recent Orders
        </Typography>
        {stats.recentOrders.length === 0 ? (
          <Typography color="text.secondary">No orders yet</Typography>
        ) : (
          <Box>
            {stats.recentOrders.map((order) => (
              <Box
                key={order._id}
                sx={{
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress?.name || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                  Rs. {order.totalPrice?.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

