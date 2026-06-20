// pages/folders/FolderExplorerPage.tsx

import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

// import FolderTree from '../../components/Folder/FolderTree';
import FolderContent from '../../components/Folder/FolderContent';

export default function FolderExplorerPage() {
  const { folderId } = useParams();

  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12} md={3}>
          {/* <FolderTree selectedFolderId={folderId} /> */}
        </Grid>
        <Grid item xs={12} md={9}>
          <FolderContent folderId={folderId} />
        </Grid>
      </Grid>
    </Box>
  );
}