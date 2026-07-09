import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Alert, Chip,
  TextField, InputAdornment, IconButton, Tooltip,
  Button, Table, TableBody, TableCell, TableHead,
  TableRow, CircularProgress, Tabs, Tab,
} from '@mui/material';
import ShareIcon         from '@mui/icons-material/Share';
import SearchIcon        from '@mui/icons-material/Search';
import RefreshIcon       from '@mui/icons-material/Refresh';
import PeopleAltIcon     from '@mui/icons-material/PeopleAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccessTimeIcon    from '@mui/icons-material/AccessTime';

import { SharedFileRow }      from '../components/shared/SharedFileRow';
import { RemoveAccessDialog } from '../components/shared/RemoveAccessDialog';
import { sharedService }      from '../services/shared.service';
import { matchesTab }         from '../utils/shared.utils';
import type { SharedWithMeItem, SortMode, TabFilter } from '../types/shared.types';

const COL_HEADERS = ['Name', 'Type', 'Shared by', 'Shared', 'Actions'];

type SortOption = { label: string; value: SortMode };
const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Name',   value: 'name'   },
];

const SharedWithMePage: React.FC = () => {
  const [items,         setItems]         = useState<SharedWithMeItem[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [search,        setSearch]        = useState('');
  const [sortMode,      setSortMode]      = useState<SortMode>('newest');
  const [activeTab,     setActiveTab]     = useState<TabFilter>('all');
  const [removeTarget,  setRemoveTarget]  = useState<SharedWithMeItem | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await sharedService.getSharedWithMe();
      setItems(data);
    } catch {
      setError('Failed to load shared files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── Filtered + sorted ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = items.filter(item => {
      const matchesSearch =
        !q ||
        item.document.fileName.toLowerCase().includes(q) ||
        item.sharedBy.name.toLowerCase().includes(q) ||
        item.sharedBy.email.toLowerCase().includes(q);
      return matchesSearch && matchesTab(item.document.fileType, activeTab);
    });

    return [...list].sort((a, b) => {
      if (sortMode === 'newest') return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime();
      if (sortMode === 'oldest') return new Date(a.sharedAt).getTime() - new Date(b.sharedAt).getTime();
      return a.document.fileName.localeCompare(b.document.fileName);
    });
  }, [items, search, sortMode, activeTab]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const uniqueSenders = useMemo(() => new Set(items.map(i => i.sharedBy.id)).size, [items]);
  const addedThisWeek = useMemo(() =>
    items.filter(i => Date.now() - new Date(i.sharedAt).getTime() < 7 * 86400000).length,
    [items]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleDownload = (item: SharedWithMeItem) => {
    const a = document.createElement('a');
    a.href = item.document.fileUrl;
    a.download = item.document.fileName;
    a.target = '_blank';
    a.click();
  };

  const handleView = (item: SharedWithMeItem) => {
    window.open(item.document.fileUrl, '_blank');
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      await sharedService.removeAccess(removeTarget.shareId);
      setItems(prev => prev.filter(i => i.shareId !== removeTarget.shareId));
      setRemoveTarget(null);
    } catch {
      setError('Failed to remove access. Please try again.');
    } finally {
      setRemoveLoading(false);
    }
  };

  const TAB_COUNTS: Record<TabFilter, number> = {
    all:   items.length,
    pdf:   items.filter(i => i.document.fileType === 'application/pdf').length,
    image: items.filter(i => i.document.fileType.startsWith('image/')).length,
    other: items.filter(i => i.document.fileType !== 'application/pdf' && !i.document.fileType.startsWith('image/')).length,
  };

  return (
    <Box>
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#E6F1FB',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShareIcon sx={{ color: '#1976d2', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} lineHeight={1.2}>Shared with me</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              Documents other people have given you access to
            </Typography>
          </Box>
        </Box>
        {items.length > 0 && (
          <Chip
            label={`${items.length} file${items.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: '#E6F1FB', color: '#1976d2', fontWeight: 600, border: '0.5px solid #BFDBFE' }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2.5 }}>
        {[
          { label: 'Total shared',    value: items.length,  icon: <InsertDriveFileIcon sx={{ fontSize: 20 }} />, bg: '#E6F1FB', color: '#1976d2' },
          { label: 'From people',     value: uniqueSenders, icon: <PeopleAltIcon sx={{ fontSize: 20 }} />,       bg: '#F3E8FF', color: '#7b1fa2' },
          { label: 'Added this week', value: addedThisWeek, icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,      bg: '#EAF3DE', color: '#2e7d32' },
        ].map(s => (
          <Paper key={s.label} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 600, lineHeight: 1, color: 'text.primary' }}>
                  {loading ? '—' : s.value}
                </Typography>
                <Typography variant="caption" color="text.secondary"
                  sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, mt: 0.5, display: 'block' }}>
                  {s.label}
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            minHeight: 34,
            '& .MuiTab-root': { minHeight: 34, py: 0, fontSize: 12, textTransform: 'none', fontWeight: 500, px: 1.5 },
          }}
        >
          {(['all', 'pdf', 'image', 'other'] as TabFilter[]).map(t => (
            <Tab
              key={t}
              value={t}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {t === 'all' ? 'All files' : t === 'pdf' ? 'PDFs' : t === 'image' ? 'Images' : 'Other'}
                  <Chip label={TAB_COUNTS[t]} size="small"
                    sx={{ height: 16, fontSize: 9, '& .MuiChip-label': { px: 0.5 }, bgcolor: activeTab === t ? 'primary.main' : 'grey.200', color: activeTab === t ? '#fff' : 'text.secondary' }} />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* ── Main table card ─────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>

        {/* Toolbar */}
        <Box sx={{
          px: 2, py: 1.25,
          display: 'flex', alignItems: 'center', gap: 1.5,
          borderBottom: '0.5px solid', borderColor: 'divider',
        }}>
          <TextField
            size="small"
            placeholder="Search files or people..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }}
          />

          {/* Sort buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {SORT_OPTIONS.map(opt => (
              <Button
                key={opt.value}
                size="small"
                variant={sortMode === opt.value ? 'contained' : 'outlined'}
                onClick={() => setSortMode(opt.value)}
                disableElevation
                sx={{
                  fontSize: 11, py: 0.5, px: 1.25, textTransform: 'none', minWidth: 0, borderRadius: 1.5,
                  ...(sortMode !== opt.value && { borderColor: 'divider', color: 'text.secondary' }),
                }}
              >
                {opt.label}
              </Button>
            ))}
          </Box>

          {filtered.length > 0 && (
            <Chip
              label={`${filtered.length} of ${items.length}`}
              size="small"
              sx={{ height: 18, fontSize: 10, bgcolor: 'grey.100', ml: 0.5 }}
            />
          )}

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchItems} disabled={loading} sx={{ ml: 'auto' }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'grey.100',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShareIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
            </Box>
            <Typography variant="body1" fontWeight={500} color="text.secondary">
              {search ? 'No results found' : 'Nothing shared with you yet'}
            </Typography>
            <Typography variant="caption" color="text.disabled" textAlign="center" maxWidth={280}>
              {search
                ? 'Try a different search term or filter.'
                : 'When someone shares a document with you, it will appear here.'}
            </Typography>
          </Box>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                {COL_HEADERS.map(h => (
                  <TableCell key={h} sx={{
                    pl: h === 'Name' ? 2 : undefined,
                    fontSize: 10, fontWeight: 700, color: 'text.secondary',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    bgcolor: 'grey.50', borderBottom: '0.5px solid', borderColor: 'divider',
                  }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(item => (
                <SharedFileRow
                  key={item.shareId}
                  item={item}
                  onView={handleView}
                  onDownload={handleDownload}
                  onRemove={setRemoveTarget}
                />
              ))}
            </TableBody>
          </Table>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderTop: '0.5px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              {filtered.length} file{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Remove access dialog */}
      <RemoveAccessDialog
        item={removeTarget}
        loading={removeLoading}
        onConfirm={handleRemoveConfirm}
        onCancel={() => setRemoveTarget(null)}
      />
    </Box>
  );
};

export default SharedWithMePage;
