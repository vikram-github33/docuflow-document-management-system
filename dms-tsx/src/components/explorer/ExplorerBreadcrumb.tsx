import React from 'react';
import { Breadcrumbs, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFolder, clearSelection } from '../../redux/slices/folderSlice';
import { findNodeById } from '../../utils/fileIcons';

export const ExplorerBreadcrumb: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selection, tree } = useAppSelector(s => s.folders);

  if (!selection) return null;

  // Build breadcrumb segments from path
  const currentPath = selection.type === 'folder'
    ? selection.item.path
    : selection.type === 'file'
    ? (() => {
        const parentNode = findNodeById(tree, (selection as any).folderId);
        return parentNode ? `${parentNode.path}/${selection.item.fileName}` : `/${selection.item.fileName}`;
      })()
    : '';

  const segments = currentPath.split('/').filter(Boolean);

  // Build folder nodes for each path segment (to enable clicking)
  function findFolderByPath(path: string) {
    function search(nodes: typeof tree, target: string): typeof tree[0] | null {
      for (const n of nodes) {
        if (n.path === target) return n;
        const found = search(n.children, target);
        if (found) return found;
      }
      return null;
    }
    return search(tree, path);
  }

  return (
    <Box sx={{
      px: 2, py: 0.75,
      bgcolor: 'background.paper',
      borderBottom: '0.5px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
        aria-label="folder navigation"
        sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap', alignItems: 'center' } }}
      >
        {/* Home */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            cursor: 'pointer', color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.15s',
          }}
          onClick={() => dispatch(clearSelection())}
        >
          <HomeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Home</Typography>
        </Box>

        {/* Path segments */}
        {segments.map((seg:any, i:any) => {
          const segPath = '/' + segments.slice(0, i + 1).join('/');
          const isLast  = i === segments.length - 1;
          const isFile  = isLast && selection.type === 'file';
          const folderNode = !isFile ? findFolderByPath(segPath) : null;

          if (isLast) {
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                {isFile
                  ? <InsertDriveFileIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  : <FolderIcon sx={{ fontSize: 13, color: selection.type === 'folder' ? (selection.item as any).color ?? 'primary.main' : 'primary.main' }} />
                }
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ fontSize: 12, color: 'text.primary' }}
                >
                  {seg}
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              key={i}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.4,
                cursor: folderNode ? 'pointer' : 'default',
                color: 'text.secondary',
                '&:hover': folderNode ? { color: 'primary.main' } : {},
                transition: 'color 0.15s',
              }}
              onClick={() => folderNode && dispatch(selectFolder(folderNode))}
            >
              <FolderIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" sx={{ fontSize: 12 }}>{seg}</Typography>
            </Box>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
