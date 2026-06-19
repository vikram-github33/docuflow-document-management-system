// components/FolderContent.tsx

import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
} from '@mui/material';

import CreateFolderDialog from './CreateFolderDialog';
import { useState } from 'react';

export default function FolderContent({
  folderId,
}: {
  folderId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box p={3}>
      <Breadcrumbs>
        <Typography>Root</Typography>
        <Typography>Finance</Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        justifyContent="space-between"
        mt={2}
      >
        <Typography variant="h5">
          Folder Contents
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          New Folder
        </Button>
      </Box>

      <CreateFolderDialog
        open={open}
        parentId={folderId}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}