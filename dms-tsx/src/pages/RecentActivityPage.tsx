import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, CircularProgress,
  Alert, Table, TableBody, TableCell,
  TableHead, TableRow, Skeleton,
  Divider, Chip, Avatar,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';

import { ActivityFiltersBar } from '../components/activity/ActivityFiltersBar';
import { ActivityRow }        from '../components/activity/ActivityRow';
import { ActivityStatsRow }   from '../components/activity/ActivityStatsRow';
import {
  MOCK_ACTIVITY,
  groupByDate,
  timeAgo,
  USERS,
} from '../utils/activity.utils';
import type { ActivityItem, ActivityFilters, DateFilter } from '../types/activity.types';

// ── Date filter predicate ─────────────────────────────────────────────────────
function withinDateRange(item: ActivityItem, range: DateFilter): boolean {
  const t    = new Date(item.timestamp).getTime();
  const now  = Date.now();
  const day  = 86400000;
  if (range === 'today') return t > now - day;
  if (range === 'week')  return t > now - 7 * day;
  if (range === 'month') return t > now - 30 * day;
  return true;
}

const DEFAULT_FILTERS: ActivityFilters = {
  dateRange:  'all',
  type:       'all',
  entityType: 'all',
  userId:     'all',
  search:     '',
};

const COL_HEADERS = ['Action', 'Name', 'Type', 'Description', 'Performed by', 'Time'];

// ── Date group header ─────────────────────────────────────────────────────────
function DateGroupHeader({ dateKey }: { dateKey: string }) {
  const d     = new Date(dateKey);
  const today = new Date().toDateString();
  const yest  = new Date(Date.now() - 86400000).toDateString();
  const label = d.toDateString() === today
    ? 'Today'
    : d.toDateString() === yest
    ? 'Yesterday'
    : d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <TableRow sx={{ bgcolor: 'grey.50' }}>
      <TableCell
        colSpan={6}
        sx={{
          py: 0.75, pl: 2,
          borderBottom: '0.5px solid', borderColor: 'divider',
          borderTop: '0.5px solid', borderTopColor: 'divider',
        }}
      >
        <Typography variant="caption" fontWeight={700} color="text.secondary"
          sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const RecentActivityPage: React.FC = () => {
  const [items,    setItems]    = useState<ActivityItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [filters,  setFilters]  = useState<ActivityFilters>(DEFAULT_FILTERS);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchActivity = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Replace with: const data = await activityService.getActivity();
      await new Promise(r => setTimeout(r, 500));
      setItems(MOCK_ACTIVITY);
    } catch {
      setError('Failed to load activity. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => items.filter(item => {
    if (!withinDateRange(item, filters.dateRange))       return false;
    if (filters.type !== 'all' && item.type !== filters.type)             return false;
    if (filters.entityType !== 'all' && item.entityType !== filters.entityType) return false;
    if (filters.userId !== 'all' && item.performedBy.id !== filters.userId)     return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!item.entityName.toLowerCase().includes(q) &&
          !item.performedBy.name.toLowerCase().includes(q) &&
          !(item.folderName ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  }), [items, filters]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const updateFilters = (patch: Partial<ActivityFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));

  return (
    <Box>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: '#E6F1FB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TimelineIcon sx={{ color: '#1976d2', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} lineHeight={1.2}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              Track every action across your workspace
            </Typography>
          </Box>
        </Box>

        {/* Active user chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Filter by user:
          </Typography>
          {[{ id: 'all', name: 'All', initials: 'All', color: '#546e7a' }, ...USERS].map(u => (
            <Chip
              key={u.id}
              label={u.id === 'all' ? 'All' : u.initials}
              size="small"
              avatar={u.id !== 'all' ? (
                <Avatar sx={{ bgcolor: `${u.color} !important`, fontSize: '9px !important', fontWeight: 700 }}>
                  {u.initials}
                </Avatar>
              ) : undefined}
              onClick={() => updateFilters({ userId: u.id })}
              variant={filters.userId === u.id ? 'filled' : 'outlined'}
              sx={{
                height: 24, fontSize: 11, cursor: 'pointer',
                fontWeight: filters.userId === u.id ? 600 : 400,
                bgcolor: filters.userId === u.id ? u.color : 'transparent',
                color:   filters.userId === u.id ? '#fff' : 'text.secondary',
                borderColor: 'divider',
              }}
            />
          ))}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <ActivityStatsRow items={items} loading={loading} />

      {/* ── Main table card ──────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{ border: '0.5px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}
      >
        {/* Filters bar */}
        <ActivityFiltersBar
          filters={filters}
          totalCount={items.length}
          filteredCount={filtered.length}
          onFiltersChange={updateFilters}
          onRefresh={fetchActivity}
          loading={loading}
        />

        {/* Loading skeleton */}
        {loading && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <TimelineIcon sx={{ fontSize: 44, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body1" fontWeight={500} color="text.secondary">
              No activity found
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Try adjusting the filters or date range
            </Typography>
          </Box>
        )}

        {/* Grouped table */}
        {!loading && filtered.length > 0 && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COL_HEADERS.map(h => (
                  <TableCell key={h} sx={{
                    pl: h === 'Action' ? 2 : undefined,
                    fontSize: 10, fontWeight: 700, color: 'text.secondary',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    bgcolor: 'background.paper',
                    borderBottom: '0.5px solid', borderColor: 'divider',
                  }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from(grouped.entries()).map(([dateKey, dateItems]) => (
                <React.Fragment key={dateKey}>
                  <DateGroupHeader dateKey={dateKey} />
                  {dateItems.map(item => (
                    <ActivityRow key={item.id} item={item} />
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <Box sx={{
            px: 2, py: 1,
            bgcolor: 'grey.50',
            borderTop: '0.5px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              Showing {filtered.length} of {items.length} activities
              {filters.search && ` · search: "${filters.search}"`}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              Logs retained for 90 days
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RecentActivityPage;
