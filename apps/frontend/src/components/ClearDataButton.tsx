import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import axios from "axios";

function ClearDataButton({ onClear }: { onClear: () => void }) {
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const handleConfirm = async () => {
    setDialogueOpen(false);
    setSnackbarOpen(true);
    try {
      const response = await axios.delete("/api/delete-data");
      console.log("Tables Cleared", response.data);
      onClear(); // Call the callback function
    } catch (error) {
      console.error("Error Clearing Tables", error);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <>
      <Button
        variant={"contained"}
        color={"error"}
        startIcon={<DeleteIcon />}
        sx={{
          height: "40px",
        }}
        onClick={() => setDialogueOpen(true)}
      >
        Delete Data
      </Button>
      <Dialog open={dialogueOpen} onClose={() => setDialogueOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will delete all map node and edge data, employee data, service
            requests and other tables from the database. This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogueOpen(false)}
            sx={{
              color: "black",
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant={"contained"}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        message={"Data deleted successfully."}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
}

export default ClearDataButton;
