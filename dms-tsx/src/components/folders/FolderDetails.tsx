import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { DynamicFolderIcon } from "./FolderIcon";
import { useFolderDetails, useDeleteFolder } from "../../hooks/useFolderHooks";
import type { FolderTreeNode } from "../../types/folder.types";

interface FolderDetailsProps {
  folder: FolderTreeNode | null;
  onClearSelection: () => void;
  onDeleted: () => void; // refresh tree after delete
  onEditClick?: (id: string) => void;
  onUploadClick?: (folderId: string) => void; // future hook
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const FolderDetails: React.FC<FolderDetailsProps> = ({
  folder,
  onClearSelection,
  onDeleted,
  onEditClick,
  onUploadClick,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { folder: details, loading, error, fetchFolder } = useFolderDetails();
  const {
    deleteFolder,
    loading: deleting,
    error: deleteError,
  } = useDeleteFolder();

  useEffect(() => {
    if (folder?.id) fetchFolder(folder.id);
  }, [folder?.id]);

  if (!folder) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 1.5,
          color: "text.secondary",
        }}
      >
        <FolderOpenIcon sx={{ fontSize: 52, opacity: 0.25 }} />
        <Typography variant="body2">Select a folder to view details</Typography>
      </Box>
    );
  }

  if (loading && !details) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use full details if loaded, else fall back to tree node data
  const f = details ?? folder;

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <DynamicFolderIcon
            icon={folder.icon ?? "folder"}
            color={folder.color ?? "#1976d2"}
            sx={{ fontSize: 36 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
              {f.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="monospace"
            >
              {f.path}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          {onEditClick && (
            <Tooltip title="Edit folder">
              <IconButton size="small" onClick={() => onEditClick(folder.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete folder">
            <IconButton
              size="small"
              color="error"
              onClick={() => setConfirmDelete(true)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Description */}
      {details?.description && (
        <Typography variant="body2" color="text.secondary">
          {details.description}
        </Typography>
      )}

      {error && (
        <Alert severity="warning" sx={{ py: 0.5 }}>
          {error}
        </Alert>
      )}

      <Divider />

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {f.documentCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Documents
          </Typography>
        </Box>
        <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {details ? formatBytes(details.totalSize) : "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total size
          </Typography>
        </Box>
      </Box>

      {/* Meta */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {details?.owner && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Owner
            </Typography>
            <Typography variant="caption">{details.owner.name}</Typography>
          </Box>
        )}
        {details?.createdAt && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Created
            </Typography>
            <Typography variant="caption">
              {timeAgo(details.createdAt)}
            </Typography>
          </Box>
        )}
        {details?.updatedAt && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Modified
            </Typography>
            <Typography variant="caption">
              {timeAgo(details.updatedAt)}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={f.isArchived ? "Archived" : "Active"}
            size="small"
            color={f.isArchived ? "default" : "success"}
            sx={{ height: 18, fontSize: 10 }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Actions */}
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}
      >
        {onUploadClick && (
          <Button
            variant="contained"
            fullWidth
            disableElevation
            disabled={f.isArchived}
            onClick={() => onUploadClick(folder.id)}
          >
            Upload Documents
          </Button>
        )}
        <Button variant="outlined" fullWidth onClick={onClearSelection}>
          Clear Selection
        </Button>
      </Box>

      {/* Delete confirm dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="xs"
      >
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{f.name}</strong>? This
            cannot be undone.
          </Typography>
          {f.documentCount > 0 && (
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              This folder has {f.documentCount} document(s). Move or delete them
              first.
            </Alert>
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disableElevation
            disabled={deleting || f.documentCount > 0}
            onClick={async () => {
              const ok = await deleteFolder(folder.id);
              if (ok) {
                setConfirmDelete(false);
                onDeleted();
                onClearSelection();
              }
            }}
            startIcon={
              deleting ? (
                <CircularProgress size={14} color="inherit" />
              ) : undefined
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
