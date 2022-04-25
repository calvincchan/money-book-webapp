import { ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import { AppBar, Box, Button, Card, CardContent, IconButton, Toolbar, Typography } from '@mui/material';
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
  const [activeDate, setActiveDate] = useState<moment.Moment>(moment());
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

  const goPreviousMonth = () => {
    const newDate = moment(activeDate).subtract(1, "month");
    setActiveDate(newDate);
  }

  const goNextMonth = () => {
    const newDate = moment(activeDate).add(1, "month")
    setActiveDate(newDate);
  }

  const goToday = () => {
    const newDate = moment();
    setActiveDate(newDate);
  }

  return (
    <Box sx={{display: "flex", flexDirection: "column"}}>
      <AppBar position="static">
        <Toolbar variant="regular">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            Dollar Book
          </Typography>
          <IconButton color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={goPreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{width: "10em", textAlign: "center"}}>
            {activeDate.format("MMMM YYYY")}
          </Typography>
          <IconButton color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={goNextMonth}>
            <ChevronRight />
          </IconButton>
          <Button color="inherit" variant="outlined" disableElevation onClick={goToday}>Today</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
      }}>
        <Box
          sx={{
            m: 1,
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(7, 1fr)'
          }}
        >
          {headers.map(header => 
            <Box sx={{textAlign: "center"}}>{header}</Box>
          )}
          {dayCards.map(dayCard => 
            <Card sx={{gridColumn: dayCard.dayOfWeek}} key={dayCard.key}>
              <CardContent>
                {dayCard.label}
              </CardContent>
              </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
