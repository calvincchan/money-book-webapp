import { Remove } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FunctionComponent, useEffect, useState } from "react";
import { Transaction } from "./api";

export interface onCloseParams {
  value: number;
  label: string;
  transactionDate: Date;
}

interface Props {
  onSubmit: (transaction: onCloseParams) => void;
  onClose: () => void;
  defaultDate: Date;
  transaction?: Transaction;
  open: boolean;
}

type TransactionType = "Expense" | "Income";

export const TransactionDialog: FunctionComponent<Props> = (props) => {
  const { onSubmit, onClose, defaultDate, open } = props;
  const [ value, setValue ] = useState("");
  const [ label, setLabel ] = useState("");
  const [ transactionDate, setTransactionDate ] = useState<Date>(new Date());
  const [ transactionType, setTransactionType ] = useState<TransactionType>("Expense");

  useEffect(() => {
    console.log("open state changed", open);
    setValue("");
    setLabel("");
    setTransactionDate(defaultDate);
  }, [defaultDate, open]);

  const handleSubmit = () => {
    let valueNumber = Math.round(parseFloat(value) * 100);
    if (transactionType === "Expense") {
      valueNumber = - valueNumber;
    }
    onSubmit({ value: valueNumber, label, transactionDate });
  };
 
  const handleClose = () => {
    onClose();
  };

  function formatValue() {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      setValue("");
    } else {
      setValue(parsed.toFixed(2));
    }
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog onClose={handleClose} open={open}>
        <DialogContent>
          <Typography variant="subtitle1">Expense</Typography>
          <Stack>
            <TextField
              autoFocus
              margin="normal"
              variant="filled"
              label="Value"
              placeholder="0.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={formatValue}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Remove /></InputAdornment>,
              }}
            />
            <TextField
              margin="normal"
              variant="filled"
              label="Label"
              placeholder="e.g. Coffee"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <DateTimePicker
              label="Date"
              value={transactionDate}
              onChange={(newValue) => setTransactionDate(newValue || new Date())}
              renderInput={(params: any) => <TextField {...params} margin="normal" variant="filled" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>Add Transaction</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};