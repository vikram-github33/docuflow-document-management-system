import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Divider,
  MenuItem,
  ListItemIcon,
  Popover,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "services/auth.service";

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  avatarColor?: string;
}

interface UserProfilePopoverProps {
  user: any;
  onLogout: () => void;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────
export const UserProfilePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);
  console.log("user", user);
  const initials = getInitials(user?.firstName, user?.lastName);
  const avatarColor = user?.avatarColor ?? "#1976d2";

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = async () => {
    // handleClose();
    const refreshToken = localStorage.getItem("accessToken")
    console.log("refreshToken",refreshToken)
    if (refreshToken) {
      await logoutUser({
        refreshToken,
      });
    }
    // Clear Redux
    dispatch(logout());

    // Clear Local Storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // or simply:
    // localStorage.clear();

    // Redirect to Login
    navigate("/login");
  };

  const MENU_ITEMS = [
    {
      icon: <PersonOutlineIcon fontSize="small" />,
      label: "My Profile",
      sub: "View and edit profile",
      onClick: () => handleNavigate("/profile"),
    },
    {
      icon: <SettingsOutlinedIcon fontSize="small" />,
      label: "Settings",
      sub: "Preferences & account",
      onClick: () => handleNavigate("/settings"),
    },
    {
      icon: <SecurityIcon fontSize="small" />,
      label: "Security",
      sub: "Password & 2FA",
      onClick: () => handleNavigate("/settings/security"),
    },
    {
      icon: <DarkModeOutlinedIcon fontSize="small" />,
      label: "Appearance",
      sub: "Theme & display",
      onClick: () => handleNavigate("/settings/appearance"),
    },
  ];

  return (
    <>
      {/* ── Trigger avatar in header ── */}
      <Tooltip title="Account">
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{ p: 0 }}
          aria-label="Open user profile"
        >
          <Avatar
            sx={{
              bgcolor: avatarColor,
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: open ? "2px solid" : "2px solid transparent",
              borderColor: open ? avatarColor : "transparent",
              boxShadow: open ? `0 0 0 2px ${avatarColor}33` : "none",
              transition: "all 0.15s",
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* ── Popover ── */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.25,
              width: 280,
              borderRadius: 3,
              border: "0.5px solid",
              borderColor: "divider",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* ── User info header ── */}
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderBottom: "0.5px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: avatarColor,
                width: 44,
                height: 44,
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={600} fontSize={14} noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                display="block"
                fontSize={12}
              >
                {user?.email}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 0.75, mt: 0.5, flexWrap: "wrap" }}
              >
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 600,
                    bgcolor: "#E6F1FB",
                    color: "#1976d2",
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
                {user?.department && (
                  <Chip
                    label={user?.department}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      bgcolor: "grey.200",
                      color: "text.secondary",
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Menu items ── */}
        <Box sx={{ py: 0.75 }}>
          {MENU_ITEMS?.map((item) => (
            <MenuItem
              key={item.label}
              onClick={item.onClick}
              dense
              sx={{
                px: 2,
                py: 1,
                gap: 1.5,
                alignItems: "flex-start",
                borderRadius: 0,
                "&:hover": { bgcolor: "grey.50" },
                "&:hover .menu-icon": { color: "primary.main" },
              }}
            >
              <ListItemIcon
                className="menu-icon"
                sx={{
                  minWidth: 0,
                  color: "text.secondary",
                  mt: 0.1,
                  transition: "color 0.15s",
                }}
              >
                {item?.icon}
              </ListItemIcon>
              <Box>
                <Typography fontSize={13} fontWeight={500} color="text.primary">
                  {item.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontSize={11}
                >
                  {item.sub}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Box>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Help ── */}
        <Box sx={{ py: 0.75 }}>
          <MenuItem
            dense
            onClick={() => {
              handleClose();
              window.open("/help", "_blank");
            }}
            sx={{
              px: 2,
              py: 0.75,
              gap: 1.5,
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <HelpOutlineIcon fontSize="small" />
            </ListItemIcon>
            <Typography fontSize={13} color="text.secondary" flex={1}>
              Help & Support
            </Typography>
            <OpenInNewIcon sx={{ fontSize: 13, color: "text.disabled" }} />
          </MenuItem>
        </Box>

        <Divider />

        {/* ── Logout ── */}
        <Box sx={{ py: 0.75 }}>
          <MenuItem
            dense
            onClick={handleLogout}
            sx={{
              px: 2,
              py: 1,
              gap: 1.5,
              color: "error.main",
              "&:hover": { bgcolor: "error.50" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "error.main" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Box>
              <Typography fontSize={13} fontWeight={500} color="error.main">
                Sign out
              </Typography>
              <Typography variant="caption" color="text.disabled" fontSize={11}>
                End your session
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Popover>
    </>
  );
};

export default UserProfilePopover;
