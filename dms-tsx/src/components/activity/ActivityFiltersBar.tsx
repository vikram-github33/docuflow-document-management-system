import React from 'react';
import { Box, TextField, InputAdornment, Button, MenuItem, Tooltip, IconButton, Chip } from '@mui/material';
import SearchIcon     from '@mui/icons-material/Search';
import RefreshIcon    from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ActivityType } from '../../types/activity.types';
import type { ActivityFilters, DateFilter, TypeFilter } from '../../types/activity.types';
import { getActivityMeta } from '../../utils/activity.utils';

const DATE_OPTIONS: { label: string; value: DateFilter }[] = [
  { label: 'Today',      value: 'today' },
  { label: 'This week',  value: 'week'  },
  { label: 'This month', value: 'month' },
  { label: 'All time',   value: 'all'   },
];

// All 13 enum values, labelled via getActivityMeta for consistency
const TYPE_OPTIONS: { label: string; value: TypeFilter }[] = [
  { label: 'All actions', value: 'all' },
  ...Object.values(ActivityType).map(t => ({ label: getActivityMeta(t).label, value: t })),
];

interface Props {
  filters:         ActivityFilters;
  totalCount:      number;
  filteredCount:   number;
  onFiltersChange: (f: Partial<ActivityFilters>) => void;
  onRefresh:       () => void;
  loading:         boolean;
}

export const ActivityFiltersBar: React.FC<Props> = ({
  filters, totalCount, filteredCount, onFiltersChange, onRefresh, loading,
}) => {
  const hasActiveFilters =
    filters.type !== 'all' || filters.dateRange !== 'all' ||
    filters.entityType !== 'all' || filters.search !== '';

  return (
    <Box sx={{
      px: 2, py: 1.5,
      display: 'flex', alignItems: 'center', gap: 1.5,
      borderBottom: '0.5px solid', borderColor: 'divider', flexWrap: 'wrap',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterListIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
        <Box sx={{ fontSize: 13, fontWeight: 600 }}>Filters</Box>
        <Chip
          label={filteredCount !== totalCount ? `${filteredCount} of ${totalCount}` : totalCount}
          size="small"
          sx={{
            height: 18, fontSize: 10, fontWeight: 600,
            bgcolor: filteredCount !== totalCount ? 'primary.50' : 'grey.100',
            color:   filteredCount !== totalCount ? 'primary.main' : 'text.secondary',
          }}
        />
      </Box>

      <TextField select size="small" value={filters.dateRange}
        onChange={e => onFiltersChange({ dateRange: e.target.value as DateFilter })}
        sx={{ width: 130, '& .MuiOutlinedInput-root': { fontSize: 12, borderRadius: 2 } }}>
        {DATE_OPTIONS.map(o => <MenuItem key={o.value} value={o.value} sx={{ fontSize: 12 }}>{o.label}</MenuItem>)}
      </TextField>

      <TextField select size="small" value={filters.type}
        onChange={e => onFiltersChange({ type: e.target.value as TypeFilter })}
        sx={{ width: 150, '& .MuiOutlinedInput-root': { fontSize: 12, borderRadius: 2 } }}>
        {TYPE_OPTIONS.map(o => <MenuItem key={o.value} value={o.value} sx={{ fontSize: 12 }}>{o.label}</MenuItem>)}
      </TextField>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {(['all', 'document', 'folder'] as const).map(t => (
          <Button
            key={t} size="small"
            variant={filters.entityType === t ? 'contained' : 'outlined'}
            onClick={() => onFiltersChange({ entityType: t })}
            disableElevation
            sx={{
              fontSize: 11, py: 0.5, px: 1.25, textTransform: 'none', minWidth: 0, borderRadius: 1.5,
              ...(filters.entityType !== t && { borderColor: 'divider', color: 'text.secondary' }),
            }}
          >
            {t === 'all' ? 'All' : t === 'document' ? 'Files' : 'Folders'}
          </Button>
        ))}
      </Box>

      <TextField
        size="small"
        placeholder="Search files, users..."
        value={filters.search}
        onChange={e => onFiltersChange({ search: e.target.value })}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: 'text.disabled' }} /></InputAdornment>,
        }}
        sx={{ ml: 'auto', width: 210, '& .MuiOutlinedInput-root': { fontSize: 12, borderRadius: 2 } }}
      />

      {hasActiveFilters && (
        <Button size="small" variant="text"
          onClick={() => onFiltersChange({ type: 'all', dateRange: 'all', entityType: 'all', search: '' })}
          sx={{ fontSize: 12, textTransform: 'none', color: 'text.secondary', minWidth: 0 }}>
          Clear
        </Button>
      )}

      <Tooltip title="Refresh">
        <IconButton size="small" onClick={onRefresh} disabled={loading}>
          <RefreshIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
