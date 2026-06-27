import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Chip, CircularProgress, IconButton,
  InputAdornment, Paper, TextField, Tooltip, Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
  TableSortLabel, Menu, MenuItem, ListItemIcon, ListItemText,
  Divider, Button, ToggleButton, ToggleButtonGroup, Avatar,
} from '@mui/material';
import StarIcon                    from '@mui/icons-material/Star';
import StarBorderIcon              from '@mui/icons-material/StarBorder';
import SearchIcon                  from '@mui/icons-material/Search';
import RefreshIcon                 from '@mui/icons-material/Refresh';
import FolderIcon                  from '@mui/icons-material/Folder';
import MoreVertIcon                from '@mui/icons-material/MoreVert';
import OpenInNewIcon               from '@mui/icons-material/OpenInNew';
import DownloadIcon                from '@mui/icons-material/Download';
import DriveFileMoveIcon           from '@mui/icons-material/DriveFileMove';
import ViewListIcon                from '@mui/icons-material/ViewList';
import GridViewIcon                from '@mui/icons-material/GridView';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOpenIcon              from '@mui/icons-material/FolderOpen';
import { FileTypeIcon }      from '../components/favourites/FileTypeIcon';
import { favouritesService } from '../services/favourites.service';
import {
  getFileIconConfig, formatFileSize, timeAgo,
} from '../utils/favourites.utils';
import type {
  FavouriteDocument, FavouriteFolder,
  SortField, SortDir, ViewMode,
} from '../types/favourites.types';

// ─── helpers ─────────────────────────────────────────────────────────────────
function truncate(s: string, n = 44) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <Box sx={{
      py: 10, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 1.5,
    }}>
      <Box sx={{
        width: 64, height: 64, borderRadius: 3,
        bgcolor: '#FFF9E6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '0.5px solid #FFE082',
      }}>
        <StarBorderIcon sx={{ fontSize: 32, color: '#F9A825' }} />
      </Box>
      <Typography variant="body1" fontWeight={600} color="text.primary">
        {hasSearch ? 'No results found' : 'No favourites yet'}
      </Typography>
      <Typography variant="caption" color="text.secondary" textAlign="center" maxWidth={300}>
        {hasSearch
          ? 'Try a different search term.'
          : 'Star any file or folder to quickly access it here.'}
      </Typography>
    </Box>
  );
}

// ─── Row context menu ─────────────────────────────────────────────────────────
interface RowMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onOpen: () => void;
  onDownload: () => void;
  onRemove: () => void;
  isFolder?: boolean;
}

function RowMenu({ anchorEl, onClose, onOpen, onDownload, onRemove, isFolder }: RowMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2, minWidth: 170, boxShadow: 3 } }}
    >
      <MenuItem dense onClick={() => { onOpen(); onClose(); }}>
        <ListItemIcon><OpenInNewIcon fontSize="small" /></ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: 13 }}>
          {isFolder ? 'Open folder' : 'Open file'}
        </ListItemText>
      </MenuItem>
      {!isFolder && (
        <MenuItem dense onClick={() => { onDownload(); onClose(); }}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Download</ListItemText>
        </MenuItem>
      )}
      {!isFolder && (
        <MenuItem dense onClick={onClose}>
          <ListItemIcon><DriveFileMoveIcon fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Move to…</ListItemText>
        </MenuItem>
      )}
      <Divider sx={{ my: 0.5 }} />
      <MenuItem dense onClick={() => { onRemove(); onClose(); }} sx={{ color: 'warning.dark' }}>
        <ListItemIcon><StarIcon fontSize="small" sx={{ color: '#F9A825' }} /></ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: 13 }}>Remove from favourites</ListItemText>
      </MenuItem>
    </Menu>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
interface GridCardProps {
  name: string;
  meta: string;
  fileType?: string;
  isFolder?: boolean;
  color?: string;
  onOpen: () => void;
  onRemoveFav: () => void;
}

function GridCard({ name, meta, fileType, isFolder, color, onOpen, onRemoveFav }: GridCardProps) {
  const cfg = fileType ? getFileIconConfig(fileType) : null;
  const folderColor = color ?? '#1976d2';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2, borderRadius: 2.5, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 1.25,
        transition: 'all 0.15s',
        '&:hover': { borderColor: 'primary.300', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' },
      }}
      onClick={onOpen}
    >
      {/* Icon area */}
      <Box sx={{
        height: 60, borderRadius: 1.5,
        bgcolor: isFolder ? `${folderColor}12` : cfg ? `${cfg.color}12` : 'grey.100',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isFolder
          ? <FolderIcon sx={{ fontSize: 32, color: folderColor }} />
          : fileType
          ? <FileTypeIcon fileType={fileType} color={cfg!.color} size={30} />
          : <InsertDriveFileOutlinedIcon sx={{ fontSize: 30, color: 'text.disabled' }} />
        }
      </Box>

      {/* Name */}
      <Box>
        <Typography variant="body2" fontWeight={500} sx={{ fontSize: 12, lineHeight: 1.3 }}
          noWrap title={name}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          {meta}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
        {fileType && (
          <Chip label={cfg?.label} size="small"
            sx={{ height: 18, fontSize: 9, bgcolor: `${cfg?.color}15`, color: cfg?.color, '& .MuiChip-label': { px: 0.5 } }} />
        )}
        {isFolder && (
          <Chip label="Folder" size="small"
            sx={{ height: 18, fontSize: 9, bgcolor: `${folderColor}15`, color: folderColor, '& .MuiChip-label': { px: 0.5 } }} />
        )}
        <Tooltip title="Remove from favourites">
          <IconButton size="small" onClick={e => { e.stopPropagation(); onRemoveFav(); }} sx={{ p: 0.3, ml: 'auto' }}>
            <StarIcon sx={{ fontSize: 14, color: '#F9A825' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const FavouritesPage: React.FC = () => {
  const [documents,     setDocuments]     = useState<FavouriteDocument[]>([]);
  const [folders,       setFolders]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [search,        setSearch]        = useState('');
  const [sortField,     setSortField]     = useState<SortField>('name');
  const [sortDir,       setSortDir]       = useState<SortDir>('asc');
  const [viewMode,      setViewMode]      = useState<ViewMode>('list');
  const [menuAnchor,    setMenuAnchor]    = useState<HTMLElement | null>(null);
  const [menuTarget,    setMenuTarget]    = useState<{ id: string; type: 'doc' | 'folder'; name: string; url?: string } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [docs, flds] = await Promise.all([
        favouritesService.getFavouriteDocuments(),
        favouritesService.getFavouriteFolders(),
      ]);
      setDocuments(docs);
      setFolders(flds);
    } catch {
      setError('Failed to load favourites.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtered + sorted ──────────────────────────────────────────────────────
  const q = search.toLowerCase();
// console.log("q",q)
  const filteredDocs = useMemo(() => {
    // console.log("folders",folders)
    const list = documents.filter(d =>
      d?.document?.fileName?.toLowerCase().includes(q) ||
      d?.folderName?.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name')     cmp = a?.fileName?.localeCompare(b.fileName);
      if (sortField === 'type')     cmp = a?.fileType?.localeCompare(b.fileType);
      if (sortField === 'size')     cmp = (a.fileSize ?? 0) - (b.fileSize ?? 0);
      if (sortField === 'modified') cmp = (a.updatedAt ?? '').localeCompare(b.updatedAt ?? '');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [documents, q, sortField, sortDir]);

  const filteredFolders = useMemo(() =>
    folders.filter(f =>
      f?.folder.name?.toLowerCase().includes(q) ||
      f?.path?.toLowerCase().includes(q)
    ), [folders, q]);

  const totalCount    = documents.length + folders.length;
  const filteredCount = filteredDocs.length + filteredFolders.length;
    console.log("filteredDocs",filteredDocs)
  // ── Sort toggle ────────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  // ── Remove favourite ───────────────────────────────────────────────────────
  const removeDoc = async (id: string) => {
    try {
      await favouritesService.removeDocumentFavourite(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch { setError('Failed to remove from favourites.'); }
  };

  const removeFolder = async (id: string) => {
    try {
      await favouritesService.removeFolderFavourite(id);
      setFolders(prev => prev.filter(f => f.id !== id));
    } catch { setError('Failed to remove from favourites.'); }
  };

  const isEmpty = filteredCount === 0;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Page header — matches your DocuFlow style */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#FFF9E6', width: 40, height: 40, border: '0.5px solid #FFE082' }}>
            <StarIcon sx={{ color: '#F9A825', fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.2}>Favourites</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Files and folders you've starred
            </Typography>
          </Box>
        </Box>

        {totalCount > 0 && (
          <Chip
            label={`${totalCount} item${totalCount !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: '#FFF9E6', color: '#F9A825', fontWeight: 600, border: '0.5px solid #FFE082' }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
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
        }}>
          <Typography fontWeight={600} fontSize={14}>Starred items</Typography>
          {filteredCount > 0 && (
            <Chip label={filteredCount} size="small"
              sx={{ height: 18, fontSize: 11, bgcolor: 'grey.100', fontWeight: 500 }} />
          )}

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search favourites..."
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

          {/* View toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 0.75, border: '0.5px solid', borderColor: 'divider' } }}
          >
            <ToggleButton value="list"><ViewListIcon sx={{ fontSize: 17 }} /></ToggleButton>
            <ToggleButton value="grid"><GridViewIcon sx={{ fontSize: 17 }} /></ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchAll} disabled={loading}>
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
        {!loading && isEmpty && <EmptyState hasSearch={!!search} />}

        {/* ── GRID VIEW ───────────────────────────────────────────────────── */}
        {!loading && !isEmpty && viewMode === 'grid' && (
          <Box sx={{ p: 2 }}>
            {/* Folders grid */}
            {filteredFolders.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10, mb: 1.5, display: 'block' }}>
                  Folders ({filteredFolders.length})
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 1.5 }}>
                  {filteredFolders.map(f => (
                    <GridCard
                      key={f.id}
                      name={f.name}
                      meta={`${f.documentCount} file${f.documentCount !== 1 ? 's' : ''}`}
                      isFolder
                      color={f.color}
                      onOpen={() => {}}
                      onRemoveFav={() => removeFolder(f.id)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Files grid */}
            {filteredDocs.length > 0 && (
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10, mb: 1.5, display: 'block' }}>
                  Files ({filteredDocs.length})
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 1.5 }}>
                  {filteredDocs.map(d => (
                    <GridCard
                      key={d.id}
                      name={d.fileName}
                      meta={formatFileSize(d.fileSize)}
                      fileType={d.fileType}
                      onOpen={() => window.open(d.fileUrl, '_blank')}
                      onRemoveFav={() => removeDoc(d.id)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* ── LIST VIEW ───────────────────────────────────────────────────── */}
        {!loading && !isEmpty && viewMode === 'list' && (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', pl: 2, width: '45%' }}>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortDir : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>
                  <TableSortLabel
                    active={sortField === 'type'}
                    direction={sortField === 'type' ? sortDir : 'asc'}
                    onClick={() => handleSort('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>
                  <TableSortLabel
                    active={sortField === 'size'}
                    direction={sortField === 'size' ? sortDir : 'asc'}
                    onClick={() => handleSort('size')}
                  >
                    Size
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', width: 120 }}>
                  <TableSortLabel
                    active={sortField === 'modified'}
                    direction={sortField === 'modified' ? sortDir : 'asc'}
                    onClick={() => handleSort('modified')}
                  >
                    Modified
                  </TableSortLabel>
                </TableCell>
                {/* <TableCell sx={{ width: 80 }} /> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Folder rows */}
              {filteredFolders.map(f => {
                // console.log("f",f)
                const folderColor = f.color ?? '#1976d2';
                return (
                  <TableRow
                    key={`folder-${f.id}`}
                    hover
                    sx={{ cursor: 'pointer', '& td': { py: 1, borderBottom: '0.5px solid', borderColor: 'divider' } }}
                  >
                    {/* Name */}
                    <TableCell sx={{ pl: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <FolderIcon sx={{ fontSize: 20, color: folderColor, flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}>
                            {truncate(f.folder.name)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11, fontFamily: 'monospace' }}>
                            {f.path}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {/* Type */}
                    <TableCell>
                      <Chip label="Folder" size="small"
                        sx={{ height: 20, fontSize: 10, fontWeight: 500, bgcolor: `${folderColor}15`, color: folderColor, border: 'none', '& .MuiChip-label': { px: 0.75 } }} />
                    </TableCell>
                    {/* Size */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {f.documentCount} file{f.documentCount !== 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    {/* Modified */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {timeAgo(f.updatedAt)}
                      </Typography>
                    </TableCell>
                    {/* Actions */}
                    {/* <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Remove from favourites">
                          <IconButton size="small" onClick={() => removeFolder(f.id)} sx={{ p: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: '#F9A825' }} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" sx={{ p: 0.5 }}
                          onClick={e => { setMenuAnchor(e.currentTarget); setMenuTarget({ id: f.id, type: 'folder', name: f.name }); }}>
                          <MoreVertIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell> */}
                  </TableRow>
                );
              })}

              {/* Document rows */}
              {filteredDocs.map(d => {
                const cfg = getFileIconConfig(d.fileType);
                return (
                  <TableRow
                    key={`doc-${d.id}`}
                    hover
                    sx={{ cursor: 'pointer', '& td': { py: 1, borderBottom: '0.5px solid', borderColor: 'divider' } }}
                    onClick={() => window.open(d.fileUrl, '_blank')}
                  >
                    {/* Name */}
                    <TableCell sx={{ pl: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <FileTypeIcon fileType={d.fileType} color={cfg.color} size={20} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}
                            title={d.document.fileName}>
                            {truncate(d.document.fileName)}
                          </Typography>
                          {d.folderName && (
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
                              📁 {d.folderName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    {/* Type */}
                    <TableCell>
                      <Chip label={cfg.label} size="small"
                        sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: `${cfg.color}15`, color: cfg.color, border: 'none', '& .MuiChip-label': { px: 0.75 } }} />
                    </TableCell>
                    {/* Size */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {formatFileSize(d.fileSize)}
                      </Typography>
                    </TableCell>
                    {/* Modified */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {timeAgo(d.updatedAt)}
                      </Typography>
                    </TableCell>
                    {/* Actions */}
                    {/* <TableCell onClick={e => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Remove from favourites">
                          <IconButton size="small" onClick={() => removeDoc(d.id)} sx={{ p: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: '#F9A825' }} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" sx={{ p: 0.5 }}
                          onClick={e => { setMenuAnchor(e.currentTarget); setMenuTarget({ id: d.id, type: 'doc', name: d.fileName, url: d.fileUrl }); }}>
                          <MoreVertIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Footer */}
        {!loading && !isEmpty && (
          <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderTop: '0.5px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              {filteredCount} starred item{filteredCount !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Row context menu */}
      <RowMenu
        anchorEl={menuAnchor}
        onClose={() => { setMenuAnchor(null); setMenuTarget(null); }}
        onOpen={() => { if (menuTarget?.url) window.open(menuTarget.url, '_blank'); }}
        onDownload={() => {
          if (menuTarget?.url) {
            const a = document.createElement('a');
            a.href = menuTarget.url; a.download = menuTarget.name; a.target = '_blank'; a.click();
          }
        }}
        onRemove={() => {
          if (!menuTarget) return;
          if (menuTarget.type === 'doc') removeDoc(menuTarget.id);
          else removeFolder(menuTarget.id);
        }}
        isFolder={menuTarget?.type === 'folder'}
      />
    </Box>
  );
};

export default FavouritesPage;
