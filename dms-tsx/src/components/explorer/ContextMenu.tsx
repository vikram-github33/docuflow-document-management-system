import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { useAppDispatch } from '../../redux/hooks';
import { selectFolder, selectFile, deleteFolderThunk, clearSelection } from '../../redux/slices/folderSlice';
import type { FolderTreeNode, FolderDocument } from '../../types/folder.types';

export interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  type: 'folder' | 'file';
  id: string;
  node: FolderTreeNode;
  doc?: FolderDocument;
}

interface ContextMenuProps {
  state: ContextMenuState | null;
  onClose: () => void;
  onNewFolder: () => void;
  onRename?: (id: string, name: string) => void;
  onUpload?: (folderId: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  state, onClose, onNewFolder, onRename, onUpload,
}) => {
  const dispatch = useAppDispatch();
  if (!state) return null;

  const handleDeleteFolder = async () => {
    onClose();
    if (!window.confirm(`Delete folder "${state.node.name}"?`)) return;
    await dispatch(deleteFolderThunk(state.id));
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    onClose();
    const doc = state.doc;
    if (!doc) return;
    const a = document.createElement('a');
    a.href = doc.fileUrl; a.download = doc.fileName; a.target = '_blank'; a.click();
  };

  const isFolderCtx = state.type === 'folder';

  return (
    <Menu
      open
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: state.mouseY, left: state.mouseX }}
      slotProps={{ paper: { elevation: 3, sx: { minWidth: 180, borderRadius: 2, py: 0.5 } } }}
    >
      {isFolderCtx ? [
        <MenuItem key="open" dense onClick={() => { dispatch(selectFolder(state.node)); onClose(); }}>
          <ListItemIcon><FolderOpenIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Open</ListItemText>
        </MenuItem>,
        <Divider key="d1" sx={{ my: 0.5 }} />,
        <MenuItem key="newfolder" dense onClick={() => { onClose(); onNewFolder(); }}>
          <ListItemIcon><CreateNewFolderIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>New Subfolder</ListItemText>
        </MenuItem>,
        onUpload && (
          <MenuItem key="upload" dense onClick={() => { onClose(); onUpload(state.id); }}>
            <ListItemIcon><UploadFileIcon fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Upload Files</ListItemText>
          </MenuItem>
        ),
        <Divider key="d2" sx={{ my: 0.5 }} />,
        onRename && (
          <MenuItem key="rename" dense onClick={() => { onClose(); onRename(state.id, state.node.name); }}>
            <ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Rename</ListItemText>
          </MenuItem>
        ),
        <MenuItem key="delete" dense onClick={handleDeleteFolder} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Delete</ListItemText>
        </MenuItem>,
      ] : [
        <MenuItem key="preview" dense onClick={() => {
          if (state.doc) dispatch(selectFile({ doc: state.doc, folderId: state.node.id }));
          onClose();
        }}>
          <ListItemIcon><PreviewIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Preview</ListItemText>
        </MenuItem>,
        <MenuItem key="download" dense onClick={handleDownload}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Download</ListItemText>
        </MenuItem>,
        <Divider key="d1" sx={{ my: 0.5 }} />,
        onRename && state.doc && (
          <MenuItem key="rename" dense onClick={() => { onClose(); onRename(state.doc!.id, state.doc!.fileName); }}>
            <ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Rename</ListItemText>
          </MenuItem>
        ),
        <MenuItem key="move" dense onClick={onClose}>
          <ListItemIcon><DriveFileMoveIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Move to...</ListItemText>
        </MenuItem>,
        <Divider key="d2" sx={{ my: 0.5 }} />,
        <MenuItem key="delete" dense onClick={onClose} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Delete</ListItemText>
        </MenuItem>,
      ]}
    </Menu>
  );
};
