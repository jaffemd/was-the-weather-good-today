import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getCalendarData } from '../../services/api';
import type { CalendarData } from '../../services/api';
import MonthView from './MonthView';

const CalendarGrid: React.FC = () => {
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCalendarData();
      setCalendarData(data);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Refresh data when the page becomes visible again (e.g., after navigating back from form)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCalendarData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Sort months chronologically (newest first)
  const sortedMonths = Object.keys(calendarData)
    .sort((a, b) => new Date(b + '-01').getTime() - new Date(a + '-01').getTime());

  return (
    <Box sx={{ p: 0 }}>
      {/* App Title */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        pt: 2
      }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 400,
            color: '#4a5568',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Was The Weather Nice Enough To Spend Time Outside?
        </Typography>
      </Box>
      
      {sortedMonths.length === 0 ? (
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography variant="body1" color="text.secondary">
            No weather data available yet. Visit /set_weather to add your first entry!
          </Typography>
        </Box>
      ) : (
        sortedMonths.map((monthKey) => (
          <MonthView 
            key={monthKey}
            monthKey={monthKey}
            month={calendarData[monthKey].month}
            entries={calendarData[monthKey].entries}
          />
        ))
      )}
    </Box>
  );
};

export default CalendarGrid;