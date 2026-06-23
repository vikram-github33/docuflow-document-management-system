import React from 'react';
import {
  Box, TextField, Typography, IconButton,
  InputAdornment, Tooltip, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { FileTree } from './FileTree';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { expandAll, collapseAll, setSearchQuery } from '../../redux/slices/folderSlice';
import type { FolderTreeNode } from '../../types/folder.types';

interface ExplorerSidebarProps {
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', id: string, node: FolderTreeNode) => void;
}

export const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({ onContextMenu }) => {
  const dispatch = useAppDispatch();
  const { searchQuery, tree } = useAppSelector(s => s.folders);

  const totalFolders = (function count(nodes: FolderTreeNode[]): number {
    return nodes.reduce((acc, n) => acc + 1 + count(n.children ?? []), 0);
  })(tree);

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
      bgcolor: 'background.paper',
    }}>
      {/* Header */}
      <Box sx={{ px: 1.5, py: 1, borderBottom: '0.5px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" letterSpacing={0.8}
            sx={{ textTransform: 'uppercase', fontSize: 10 }}>
            Explorer
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="Expand all">
              <IconButton size="small" onClick={() => dispatch(expandAll())} sx={{ p: 0.4 }}>
                <UnfoldMoreIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Collapse all">
              <IconButton size="small" onClick={() => dispatch(collapseAll())} sx={{ p: 0.4 }}>
                <UnfoldLessIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          size="small"
          fullWidth
          placeholder="Search folders & files..."
          value={searchQuery}
          onChange={e => dispatch(setSearchQuery(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => dispatch(setSearchQuery(''))} sx={{ p: 0.25 }}>
                  <ClearIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: 12,
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.disabled' },
            },
            '& .MuiOutlinedInput-input': { py: 0.6, px: 0.5 },
          }}
        />

        {/* Stats */}
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, mt: 0.5, display: 'block' }}>
          {totalFolders} folder{totalFolders !== 1 ? 's' : ''}
          {searchQuery && ` · searching "${searchQuery}"`}
        </Typography>
      </Box>

      {/* Tree */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 0.75 }}>
        <FileTree onContextMenu={onContextMenu} />
      </Box>
    </Box>
  );
};
