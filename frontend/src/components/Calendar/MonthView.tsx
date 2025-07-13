// import React from 'react'; // Not needed in React 17+ with new JSX transform
import { Box, Typography, styled } from '@mui/material';

interface MonthViewProps {
  monthKey: string;
  month: string;
  entries: Array<{
    date: string;
    rating: string;
    id?: number;
  }>;
}

const CalendarGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '3px',
  maxWidth: '280px',
  margin: '0 auto',
  justifyItems: 'center',
  placeItems: 'center',
  gridAutoFlow: 'row',
}));

const DayHeaders = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '3px',
  maxWidth: '280px',
  margin: '0 auto 8px auto',
  justifyItems: 'center',
  placeItems: 'center',
}));

const DayHeader = styled(Typography)(() => ({
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'rgba(71, 85, 105, 0.7)',
  textAlign: 'center',
  width: '35px',
}));

const DaySquare = styled(Box)<{ rating?: string; isEmpty?: boolean }>(({ theme, rating, isEmpty }) => {
  let backgroundColor = 'rgba(255, 255, 255, 0.4)'; // Default soft white
  let borderColor = 'rgba(255, 255, 255, 0.3)';
  
  if (isEmpty) {
    backgroundColor = 'transparent'; // Transparent for empty padding squares
  } else {
    switch (rating) {
      case 'good':
        backgroundColor = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'; // Modern green gradient
        borderColor = 'rgba(34, 197, 94, 0.3)';
        break;
      case 'okay':
        backgroundColor = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'; // Modern yellow gradient
        borderColor = 'rgba(245, 158, 11, 0.3)';
        break;
      case 'bad':
        backgroundColor = 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'; // Modern red gradient
        borderColor = 'rgba(239, 68, 68, 0.3)';
        break;
      default:
        backgroundColor = 'rgba(148, 163, 184, 0.6)'; // Medium gray for no data/future
        borderColor = 'rgba(148, 163, 184, 0.4)';
    }
  }

  return {
    width: '35px',
    height: '35px',
    maxWidth: '35px',
    maxHeight: '35px',
    background: backgroundColor,
    borderRadius: '10px',
    border: `1px solid ${borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: rating ? theme.palette.common.white : 'rgba(71, 85, 105, 0.6)',
    cursor: 'default',
    boxShadow: rating ? '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(8px)',
  };
});

const MonthView: React.FC<MonthViewProps> = ({ monthKey, month, entries }) => {
  // Create a map of entries by date for quick lookup
  const entriesMap = new Map(entries.map(entry => [entry.date, entry.rating]));
  
  // Get the first day of the month and number of days
  const [year, monthNum] = monthKey.split('-');
  const firstDay = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  const lastDay = new Date(parseInt(year), parseInt(monthNum), 0);
  // const startOfWeek = firstDay.getDay(); // 0 = Sunday (not currently used)
  const daysInMonth = lastDay.getDate();
  
  // Check if this is the current month and find the most recent filled date
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const isCurrentMonth = parseInt(year) === currentYear && parseInt(monthNum) === currentMonth;
  
  // let mostRecentFilledDate = null; // Not currently used
  // if (isCurrentMonth) {
  //   // Find the most recent date with data
  //   for (let day = daysInMonth; day >= 1; day--) {
  //     const dateString = `${year}-${monthNum.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  //     if (entriesMap.has(dateString)) {
  //       mostRecentFilledDate = day;
  //       break;
  //     }
  //   }
  // }
  
  // Create array of all calendar squares (no empty ones at start)
  const calendarSquares = [];
  
  // Add squares for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${monthNum.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const rating = entriesMap.get(dateString);
    const isToday = dateString === new Date().toISOString().split('T')[0];
    const isFuture = new Date(dateString) > new Date();
    
    const showDateNumber = isCurrentMonth && rating;
    
    calendarSquares.push(
      <DaySquare 
        key={day} 
        rating={isFuture ? undefined : rating}
        sx={{
          border: isToday && rating ? '2px solid #1976d2' : 'none',
        }}
        title={rating ? `${dateString}: ${rating}` : dateString}
      >
        {showDateNumber ? day : ''}
      </DaySquare>
    );
  }

  return (
    <Box sx={{
      background: 'rgba(248, 250, 252, 0.8)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      p: 3,
      mb: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(226, 232, 240, 0.4)',
    }}>
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        textAlign="center"
        sx={{ 
          mb: 3, 
          fontWeight: 500,
          color: '#64748b',
          fontSize: { xs: '1.1rem', sm: '1.2rem' }
        }}
      >
        {month}
      </Typography>
      
      <DayHeaders>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <DayHeader key={index}>{day}</DayHeader>
        ))}
      </DayHeaders>
      
      <CalendarGrid>
        {calendarSquares}
      </CalendarGrid>
    </Box>
  );
};

export default MonthView;