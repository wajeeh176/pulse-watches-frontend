import React, { useEffect, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Paper imported above
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import PreviewIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import DOMPurify from 'dompurify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import API from '../../api/api';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    images: [],
    // SEO inputs (keywords as comma-separated string in the UI)
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });
  const [imageInput, setImageInput] = useState('');
  const [generatingSEO, setGeneratingSEO] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }), []);

  const quillFormats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'bullet', 'link', 'image'
  ], []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentProduct({
        ...product,
        seoKeywords: Array.isArray(product.seoKeywords) ? product.seoKeywords.join(', ') : (product.seoKeywords || ''),
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || ''
      });
    } else {
      setEditMode(false);
      setCurrentProduct({
        title: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        images: [],
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      });
      setImageInput('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({
      title: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      countInStock: '',
      images: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setImageInput('');
  };

  const handleGenerateSEO = async () => {
    try {
      if (!currentProduct.title && !currentProduct.description) {
        toast.error('Please provide a title or description to generate SEO');
        return;
      }
      setGeneratingSEO(true);
      const res = await API.post('/products/generate-seo', {
        title: currentProduct.title,
        description: currentProduct.description
      });
      console.log('Generate SEO response:', res);
      const { seoTitle, seoDescription, seoKeywords } = res.data || {};
      setCurrentProduct(prev => ({
        ...prev,
        seoTitle: seoTitle || prev.seoTitle,
        seoDescription: seoDescription || prev.seoDescription,
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords.join(', ') : (seoKeywords || prev.seoKeywords)
      }));
      // Log the new state for debug
      console.log('Updated currentProduct after SEO generation:', {
        seoTitle: seoTitle || currentProduct.seoTitle,
        seoDescription: seoDescription || currentProduct.seoDescription,
        seoKeywords: Array.isArray(seoKeywords) ? seoKeywords.join(', ') : (seoKeywords || currentProduct.seoKeywords)
      });
      toast.success('SEO generated successfully');
    } catch (error) {
      console.error('Generate SEO error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate SEO');
    } finally {
      setGeneratingSEO(false);
    }
  };

  const handleSave = async () => {
    try {
      // Coerce numeric fields before sending
      const payload = {
        ...currentProduct,
        price: currentProduct.price !== '' ? Number(currentProduct.price) : undefined,
        countInStock: currentProduct.countInStock !== '' ? Number(currentProduct.countInStock) : undefined,
      };

      if (editMode) {
        await API.put(`/products/${currentProduct._id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', payload);
        toast.success('Product added successfully!');
      }
      handleClose();
      fetchProducts();
    } catch (error) {
      // Log detailed server response for debugging
      console.error('Save product error response:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setCurrentProduct((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setCurrentProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Brand</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.brand || '-'}</TableCell>
                <TableCell>{product.category || '-'}</TableCell>
                <TableCell>Rs. {product.price?.toLocaleString()}</TableCell>
                <TableCell>{product.countInStock}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={currentProduct.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Description</span>
              <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">{(currentProduct.description || '').replace(/<[^>]+>/g, '').length} chars</Typography>
              </span>
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, background: 'rgb(31,34,38)', boxShadow: theme => `0 6px 18px rgba(15,23,42,0.06)` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Tooltip title={previewMode ? 'Exit preview' : 'Preview description'}>
                    <IconButton size="small" onClick={() => setPreviewMode((v) => !v)}>
                      <PreviewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear description">
                    <IconButton size="small" onClick={() => setCurrentProduct(prev => ({ ...prev, description: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary">Rich text editor — HTML will be saved. Use headings & lists.</Typography>
              </Box>

              {previewMode ? (
                <Box sx={{ p: 2, minHeight: 140, borderRadius: 1, background: theme => theme.palette.background.paper }}>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentProduct.description || '') }} />
                </Box>
              ) : (
                <Box sx={{
                  '.ql-toolbar': { borderRadius: '8px 8px 0 0', border: theme => `1px solid ${theme.palette.divider}`, borderBottom: 0, background: 'rgb(31,34,38)', color: '#fff' },
                  '.ql-container': { minHeight: 240, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '0 0 8px 8px', boxShadow: '0 6px 18px rgba(15,23,42,0.04)', background: 'rgb(31,34,38)' },
                  '.ql-editor': { minHeight: 180, fontSize: 15, lineHeight: '1.6', padding: '14px', color: '#ffffff', background: 'transparent' },
                  '.ql-editor.ql-blank::before': { color: 'rgba(255,255,255,0.6)' }
                }}>
                  <ReactQuill
                    theme="snow"
                    value={currentProduct.description || ''}
                    onChange={(value) => setCurrentProduct(prev => ({ ...prev, description: value }))}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write product description here — highlight features, specs, fit, and care instructions."
                  />
                </Box>
              )}
              <Box sx={{ mt: 1 }}>
                <LinearProgress variant="determinate" value={Math.min(100, Math.round(((currentProduct.description || '').replace(/<[^>]+>/g, '').length / 160) * 100))} />
                <Typography variant="caption" color="text.secondary">Recommended meta length: up to 160 characters. ({(currentProduct.description || '').replace(/<[^>]+>/g, '').length} chars)</Typography>
              </Box>
            </Paper>
          </Box>
          <TextField
            label="SEO Title"
            name="seoTitle"
            value={currentProduct.seoTitle}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="SEO Description"
            name="seoDescription"
            value={currentProduct.seoDescription}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="SEO Keywords (comma separated)"
            name="seoKeywords"
            value={currentProduct.seoKeywords}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="e.g., luxury, gold, men"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 1 }}>
            <Button
              variant="outlined"
              onClick={handleGenerateSEO}
              disabled={generatingSEO}
            >
              {generatingSEO ? 'Generating...' : 'Generate SEO'}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Use product title & description to auto-create SEO fields.
            </Typography>
          </Box>
          <TextField
            label="Brand"
            name="brand"
            value={currentProduct.brand}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={currentProduct.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Category"
            name="category"
            value={currentProduct.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="e.g., Men, Women, Luxury"
          />
          <TextField
            label="Count In Stock"
            name="countInStock"
            type="number"
            value={currentProduct.countInStock}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Image Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Product Images
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                label="Image filename (e.g., rolex.png)"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter image filename from /public/images/"
                InputProps={{
                  startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddImage}
                disabled={!imageInput.trim()}
              >
                Add
              </Button>
            </Stack>

            {/* Display Added Images */}
            {currentProduct.images.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Added Images:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {currentProduct.images.map((img, index) => (
                    <Chip
                      key={index}
                      label={img}
                      onDelete={() => handleRemoveImage(index)}
                      deleteIcon={<CloseIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Note: Images should be placed in client/public/images/ folder
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

