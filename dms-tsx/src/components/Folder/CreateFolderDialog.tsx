// components/CreateFolderDialog.tsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  parentId?: string;
}

export default function CreateFolderDialog({
  open,
  onClose,
  parentId,
}: Props) {
  const [name, setName] = useState('');

  const createFolder = async () => {
    const payload = {
      name,
      parentId,
    };

    console.log(payload);

    // await axios.post('/folders', payload);

    onClose();
    setName('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Create Folder
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Folder Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={createFolder}
        >
          Create Folder
        </Button>
      </DialogActions>
    </Dialog>
  );
}