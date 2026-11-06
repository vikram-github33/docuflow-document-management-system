import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface DocumentVersion {
  id: number | string;
  versionNumber: number;
  createdAt: string;
  uploader?: {
    id: number;
    name: string;
  };
  changeSummary?: string;
  fileSize?: string;
}

interface VersionHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  documentName: string;
  versions: DocumentVersion[];
  currentVersionId: number | string;
  onViewVersion: (version: DocumentVersion) => void;
  onDownloadVersion: (version: DocumentVersion) => void;
  onCompareVersions: (
    version1: DocumentVersion,
    version2: DocumentVersion
  ) => void;
}

const VersionHistoryDrawer = ({
  open,
  onClose,
  documentName,
  versions,
  currentVersionId,
  onViewVersion,
  onDownloadVersion,
  onCompareVersions,
}: VersionHistoryDrawerProps) => {
  const [selectedVersions, setSelectedVersions] = useState<
    DocumentVersion[]
  >([]);

  const handleCompareSelection = (version: DocumentVersion) => {
    setSelectedVersions((prev) => {
      const exists = prev.some((item) => item.id === version.id);

      if (exists) {
        return prev.filter((item) => item.id !== version.id);
      }

      if (prev.length === 2) {
        return [prev[1], version];
      }

      return [...prev, version];
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          p: 0,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <HistoryIcon color="primary" />

            <Typography variant="h6" fontWeight={600}>
              Version History
            </Typography>
          </Stack>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <DescriptionIcon color="action" />

          <Box>
            <Typography fontWeight={600}>
              {documentName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {versions.length} versions available
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Compare section */}
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontWeight={600} variant="body2">
              Compare Versions
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Select any two versions to compare
            </Typography>
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<CompareArrowsIcon />}
            disabled={selectedVersions.length !== 2}
            onClick={() =>
              onCompareVersions(
                selectedVersions[0],
                selectedVersions[1]
              )
            }
          >
            Compare
          </Button>
        </Stack>
      </Box>

      <Divider />

      {/* Version List */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
        {versions.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <HistoryIcon
              sx={{ fontSize: 45, color: "text.disabled" }}
            />

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No version history available
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {versions.map((version, index) => {
              const isCurrent =
                version.id === currentVersionId;
                // version.id 

              const isSelected = selectedVersions.some(
                (item) => item.id === version.id
              );

              return (
                <Box
                  key={version.id}
                  sx={{
                    border: "1px solid",
                    borderColor: isSelected
                      ? "primary.main"
                      : "divider",
                    borderRadius: 2,
                    p: 2,
                    bgcolor: isSelected
                      ? "action.selected"
                      : "background.paper",
                  }}
                >
                  {/* Version heading */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography fontWeight={700}>
                        Version {version.versionNumber}
                      </Typography>

                      {isCurrent && (
                        <Chip
                          label="Current"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      )}
                    </Stack>

                    <Chip
                      label={isSelected ? "Selected" : "Select"}
                      size="small"
                      variant="outlined"
                      color={isSelected ? "primary" : "default"}
                      onClick={() =>
                        handleCompareSelection(version)
                      }
                    />
                  </Stack>

                  {/* Date */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {formatDate(version.createdAt)}
                  </Typography>

                  {/* Uploader */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1.5 }}
                  >
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {version.uploader?.name?.charAt(0) || "U"}
                    </Avatar>

                    <Box>
                      <Typography variant="body2">
                        {version.uploader?.name || "Unknown user"}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Uploaded by
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Change summary */}
                  {version.changeSummary && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.5 }}
                    >
                      {version.changeSummary}
                    </Typography>
                  )}

                  {version.fileSize && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Size: {version.fileSize}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  {/* Actions */}
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                  >
                    <Tooltip title="View version">
                      <IconButton
                        size="small"
                        onClick={() => onViewVersion(version)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Download version">
                      <IconButton
                        size="small"
                        onClick={() => onDownloadVersion(version)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

export default VersionHistoryDrawer;