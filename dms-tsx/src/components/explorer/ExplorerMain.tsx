import React from 'react';
import { Box, Typography } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { FolderView } from './FolderView';
import { FilePreview } from './FilePreview';
import { useAppSelector } from '../../redux/hooks';
import { findNodeById } from 'utils/fileIcons';

export const ExplorerMain: React.FC = () => {
  const { tree,selection } = useAppSelector(s => s.folders);

  if (!selection) {
    return (
      <Box sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 1.5, color: 'text.secondary', bgcolor: 'grey.50',
      }}>
        <FolderOpenIcon sx={{ fontSize: 64, opacity: 0.15 }} />
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          Select a folder or file
        </Typography>
        <Typography variant="caption" color="text.disabled" textAlign="center" maxWidth={240}>
          Click a folder in the sidebar to browse its contents, or click a file to preview it
        </Typography>
      </Box>
    );
  }

   if (selection.type === 'folder') {
    const currentFolder = findNodeById(tree, selection.item.id);
      console.log("FolderView",currentFolder)
    if (!currentFolder) {
      return null;
    }

    return <FolderView folder={currentFolder} />;
  }

  return (
    <FilePreview
      doc={selection.item}
      folderId={(selection as any).folderId}
    />
  );
};
