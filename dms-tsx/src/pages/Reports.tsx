import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import { mockUploadStats, mockStorageByDept } from '../data/mockData';

interface MonthlyData { month: string; docs: number }

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jul', docs: 820  },
  { month: 'Aug', docs: 932  },
  { month: 'Sep', docs: 1100 },
  { month: 'Oct', docs: 1034 },
  { month: 'Nov', docs: 890  },
  { month: 'Dec', docs: 1200 },
];

const PIE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#0891B2'];

const Reports: React.FC = () => (
  <Box>
    <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Reports & Analytics</Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Storage analytics and document activity insights.</Typography>

    <Grid container spacing={2}>
      {/* Monthly uploads bar chart */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>Monthly uploads</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="docs" radius={[4, 4, 0, 0]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Storage by department pie chart */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>Storage by department</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={mockStorageByDept} dataKey="used" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                  {mockStorageByDept.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ flex: 1 }}>
              {mockStorageByDept.map((d, i) => (
                <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PIE_COLORS[i], flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>{d.name}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{d.used} GB</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Weekly trend line chart */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>Weekly upload trend</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockUploadStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Reports;
