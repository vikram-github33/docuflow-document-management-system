import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import  LoadingButton from '@mui/lab'
import React from 'react'

const FolderCreation = () => {
  return (
    <Dialog open={false}>
      <DialogTitle>
        Create Folder
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Folder Name"
          fullWidth
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
        />

        <Autocomplete
          options={[]}
          renderInput={(params) => <TextField {...params} label="Parent Folder" />}
        />

        <Box>
          Color Picker
        </Box>
      </DialogContent>

      <DialogActions>
        <Button>Cancel</Button>

        {/* <LoadingButton
          variant="contained"
        > */}
          Create Folder
        {/* </LoadingButton> */}
      </DialogActions>
    </Dialog>
  )
}

export default FolderCreation
