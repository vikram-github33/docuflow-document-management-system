import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, InputBase, Avatar, Badge, Tooltip } from '@mui/material';
import MenuIcon           from '@mui/icons-material/Menu';
import SearchIcon         from '@mui/icons-material/Search';
import NotificationsIcon  from '@mui/icons-material/Notifications';
import HelpOutlineIcon    from '@mui/icons-material/HelpOutline';

interface TopBarProps { onMenuClick: () => void }

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [query,  setQuery]  = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        height: 54, bgcolor: 'background.paper',
        borderBottom: '1px solid', borderColor: 'grey.200',
        display: 'flex', alignItems: 'center', px: 2, gap: 1.5, flexShrink: 0,
      }}
    >
      <IconButton size="small" onClick={onMenuClick} sx={{ color: 'text.secondary' }}>
        <MenuIcon fontSize="small" />
      </IconButton>

      {/* Search */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'grey.100', borderRadius: 6, px: 1.5, py: 0.6, maxWidth: 420 }}>
        <SearchIcon sx={{ fontSize: 17, color: 'grey.400' }} />
        <InputBase
          placeholder="Search documents, folders…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ fontSize: '0.8125rem', flex: 1 }}
          inputProps={{ 'aria-label': 'Search' }}
        />
      </Box>

      {/* Right actions */}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 16, height: 16 } }}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Help">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Avatar sx={{ width: 30, height: 30, bgcolor: '#DBEAFE', color: 'primary.dark', fontSize: 12, fontWeight: 600, ml: 0.5, cursor: 'pointer' }}>
          AS
        </Avatar>
      </Box>
    </Box>
  );
};

export default TopBar;
