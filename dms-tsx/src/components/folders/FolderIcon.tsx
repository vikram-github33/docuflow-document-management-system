import React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GavelIcon from '@mui/icons-material/Gavel';
import InventoryIcon from '@mui/icons-material/Inventory';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import type { SxProps } from '@mui/material';

const ICON_MAP: Record<string, React.ElementType> = {
  folder:      FolderIcon,
  work:        WorkIcon,
  people:      PeopleIcon,
  description: DescriptionIcon,
  analytics:   AnalyticsIcon,
  gavel:       GavelIcon,
  inventory:   InventoryIcon,
  school:      SchoolIcon,
  star:        StarIcon,
  settings:    SettingsIcon,
};

interface DynamicFolderIconProps {
  icon: string;
  color: string;
  sx?: SxProps;
}

export const DynamicFolderIcon: React.FC<DynamicFolderIconProps> = ({ icon, color, sx }) => {
  const IconComponent = ICON_MAP[icon] ?? FolderIcon;
  return <IconComponent sx={{ color, ...sx }} />;
};
