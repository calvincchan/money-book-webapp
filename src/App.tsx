import { Box, Card } from '@mui/material';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import './App.css';

interface DayCard {
  label: string;
  key: string;
  state: string;
  dayOfWeek: string;
}

function App() {
  /** Day of week headers */
  const headers: string[] = useMemo(() => {
    const result: string[] = [];
    let date = moment().startOf("week");
    for (let i = 0; i < 7; i++) {
      result.push(date.format("ddd"));
      date.add(1, 'day');
    }
    return result;
  }, []);

  /** Day cards */
  const [dayCards, setDayCards] = useState<DayCard[]>([]);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  useEffect(() => {
    const newValue: DayCard[] = [];
    const stopDate = moment(activeDate).endOf("month");
    for (const cursor = moment(activeDate).startOf("month"); cursor.isBefore(stopDate); cursor.add(1, "day")) {
      newValue.push({
        label: cursor.format("D"),
        key: cursor.toISOString(),
        state: "normal",
        dayOfWeek: cursor.format("e")
      })
    }
    setDayCards(newValue)
  }, [activeDate])

  return (
    <main>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {headers.map(header => 
          <Card sx={{minHeight:"2em"}}>{header}</Card>
        )}
        {dayCards.map(dayCard => 
          <Card sx={{minHeight:"5em", gridColumn: dayCard.dayOfWeek}} key={dayCard.key} >{dayCard.label}</Card>
        )}
      </Box>
    </main>
  );
}

export default App;
