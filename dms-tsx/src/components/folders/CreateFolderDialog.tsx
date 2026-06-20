import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, MenuItem,
  Tooltip, CircularProgress, Alert, Divider,
} from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useCreateFolder } from '../../hooks/useFolderHooks';
import { DynamicFolderIcon } from './FolderIcon';
import { FOLDER_COLORS, FOLDER_ICONS } from '../../types/folder.types';
import type { FolderTreeNode, CreateFolderPayload } from '../../types/folder.types';

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;           // caller increments refreshTrigger
  parentFolder?: FolderTreeNode | null;
  allFolders: FolderTreeNode[];
}

interface FormState {
  name: string;
  description: string;
  parentId: string;
  color: string;
  icon: string;
}

interface FormErrors { name?: string }

const DEFAULT_FORM: FormState = {
  name: '', description: '', parentId: '', color: '#1976d2', icon: 'folder',
};

// Flatten tree into a flat list for the parent selector dropdown
function flattenTree(nodes: FolderTreeNode[], depth = 0): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];
  for (const n of nodes) {
    result.push({ id: n.id, label: `${'  '.repeat(depth)}${n.name}` });
    result.push(...flattenTree(n.children, depth + 1));
  }
  return result;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open, onClose, onSuccess, parentFolder, allFolders,
}) => {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const { createFolder, loading, error: apiError, clearError } = useCreateFolder();
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm({ ...DEFAULT_FORM, parentId: parentFolder?.id ?? '' });
      setErrors({});
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, parentFolder?.id]);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim()) {
      errs.name = 'Folder name is required';
    } else if (form.name.trim().length > 255) {
      errs.name = 'Folder name must not exceed 255 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    clearError();

    const payload: CreateFolderPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      parentId: form.parentId || null,
      color: form.color,
      icon: form.icon,
    };

    const result = await createFolder(payload);
    if (result) {
      onSuccess();
      onClose();
    }
  }

  const flatFolders = flattenTree(allFolders);

  // Live path preview
  const parentNode = (function findNode(nodes: FolderTreeNode[], id: string): FolderTreeNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      const found = findNode(n.children, id);
      if (found) return found;
    }
    return null;
  })(allFolders, form.parentId);

  const previewPath = form.name.trim()
    ? form.parentId && parentNode
      ? `${parentNode.path}/${form.name.trim()}`
      : `/${form.name.trim()}`
    : '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreateNewFolderIcon color="primary" />
        Create Folder
      </DialogTitle>

      <DialogContent dividers>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {apiError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Name */}
          <TextField
            label="Folder Name *"
            value={form.name}
            onChange={(e) => { update({ name: e.target.value }); if (errors.name) setErrors({}); }}
            error={!!errors.name}
            helperText={errors.name ?? `${form.name.length}/255`}
            fullWidth
            autoFocus
            inputProps={{ maxLength: 255 }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          />

          {/* Description */}
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            inputProps={{ maxLength: 1000 }}
            helperText={`${form.description.length}/1000`}
          />

          {/* Parent folder */}
          <TextField
            select
            label="Parent Folder"
            value={form.parentId}
            onChange={(e) => update({ parentId: e.target.value })}
            fullWidth
            helperText="Leave empty to create a root folder"
          >
            <MenuItem value="">— Root (no parent) —</MenuItem>
            {flatFolders.map((f) => (
              <MenuItem key={f.id} value={f.id} sx={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {f.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Path preview */}
          {previewPath && (
            <Box sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Path preview
              </Typography>
              <Typography variant="body2" fontFamily="monospace" color="primary.main">
                {previewPath}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Color picker */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>Color</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {FOLDER_COLORS.map((c) => (
                <Tooltip key={c.value} title={c.label}>
                  <Box
                    onClick={() => update({ color: c.value })}
                    sx={{
                      width: 28, height: 28, borderRadius: '50%', bgcolor: c.value,
                      cursor: 'pointer',
                      border: form.color === c.value ? '3px solid #000' : '2px solid transparent',
                      outline: form.color === c.value ? `2px solid ${c.value}` : 'none',
                      transition: 'transform 0.1s',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Icon selector */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>Icon</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {FOLDER_ICONS.map((ic) => (
                <Tooltip key={ic.value} title={ic.label}>
                  <Box
                    onClick={() => update({ icon: ic.value })}
                    sx={{
                      width: 40, height: 40, borderRadius: 1.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', border: '1.5px solid',
                      borderColor: form.icon === ic.value ? form.color : 'divider',
                      bgcolor: form.icon === ic.value ? `${form.color}18` : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: form.color },
                    }}
                  >
                    <DynamicFolderIcon
                      icon={ic.value}
                      color={form.icon === ic.value ? form.color : '#9e9e9e'}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Live preview */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: 1.5, border: '1px solid', borderColor: 'divider',
              borderRadius: 2, bgcolor: 'background.paper',
            }}
          >
            <DynamicFolderIcon icon={form.icon} color={form.color} sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="body1" fontWeight={500}>
                {form.name || 'Folder Name'}
              </Typography>
              {form.description && (
                <Typography variant="caption" color="text.secondary">{form.description}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CreateNewFolderIcon />}
          disableElevation
        >
          {loading ? 'Creating...' : 'Create Folder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
