import { Check, Delete, Remove } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FunctionComponent, useEffect, useState } from "react";
import { getTransaction } from "./api";

export interface onSubmitParams {
  value: number;
  label: string;
  transactionDate: Date;
}

interface Props {
  onSubmit?: (transaction: onSubmitParams) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
  defaultDate: Date;
  transactionId?: number;
  open: boolean;
}

type TransactionType = "Expense" | "Income";

export const TransactionDialog: FunctionComponent<Props> = (props) => {
  const { onSubmit, onDelete, onClose, defaultDate, transactionId, open } = props;
  const [ value, setValue ] = useState("");
  const [ label, setLabel ] = useState("");
  const [ transactionDate, setTransactionDate ] = useState<Date>(new Date());
  const [ transactionType, setTransactionType ] = useState<TransactionType>("Expense");

  useEffect(() => {
    if (open) {
      if (transactionId) {
        /** Editing existing transaction. */
        (async() => {
          const {data} = await getTransaction(transactionId);
          setValue(Number(-data.value / 100).toFixed(2));
          setLabel(data.label || "");
          setTransactionDate(data.transactionDate);
        })();
      } else {
        /** Creating a new transaction. */
        setValue("");
        setLabel("");
        setTransactionDate(defaultDate);
      }
    }
  }, [defaultDate, open]);

  const handleSubmit = () => {
    let valueNumber = Math.round(parseFloat(value) * 100);
    if (transactionType === "Expense") {
      valueNumber = - valueNumber;
    }
    onSubmit && onSubmit({ value: valueNumber, label, transactionDate });
  };
 
  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    if (transactionId) {
      onDelete && onDelete(transactionId);
    }
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
          {transactionId && <Button variant="contained" color="error" onClick={handleDelete} startIcon={<Delete />}>Delete</Button>}
          <Button variant="contained" onClick={handleSubmit} startIcon={<Check />}>Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};