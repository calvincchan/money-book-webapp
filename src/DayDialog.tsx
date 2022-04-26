import { Edit } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import moment from "moment";
import { FunctionComponent, useEffect, useState } from "react";
import { deleteTransaction, getTransactionsByDate, patchTransaction, Transaction } from "./api";
import { onSubmitParams, TransactionDialog } from "./TransactionDialog";

export interface onCloseParams {
  value: number;
  label: string;
  transactionDate: Date;
}

interface Props {
  onClose: () => void;
  onChange: () => void;
  defaultDate: Date;
  transaction?: Transaction;
  open: boolean;
}

export const DayDialog: FunctionComponent<Props> = (props) => {
  const { onClose, onChange, defaultDate, open } = props;
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [ transactionId, setTransactionId ] = useState(0);
  const [ transactionDialog, setTransactionDialog ] = useState(false);

  useEffect(() => {
    if (open) {
      (async() => {
        const {data} = await getTransactionsByDate(defaultDate);
        setTransactions(data);
      })();
    }
  }, [defaultDate, open]);
 
  const handleClose = () => {
    onClose();
  };

  const showEditDialog = (id?: number) => {
    if (id) {
      setTransactionId(id);
      setTransactionDialog(true);
    }
  };

  const submitEditTransaction = (params: onSubmitParams) => {
    setTransactionDialog(false);
    (async () => {
      await patchTransaction(transactionId, params);
      onChange();
    })();
  };

  const handleDelete = (id: number) => {
    setTransactionDialog(false);
    (async () => {
      await deleteTransaction(id);
      onChange();
    })();
  };
  
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{moment(defaultDate).format("YYYY-MM-DD")}</DialogTitle>
        {transactions.length > 0 && (
          <List dense sx={{ minWidth: "16em" }}>
            {transactions?.map(transaction => (
              <ListItem key={transaction.transactionDate.valueOf()} secondaryAction={<IconButton edge="end" aria-label="edit" onClick={()=>showEditDialog(transaction._id)}>
                <Edit />
              </IconButton>}>
                <ListItemText primary={[Number(transaction.value / 100).toFixed(2), transaction.label].join(" ")} secondary={moment(transaction.transactionDate).format("MM-DD HH:mm")} />
              </ListItem>
            ))}
          </List>
        )}
        {transactions.length === 0 && (
          <DialogContent>
            <Typography variant="h6">No transaction</Typography>
          </DialogContent>
        )}
      </Dialog>
      <TransactionDialog open={transactionDialog} defaultDate={defaultDate} transactionId={transactionId} onClose={()=>setTransactionDialog(false)} onSubmit={submitEditTransaction} onDelete={handleDelete} />
    </>
  );
};