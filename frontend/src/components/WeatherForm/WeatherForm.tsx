import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { saveWeatherEntry } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const WeatherForm: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRatingChange = (event: SelectChangeEvent) => {
    setRating(event.target.value);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!date || !rating) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await saveWeatherEntry({
        date,
        rating: rating as 'good' | 'bad' | 'okay'
      });
      
      setSuccess(true);
      
      // Redirect to calendar after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error('Error saving weather entry:', err);
      setError('Failed to save weather entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Was the weather nice today?
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Weather entry saved successfully! Redirecting to calendar...
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          disabled={loading}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="rating-label">Weather Rating</InputLabel>
        <Select
          labelId="rating-label"
          value={rating}
          label="Weather Rating"
          onChange={handleRatingChange}
          disabled={loading}
        >
          <MenuItem value="good">Good</MenuItem>
          <MenuItem value="okay">Okay</MenuItem>
          <MenuItem value="bad">Bad</MenuItem>
        </Select>
      </FormControl>

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={!date || !rating || loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Saving...' : 'Save Weather Entry'}
      </Button>
    </Box>
  );
};

export default WeatherForm;