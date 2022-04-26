import { Add, ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import { AppBar, Box, Button, Card, CardActionArea, CardActions, CardContent, IconButton, Toolbar, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { DaySummary, getMonth, Month, postTransaction } from "./api";
import './App.css';
import { onCloseParams, TransactionDialog } from "./TransactionDialog";

interface DayCard {
  label: string;
  key: string;
  date: Date;
  value: number;
  dayOfWeek: number;
}

function App() {
  /** Day of week headers */
  const headers: string[] = useMemo(() => {
    const result: string[] = [];
    const date = moment().startOf("week");
    for (let i = 0; i < 7; i++) {
      result.push(date.format("ddd"));
      date.add(1, 'day');
    }
    return result;
  }, []);

  /** Day cards */
  const [dayCards, setDayCards] = useState<DayCard[]>([]);
  const [activeDate, setActiveDate] = useState<moment.Moment>(moment());
  const [addDialog, setAddDialog] = useState(false);

  /** Month data */
  const [month, setMonth] = useState<Month | null>(null);
  useEffect(() => {
    (async () => {
      /** Fetch month summary */
      if (activeDate) {
        const res = await getMonth(activeDate.get("year"), activeDate.get("month") + 1);
        const monthSummary = res.data;
        if (!monthSummary) {
          alert("Unexpected error: unable to get month");
        }
        setMonth(monthSummary);
     
        /** Update data card */
        const newDayCard: DayCard[] = [];
        const cursor = moment().year(monthSummary.year).month(monthSummary.month-1);
        const days = monthSummary.days as DaySummary[];
        for (const day of days) {
          cursor.date(day.day);
          newDayCard.push({
            label: cursor.format("D"),
            value: day.value,
            key: cursor.toISOString(),
            date: cursor.toDate(),
            dayOfWeek: cursor.weekday()
          });
        }
        setDayCards(newDayCard);
      }
    })();
  }, [activeDate]);

  const goPreviousMonth = () => {
    const newDate = moment(activeDate).subtract(1, "month");
    setActiveDate(newDate);
  };

  const goNextMonth = () => {
    const newDate = moment(activeDate).add(1, "month");
    setActiveDate(newDate);
  };

  const goToday = () => {
    const newDate = moment();
    setActiveDate(newDate);
  };

  const showAddTransactionDialog = (date: Date) => {
    setActiveDate(moment(date));
    setAddDialog(true);
  };

  const submitAddTransaction = (params: onCloseParams) => {
    setAddDialog(false);
    (async () => {
      await postTransaction(params);
      setActiveDate(moment());
    })();
  };

  const showDayDialog = () => {

  };

  return (
    <>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <AppBar position="static">
          <Toolbar variant="regular">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
              Dollar Book ({month ? Number(month.closingBalance / 100).toFixed(2) : "--"})
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
        <Box sx={{flexGrow: 1, height: '100vh', overflow: 'auto'}}>
          <Box
            sx={{
              m: 1,
              display: 'grid',
              gap: 1,
              gridTemplateColumns: 'repeat(7, 1fr)'
            }}
          >
            {headers.map(header => 
              <Box key={header} sx={{textAlign: "center"}}>{header}</Box>
            )}
            {dayCards.map(dayCard => 
              <Card sx={{gridColumn: dayCard.dayOfWeek + 1}} key={dayCard.key}>
                <CardActionArea onClick={showDayDialog}>
                  <CardContent sx={{position: "relative"}}>
                    <Typography variant="subtitle1">{dayCard.label}</Typography>
                    <Typography variant="overline" gutterBottom>{Number(dayCard.value / 100).toFixed(2)}</Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <IconButton onClick={() => showAddTransactionDialog(dayCard.date)} size="small" color="primary" aria-label="add transaction">
                    <Add fontSize="inherit" />
                  </IconButton>
                </CardActions>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
      <TransactionDialog open={addDialog} defaultDate={activeDate.toDate()} onClose={()=>setAddDialog(false)} onSubmit={submitAddTransaction} />
    </>
  );
}

export default App;
