import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box, Paper, Typography, Button, IconButton,
  TextField, InputAdornment, Checkbox, Chip,
  Alert, CircularProgress, Tooltip, Divider, Tab, Tabs,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { TrashDocumentRow, TrashFolderRow } from '../components/trash/TrashItemRow';
import { TrashEmptyState } from '../components/trash/TrashEmptyState';
import { ConfirmDialog } from '../components/trash/ConfirmDialog';

// ── If you use Redux, swap these with useAppDispatch / useAppSelector ─────────
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { fetchTrash, restoreItem, permanentlyDelete, emptyTrash, toggleSelect, selectAll, clearSelection } from '../redux/slices/trashSlice';
// For now this page manages state locally with the service directly:
import { trashService } from '../services/trash.service';
import type { TrashedDocument, TrashedFolder } from '../types/trash.types';

type TabValue = 'all' | 'documents' | 'folders';

interface ConfirmState {
  open: boolean;
  type: 'restore' | 'delete' | 'empty' | 'restoreSelected' | 'deleteSelected';
  itemId?: string;
  itemType?: 'document' | 'folder';
  itemName?: string;
}

const COL_HEADERS = ['Name', 'Type', 'Size / Count', 'Deleted', 'Expires in', 'Actions'];

const TrashPage: React.FC = () => {
  const [documents,    setDocuments]    = useState<any>([]);
  const [folders,      setFolders]      = useState<TrashedFolder[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [actionLoading,setActionLoading]= useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [search,       setSearch]       = useState('');
  const [tab,          setTab]          = useState<TabValue>('all');
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set());
  const [confirm,      setConfirm]      = useState<ConfirmState>({ open: false, type: 'delete' });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTrash = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docs] = await Promise.all([
        trashService.getDeletedFiles(),
        // trashService.getTrashedFolders(),
      ]);
      setDocuments(docs);
      // setFolders(flds);
    } catch {
      setError('Failed to load trash. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrash(); }, [fetchTrash]);

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const q = search.toLowerCase();

  const filteredDocs = useMemo(() =>
    documents.filter((d:any) =>
      d.fileName.toLowerCase().includes(q) ||
      d.folderName?.toLowerCase().includes(q)
    ), [documents, q]);

  const filteredFolders = useMemo(() =>
    folders.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.path.toLowerCase().includes(q)
    ), [folders, q]);

  const allItems = [
    ...filteredDocs.map((d:any) => ({ id: d.id, type: 'document' as const })),
    ...filteredFolders.map(f => ({ id: f.id, type: 'folder' as const })),
  ];

  const totalCount     = documents.length + folders.length;
  const filteredCount  = filteredDocs.length + filteredFolders.length;
  const selectedCount  = selectedIds.size;
  const allSelected    = filteredCount > 0 && selectedCount === filteredCount;
  const someSelected   = selectedCount > 0 && !allSelected;

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) { setSelectedIds(new Set()); }
    else { setSelectedIds(new Set(allItems.map(i => i.id))); }
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const executeAction = async (c: ConfirmState) => {
    setActionLoading(true);
    try {
      switch (c.type) {
        case 'restore':
          if (c.itemType === 'document') await trashService.restoreDocument(c.itemId!);
          else                            await trashService.restoreFolder(c.itemId!);
          break;

        case 'delete':
          if (c.itemType === 'document') await trashService.permanentlyDeleteDocument(c.itemId!);
          else                            await trashService.permanentlyDeleteFolder(c.itemId!);
          break;

        case 'restoreSelected':
          for (const item of allItems.filter(i => selectedIds.has(i.id))) {
            if (item.type === 'document') await trashService.restoreDocument(item.id);
            else                           await trashService.restoreFolder(item.id);
          }
          setSelectedIds(new Set());
          break;

        case 'deleteSelected':
          for (const item of allItems.filter(i => selectedIds.has(i.id))) {
            if (item.type === 'document') await trashService.permanentlyDeleteDocument(item.id);
            else                           await trashService.permanentlyDeleteFolder(item.id);
          }
          setSelectedIds(new Set());
          break;

        case 'empty':
          await trashService.emptyTrash();
          setSelectedIds(new Set());
          break;
      }
      await fetchTrash();
    } catch {
      setError('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
      setConfirm({ open: false, type: 'delete' });
    }
  };

  const isEmpty = totalCount === 0;

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <DeleteOutlineIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
            <Typography variant="h5" fontWeight={600}>Trash</Typography>
            {totalCount > 0 && (
              <Chip
                label={totalCount}
                size="small"
                sx={{ height: 20, fontSize: 11, fontWeight: 600, bgcolor: 'grey.100' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Items in trash are permanently deleted after 30 days.
          </Typography>
        </Box>

        {!isEmpty && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon sx={{ fontSize: 16 }} />}
            onClick={() => setConfirm({ open: true, type: 'empty' })}
            disabled={loading || actionLoading}
            sx={{ textTransform: 'none', fontSize: 13 }}
          >
            Empty trash
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ border: '0.5px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}
      >
        {/* Toolbar */}
        <Box sx={{
          px: 2, py: 1.25,
          display: 'flex', alignItems: 'center', gap: 1.5,
          borderBottom: '0.5px solid', borderColor: 'divider',
          flexWrap: 'wrap',
        }}>
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setSelectedIds(new Set()); }}
            sx={{
              minHeight: 32,
              '& .MuiTab-root': { minHeight: 32, py: 0, fontSize: 12, textTransform: 'none', fontWeight: 500, px: 1.5 },
            }}
          >
            <Tab value="all"       label={`All (${totalCount})`} />
            <Tab value="documents" label={`Files (${documents.length})`}
              icon={<InsertDriveFileIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
            <Tab value="folders"   label={`Folders (${folders.length})`}
              icon={<FolderDeleteIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
          </Tabs>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search trash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              ml: 'auto', width: 220,
              '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 },
            }}
          />

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchTrash} disabled={loading}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <Box sx={{
            px: 2, py: 1,
            bgcolor: 'primary.50',
            borderBottom: '0.5px solid', borderColor: 'primary.100',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}>
            <Typography variant="body2" fontWeight={500} sx={{ color: 'primary.main', fontSize: 13 }}>
              {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RestoreFromTrashIcon sx={{ fontSize: 15 }} />}
              onClick={() => setConfirm({ open: true, type: 'restoreSelected' })}
              sx={{ fontSize: 12, textTransform: 'none' }}
            >
              Restore
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon sx={{ fontSize: 15 }} />}
              onClick={() => setConfirm({ open: true, type: 'deleteSelected' })}
              sx={{ fontSize: 12, textTransform: 'none' }}
            >
              Delete permanently
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => setSelectedIds(new Set())}
              sx={{ fontSize: 12, textTransform: 'none', ml: 'auto', color: 'text.secondary' }}
            >
              Clear selection
            </Button>
          </Box>
        )}

        {/* Column headers */}
        {!isEmpty && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '40px 2.5fr 1fr 1fr 1fr 1fr 1fr',
            px: 1.5, py: 0.75,
            bgcolor: 'grey.50',
            borderBottom: '0.5px solid', borderColor: 'divider',
            alignItems: 'center',
          }}>
            <Checkbox
              size="small"
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
              sx={{ p: 0.5 }}
            />
            {COL_HEADERS.map(h => (
              <Typography key={h} sx={{
                fontSize: 11, fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {h}
              </Typography>
            ))}
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {/* Empty state */}
        {!loading && isEmpty && <TrashEmptyState />}

        {/* No search results */}
        {!loading && !isEmpty && filteredCount === 0 && (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No items match "{search}"</Typography>
          </Box>
        )}

        {/* Document rows */}
        {!loading && (tab === 'all' || tab === 'documents') && filteredDocs.length > 0 && (
          <>
            {tab === 'all' && (
              <Box sx={{ px: 2, py: 0.75, bgcolor: 'grey.50', borderBottom: '0.5px solid', borderColor: 'divider' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                  Files ({filteredDocs.length})
                </Typography>
              </Box>
            )}
            {filteredDocs.map((doc:any) => (
              <TrashDocumentRow
                key={doc.id}
                doc={doc}
                isSelected={selectedIds.has(doc.id)}
                onToggle={toggleOne}
                onRestore={(id) => setConfirm({ open: true, type: 'restore', itemId: id, itemType: 'document', itemName: doc.fileName })}
                onDelete={(id) => setConfirm({ open: true, type: 'delete', itemId: id, itemType: 'document', itemName: doc.fileName })}
              />
            ))}
          </>
        )}

        {/* Folder rows */}
        {!loading && (tab === 'all' || tab === 'folders') && filteredFolders.length > 0 && (
          <>
            {tab === 'all' && (
              <Box sx={{ px: 2, py: 0.75, bgcolor: 'grey.50', borderBottom: '0.5px solid', borderColor: 'divider' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                  Folders ({filteredFolders.length})
                </Typography>
              </Box>
            )}
            {filteredFolders.map(folder => (
              <TrashFolderRow
                key={folder.id}
                folder={folder}
                isSelected={selectedIds.has(folder.id)}
                onToggle={toggleOne}
                onRestore={(id) => setConfirm({ open: true, type: 'restore', itemId: id, itemType: 'folder', itemName: folder.name })}
                onDelete={(id) => setConfirm({ open: true, type: 'delete', itemId: id, itemType: 'folder', itemName: folder.name })}
              />
            ))}
          </>
        )}

        {/* Footer info */}
        {!isEmpty && !loading && (
          <Box sx={{
            px: 2, py: 1,
            borderTop: '0.5px solid', borderColor: 'divider',
            bgcolor: 'grey.50',
            display: 'flex', alignItems: 'center',
          }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              {filteredCount} item{filteredCount !== 1 ? 's' : ''} in trash
              {search && ` matching "${search}"`}
              {' · '}Items are permanently deleted after 30 days
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === 'restore'         ? 'Restore item' :
          confirm.type === 'delete'          ? 'Delete permanently' :
          confirm.type === 'restoreSelected' ? `Restore ${selectedCount} items` :
          confirm.type === 'deleteSelected'  ? `Delete ${selectedCount} items permanently` :
          'Empty trash'
        }
        message={
          confirm.type === 'restore'
            ? `Restore "${confirm.itemName}" to its original location?`
          : confirm.type === 'delete'
            ? `Permanently delete "${confirm.itemName}"?`
          : confirm.type === 'restoreSelected'
            ? `Restore ${selectedCount} selected item${selectedCount > 1 ? 's' : ''} to their original locations?`
          : confirm.type === 'deleteSelected'
            ? `Permanently delete ${selectedCount} selected item${selectedCount > 1 ? 's' : ''}?`
          : 'Permanently delete all items in trash?'
        }
        confirmLabel={
          confirm.type === 'restore' || confirm.type === 'restoreSelected' ? 'Restore' : 'Delete permanently'
        }
        confirmColor={
          confirm.type === 'restore' || confirm.type === 'restoreSelected' ? 'primary' : 'error'
        }
        severity="warning"
        warningText={
          (confirm.type === 'delete' || confirm.type === 'deleteSelected' || confirm.type === 'empty')
            ? 'This action cannot be undone.'
            : undefined
        }
        loading={actionLoading}
        onConfirm={() => executeAction(confirm)}
        onCancel={() => setConfirm({ open: false, type: 'delete' })}
      />
    </Box>
  );
};

export default TrashPage;
