import React from 'react';
import { Box, Avatar, Chip, LinearProgress, Tooltip, Typography, SxProps, Theme } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ImageIcon from '@mui/icons-material/Image';
import FolderIcon from '@mui/icons-material/Folder';
import ArchiveIcon from '@mui/icons-material/Archive';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DocType, DocStatus } from '../../types';

// ─── File Icon ───────────────────────────────────────────────────────────────
interface FileIconConfig { Icon: React.ElementType; bg: string; color: string }

const FILE_TYPE_MAP: Record<string, FileIconConfig> = {
  pdf:    { Icon: PictureAsPdfIcon,      bg: '#FEF2F2', color: '#EF4444' },
  docx:   { Icon: DescriptionIcon,       bg: '#EFF6FF', color: '#3B82F6' },
  doc:    { Icon: DescriptionIcon,       bg: '#EFF6FF', color: '#3B82F6' },
  xlsx:   { Icon: TableChartIcon,        bg: '#ECFDF5', color: '#10B981' },
  xls:    { Icon: TableChartIcon,        bg: '#ECFDF5', color: '#10B981' },
  pptx:   { Icon: SlideshowIcon,         bg: '#FFF7ED', color: '#F97316' },
  ppt:    { Icon: SlideshowIcon,         bg: '#FFF7ED', color: '#F97316' },
  img:    { Icon: ImageIcon,             bg: '#FAF5FF', color: '#8B5CF6' },
  png:    { Icon: ImageIcon,             bg: '#FAF5FF', color: '#8B5CF6' },
  jpg:    { Icon: ImageIcon,             bg: '#FAF5FF', color: '#8B5CF6' },
  folder: { Icon: FolderIcon,            bg: '#FFFBEB', color: '#D97706' },
  zip:    { Icon: ArchiveIcon,           bg: '#F0FFF4', color: '#059669' },
};

interface FileIconProps { type: DocType | string; size?: number }
export const FileIcon: React.FC<FileIconProps> = ({ type, size = 36 }) => {
  const cfg = FILE_TYPE_MAP[type] ?? { Icon: InsertDriveFileIcon, bg: '#F3F4F6', color: '#6B7280' };
  const { Icon } = cfg;
  return (
    <Box sx={{ width: size, height: size, borderRadius: '8px', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon sx={{ fontSize: size * 0.5 }} />
    </Box>
  );
};

// ─── Status Pill ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  approved: { label: 'Approved', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  pending:  { label: 'Pending',  bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
  active:   { label: 'Active',   bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  inactive: { label: 'Inactive', bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' },
  urgent:   { label: 'Urgent',   bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  normal:   { label: 'Normal',   bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
};

interface StatusPillProps { status: string; sx?: SxProps<Theme> }
export const StatusPill: React.FC<StatusPillProps> = ({ status, sx }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pending'];
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{ bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600, height: 20, '& .MuiChip-label': { px: 1 }, ...sx }}
    />
  );
};

// ─── User Avatar ─────────────────────────────────────────────────────────────
interface UserAvatarProps { initials: string; bg: string; textColor: string; size?: number }
export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, bg, textColor, size = 32 }) => (
  <Avatar sx={{ width: size, height: size, bgcolor: bg, color: textColor, fontSize: size * 0.36, fontWeight: 600 }}>
    {initials}
  </Avatar>
);

// ─── Storage Bar ─────────────────────────────────────────────────────────────
interface StorageBarProps { value: number; label?: string }
export const StorageBar: React.FC<StorageBarProps> = ({ value, label }) => {
  const color: 'error' | 'warning' | 'primary' = value >= 90 ? 'error' : value >= 70 ? 'warning' : 'primary';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
      <LinearProgress variant="determinate" value={value} color={color} sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: 'grey.200' }} />
      {label !== undefined && <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 28, textAlign: 'right' }}>{label}</Typography>}
    </Box>
  );
};

// ─── Bool Icon ────────────────────────────────────────────────────────────────
interface BoolIconProps { value: boolean }
export const BoolIcon: React.FC<BoolIconProps> = ({ value }) => (
  value
    ? <CheckCircleIcon sx={{ fontSize: 18, color: '#059669' }} />
    : <CancelIcon     sx={{ fontSize: 18, color: '#D1D5DB' }} />
);
