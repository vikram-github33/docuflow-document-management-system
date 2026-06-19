import React, { useState } from 'react';
import { Box, Paper, Typography, InputBase, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FileIcon, StatusPill } from '../components/ui/SharedUI';
import { mockDocuments } from '../data/mockData';
import { Document, DocType } from '../types';

type FilterType = 'all' | DocType;

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All',   value: 'all'  },
  { label: 'PDF',   value: 'pdf'  },
  { label: 'Word',  value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'PPT',   value: 'pptx' },
];

const Search: React.FC = () => {
  const [query,      setQuery]      = useState<string>('');
  const [results,    setResults]    = useState<Document[]>([]);
  const [searched,   setSearched]   = useState<boolean>(false);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const handleSearch = (): void => {
    const q = query.toLowerCase();
    const res = mockDocuments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q)
    );
    setResults(res);
    setSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSearch();
  };

  const filtered: Document[] =
    filterType === 'all' ? results : results.filter((d) => d.type === filterType);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Search</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Search across all documents, metadata, and OCR-extracted text.
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'grey.100', borderRadius: 2, px: 1.5, py: 0.75 }}>
            <SearchIcon sx={{ fontSize: 18, color: 'grey.400' }} />
            <InputBase
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search documents, OCR text, metadata…"
              sx={{ flex: 1, fontSize: '0.9rem' }}
              inputProps={{ 'aria-label': 'Search documents' }}
            />
          </Box>
          <Button variant="contained" onClick={handleSearch} sx={{ px: 3, fontWeight: 600 }}>Search</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>Filter:</Typography>
          {FILTER_OPTIONS.map(({ label, value }) => (
            <Chip
              key={value}
              label={label}
              size="small"
              onClick={() => setFilterType(value)}
              variant={filterType === value ? 'filled' : 'outlined'}
              sx={{
                fontSize: '0.65rem', cursor: 'pointer',
                ...(filterType === value
                  ? { bgcolor: '#EFF6FF', color: 'primary.main', border: '1px solid #BFDBFE' }
                  : { borderColor: 'grey.300' }),
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Empty / Initial state */}
      {!searched && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <SearchIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
          <Typography sx={{ mb: 0.5 }}>Type a query and press Enter or click Search</Typography>
          <Typography variant="caption">Searches document names, departments, owners, and OCR text</Typography>
        </Box>
      )}

      {/* Results */}
      {searched && (
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </Typography>

          {filtered.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>No documents found for &ldquo;{query}&rdquo;</Typography>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
              {filtered.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100', cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' }, '&:last-child': { borderBottom: 'none' } }}
                >
                  <FileIcon type={doc.type} size={32} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{doc.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {doc.department} · {doc.owner} · Modified {doc.modified}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{doc.size}</Typography>
                  <StatusPill status={doc.status} />
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
