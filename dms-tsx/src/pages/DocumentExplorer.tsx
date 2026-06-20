import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, ToggleButtonGroup, ToggleButton,
  Grid, Chip, TextField, InputAdornment, IconButton, Breadcrumbs, Link,
} from '@mui/material';
import SearchIcon          from '@mui/icons-material/Search';
import GridViewIcon        from '@mui/icons-material/GridView';
import ListIcon            from '@mui/icons-material/List';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloudUploadIcon     from '@mui/icons-material/CloudUpload';
import StarIcon            from '@mui/icons-material/Star';
import StarBorderIcon      from '@mui/icons-material/StarBorder';
import CloseIcon           from '@mui/icons-material/Close';
import { FileIcon, StatusPill } from '../components/ui/SharedUI';
import { mockDocuments, mockFolders } from '../data/mockData';
import { Document, Folder, DocType } from '../types';
import { useNavigate } from 'react-router-dom';
// import FolderTree from 'components/Folder/FolderTree';
import { FolderManagementPage } from './folder/FolderManagementPage';

type ViewMode = 'grid' | 'list';

// ─── Folder Card ─────────────────────────────────────────────────────────────
const FolderCard: React.FC<{ folder: Folder }> = ({ folder }) => (
  <Paper
    elevation={0}
    sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, cursor: 'pointer', transition: 'all .15s', '&:hover': { borderColor: '#93C5FD', boxShadow: '0 0 0 3px #EFF6FF' } }}
  >
    <Box sx={{ width: '100%', aspectRatio: '2', bgcolor: '#FFFBEB', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
      <FileIcon type="folder" size={40} />
    </Box>
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder.name}</Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{folder.items} items · {folder.size}</Typography>
  </Paper>
);

// ─── File Card (grid) ─────────────────────────────────────────────────────────
interface FileCardProps { doc: Document; selected: boolean; onSelect: (d: Document) => void }
const FileCard: React.FC<FileCardProps> = ({ doc, selected, onSelect }) => {
  const [starred, setStarred] = useState<boolean>(doc.starred);
  return (
    <Paper
      elevation={0}
      onClick={() => onSelect(doc)}
      sx={{ p: 1.5, border: '1px solid', borderColor: selected ? 'primary.main' : 'grey.200', borderRadius: 2, cursor: 'pointer', bgcolor: selected ? '#EFF6FF' : 'background.paper', transition: 'all .15s', position: 'relative', '&:hover': { borderColor: '#93C5FD', boxShadow: '0 0 0 3px #EFF6FF' } }}
    >
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
        sx={{ position: 'absolute', top: 6, right: 6, opacity: starred ? 1 : 0.3, p: 0.3 }}
      >
        {starred
          ? <StarIcon       sx={{ fontSize: 14, color: '#F59E0B' }} />
          : <StarBorderIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
      </IconButton>
      <Box sx={{ width: '100%', aspectRatio: '1.4', bgcolor: 'grey.50', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
        <FileIcon type={doc.type} size={36} />
      </Box>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.25 }}>{doc.name}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{doc.size} · {doc.modified}</Typography>
    </Paper>
  );
};

// ─── File Row (list) ─────────────────────────────────────────────────────────
interface FileRowProps { doc: Document; selected: boolean; onSelect: (d: Document) => void }
const FileRow: React.FC<FileRowProps> = ({ doc, selected, onSelect }) => (
  <Box
    onClick={() => onSelect(doc)}
    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderBottom: '1px solid', borderColor: 'grey.100', cursor: 'pointer', bgcolor: selected ? '#EFF6FF' : 'transparent', '&:hover': { bgcolor: 'grey.50' } }}
  >
    <FileIcon type={doc.type} size={28} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{doc.department}</Typography>
    </Box>
    <Typography variant="caption" sx={{ color: 'text.secondary', width: 80,  textAlign: 'right' }}>{doc.size}</Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', width: 100, textAlign: 'right' }}>{doc.modified}</Typography>
    <Box sx={{ width: 90, textAlign: 'right' }}><StatusPill status={doc.status} /></Box>
    <Typography variant="caption" sx={{ color: 'text.secondary', width: 80,  textAlign: 'right' }}>{doc.owner}</Typography>
  </Box>
);

// ─── Document Explorer ───────────────────────────────────────────────────────
type FilterType = 'all' | DocType;

const DocumentExplorer: React.FC = () => {
  const [viewMode,    setViewMode]    = useState<ViewMode>('grid');
  const [selected,   setSelected]    = useState<Document | null>(null);
  const [filterType, setFilterType]  = useState<FilterType>('all');
  const [search,     setSearch]      = useState<string>('');
 const navigate = useNavigate();
  const filtered = mockDocuments.filter((d) => {
    const matchType   = filterType === 'all' || d.type === filterType;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const FILTER_CHIPS: { label: string; value: FilterType }[] = [
    { label: 'All types', value: 'all' },
    { label: 'PDF',  value: 'pdf' },
    { label: 'Word', value: 'docx' },
    { label: 'Excel',value: 'xlsx' },
    { label: 'PPT',  value: 'pptx' },
    { label: 'Image',value: 'img' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 100px)' }}>
      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Toolbar */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, mb: 2 }}>
          {/* <Breadcrumbs sx={{ mb: 1.5, fontSize: '0.8rem' }}>
            <Link underline="hover" color="primary" href="#" sx={{ fontSize: '0.8rem' }}>Home</Link>
            <Link underline="hover" color="primary" href="#" sx={{ fontSize: '0.8rem' }}>Documents</Link>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Finance</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search in Finance…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16 }} /></InputAdornment> }}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 6, fontSize: '0.8125rem' } }}
            />
            <Button variant="outlined" size="small" onClick={() =>{navigate('/folder')}} startIcon={<CreateNewFolderIcon />} sx={{ whiteSpace: 'nowrap', borderColor: 'grey.300', color: 'text.secondary' }}>New folder</Button>
            <Button variant="contained" size="small" startIcon={<CloudUploadIcon />} sx={{ whiteSpace: 'nowrap' }}>Upload</Button>
            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v as ViewMode)} size="small">
              <ToggleButton value="grid" sx={{ px: 1 }}><GridViewIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="list" sx={{ px: 1 }}><ListIcon     fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {FILTER_CHIPS.map(({ label, value }) => (
              <Chip
                key={value}
                label={label}
                size="small"
                onClick={() => setFilterType(value)}
                variant={filterType === value ? 'filled' : 'outlined'}
                sx={{ fontSize: '0.6875rem', cursor: 'pointer', ...(filterType === value ? { bgcolor: '#EFF6FF', color: 'primary.main', border: '1px solid #BFDBFE' } : { borderColor: 'grey.300' }) }}
              />
            ))}
          </Box> */}
          <FolderManagementPage/>
        </Paper>

        {/* Files */}
        {/* <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, flex: 1, overflow: 'auto' }}>
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Folders</Typography>
            <Grid container spacing={1.5} sx={{ mt: 0.5, mb: 2 }}>
              {mockFolders.slice(0, 4).map((f) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={f.id}><FolderCard folder={f} /></Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ px: 2, pb: 0 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Files</Typography>
          </Box>

          {viewMode === 'grid' ? (
            <Grid container spacing={1.5} sx={{ p: 2, pt: 1 }}>
              {filtered.map((doc) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={doc.id}>
                  <FileCard doc={doc} selected={selected?.id === doc.id} onSelect={setSelected} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid', borderColor: 'grey.100', bgcolor: 'grey.50' }}>
                {['Name', 'Size', 'Modified', 'Status', 'Owner'].map((h, i) => (
                  <Typography key={h} variant="overline" sx={{ fontSize: '0.6rem', color: 'text.secondary', flex: i === 0 ? 1 : 0, width: i === 0 ? undefined : [80, 100, 90, 80][i - 1], textAlign: i === 0 ? 'left' : 'right' }}>{h}</Typography>
                ))}
              </Box>
              {filtered.map((doc) => (
                <FileRow key={doc.id} doc={doc} selected={selected?.id === doc.id} onSelect={setSelected} />
              ))}
            </Box>
          )}
        </Paper> */}
      </Box>
      {/* <FolderTree/> */}
      {/* Detail Panel */}
      {/* {selected && (
        <Paper elevation={0} sx={{ width: 260, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'auto', flexShrink: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Document details</Typography>
            <IconButton size="small" onClick={() => setSelected(null)}><CloseIcon fontSize="small" /></IconButton>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <FileIcon type={selected.type} size={56} />
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, mb: 0.5, wordBreak: 'break-word' }}>{selected.name}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" size="small" sx={{ flex: 1, fontSize: '0.7rem' }}>Preview</Button>
              <Button variant="outlined"  size="small" sx={{ flex: 1, fontSize: '0.7rem', borderColor: 'grey.300', color: 'text.secondary' }}>Share</Button>
            </Box>
            {([
              ['Type',     selected.type?.toUpperCase()],
              ['Size',     selected.size],
              ['Modified', selected.modified],
              ['Owner',    selected.owner],
              ['Dept.',    selected.department],
              ['Status',   selected.status],
            ] as [string, string][]).map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', width: 55, flexShrink: 0 }}>{k}</Typography>
                <Typography variant="caption" sx={{ color: k === 'Status' && selected.status === 'approved' ? '#059669' : 'text.primary', fontWeight: k === 'Status' ? 600 : 400 }}>{v}</Typography>
              </Box>
            ))}
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="overline" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block', mb: 0.75 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {[selected.department, 'Internal', 'Q3-2025'].map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, borderColor: 'grey.200', color: 'text.secondary' }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      )} */}
    </Box>
  );
};

export default DocumentExplorer;
