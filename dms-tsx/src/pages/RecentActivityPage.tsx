import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Alert, Table, TableBody,
  TableCell, TableHead, TableRow, Skeleton, Chip, Avatar,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';

import { ActivityFiltersBar } from '../components/activity/ActivityFiltersBar';
import { ActivityRow }        from '../components/activity/ActivityRow';
import { ActivityStatsRow }   from '../components/activity/ActivityStatsRow';
import { activityService }    from '../services/activity.service';
import { groupByDate, getDateGroupLabel, getUserColor, getInitials } from '../utils/activity.utils';
import type { DocumentActivity, ActivityFilters, DateFilter } from '../types/activity.types';

const DEFAULT_FILTERS: ActivityFilters = {
  dateRange: 'all', type: 'all', entityType: 'all', userId: 'all', search: '',
};

const COL_HEADERS = ['Action', 'Name', 'Type', 'Description', 'Performed by', 'Time'];

function dateFilterToISO(range: DateFilter): string | undefined {
  const day = 86400000;
  if (range === 'today') return new Date(Date.now() - day).toISOString();
  if (range === 'week')  return new Date(Date.now() - 7 * day).toISOString();
  if (range === 'month') return new Date(Date.now() - 30 * day).toISOString();
  return undefined;
}

function DateGroupHeader({ dateKey }: { dateKey: string }) {
  return (
    <TableRow sx={{ bgcolor: 'grey.50' }}>
      <TableCell colSpan={6} sx={{ py: 0.75, pl: 2, borderBottom: '0.5px solid', borderColor: 'divider' }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary"
          sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {getDateGroupLabel(dateKey)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

const RecentActivityPage: React.FC = () => {
  const [items,    setItems]    = useState<DocumentActivity[]>([]);
  const [summary,  setSummary]  = useState<Record<string, number>>({});
  const [users,    setUsers]    = useState<{ id: string; name: string; initials: string }[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [filters,  setFilters]  = useState<ActivityFilters>(DEFAULT_FILTERS);

  const fetchActivity = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const dateFrom = dateFilterToISO(filters.dateRange);

      const [listRes, summaryRes] = await Promise.all([
        activityService.getActivities({
          limit:        200,
          activityType: filters.type !== 'all' ? filters.type : undefined,
          entityType:   filters.entityType !== 'all' ? filters.entityType : undefined,
          userId:       filters.userId !== 'all' ? filters.userId : undefined,
          search:       filters.search || undefined,
          dateFrom,
        }),
        activityService.getSummary(dateFrom),
      ]);

      setItems(listRes.data);
      setSummary(summaryRes.data);

      // Derive unique users from the activity list for the filter chips
      const uniqueUsers = new Map<string, { id: string; name: string; initials: string }>();
      for (const item of listRes.data) {
        if (!uniqueUsers.has(item.user.id)) {
          uniqueUsers.set(item.user.id, {
            id: item.user.id,
            name: `${item.user.firstName} ${item.user.lastName}`,
            initials: getInitials(item.user.firstName, item.user.lastName),
          });
        }
      }
      setUsers(Array.from(uniqueUsers.values()));
    } catch {
      setError('Failed to load activity. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters.dateRange, filters.type, filters.entityType, filters.userId, filters.search]);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  const grouped = useMemo(() => groupByDate(items), [items]);
  const updateFilters = (patch: Partial<ActivityFilters>) => setFilters(prev => ({ ...prev, ...patch }));

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TimelineIcon sx={{ color: '#1976d2', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} lineHeight={1.2}>Recent Activity</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              Track every action across your workspace
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>Filter by user:</Typography>
          <Chip
            label="All"
            size="small"
            onClick={() => updateFilters({ userId: 'all' })}
            sx={{
              height: 26, fontSize: 11, cursor: 'pointer',
              fontWeight: filters.userId === 'all' ? 600 : 400,
              bgcolor: filters.userId === 'all' ? '#37474f' : 'transparent',
              color:   filters.userId === 'all' ? '#fff' : 'text.secondary',
              border: '0.5px solid', borderColor: 'divider',
            }}
          />
          {users.map(u => (
            <Chip
              key={u.id}
              label={u.initials}
              size="small"
              avatar={<Avatar sx={{ bgcolor: `${getUserColor(u.id)} !important`, fontSize: '9px !important', fontWeight: 700 }}>{u.initials}</Avatar>}
              onClick={() => updateFilters({ userId: u.id })}
              title={u.name}
              sx={{
                height: 26, fontSize: 11, cursor: 'pointer',
                fontWeight: filters.userId === u.id ? 600 : 400,
                bgcolor: filters.userId === u.id ? getUserColor(u.id) : 'transparent',
                color:   filters.userId === u.id ? '#fff' : 'text.secondary',
                border: '0.5px solid', borderColor: 'divider',
              }}
            />
          ))}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <ActivityStatsRow summary={summary} loading={loading} />

      <Paper elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <ActivityFiltersBar
          filters={filters}
          totalCount={items.length}
          filteredCount={items.length}
          onFiltersChange={updateFilters}
          onRefresh={fetchActivity}
          loading={loading}
        />

        {loading && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />)}
          </Box>
        )}

        {!loading && items.length === 0 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <TimelineIcon sx={{ fontSize: 44, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body1" fontWeight={500} color="text.secondary">No activity found</Typography>
            <Typography variant="caption" color="text.disabled">Try adjusting the filters or date range</Typography>
          </Box>
        )}

        {!loading && items.length > 0 && (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COL_HEADERS.map(h => (
                  <TableCell key={h} sx={{
                    pl: h === 'Action' ? 2 : undefined,
                    fontSize: 10, fontWeight: 700, color: 'text.secondary',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    bgcolor: 'background.paper', borderBottom: '0.5px solid', borderColor: 'divider',
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
                  {dateItems.map(item => <ActivityRow key={item.id} item={item} />)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && items.length > 0 && (
          <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderTop: '0.5px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
              {items.length} activities{filters.search && ` · search: "${filters.search}"`}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RecentActivityPage;
