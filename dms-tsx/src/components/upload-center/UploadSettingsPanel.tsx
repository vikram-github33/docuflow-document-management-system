import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Switch,
  Button,
  CircularProgress,
  Autocomplete,
  Chip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import { fetchFolders } from "../../services/upload.service";
import type { FolderOption, UploadSettings } from "../../types/upload.types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchFolderTree } from "../../redux/slices/folderSlice";
interface UploadSettingsPanelProps {
  settings: UploadSettings;
  onChange: (updated: UploadSettings) => void;
  onStartUpload: () => void;
  hasFiles: boolean;
  isProcessing: boolean;
}

export const UploadSettingsPanel: React.FC<UploadSettingsPanelProps> = ({
  settings,
  onChange,
  onStartUpload,
  hasFiles,
  isProcessing,
}) => {
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const dispatch = useAppDispatch();
  const { tree, loading, error } = useAppSelector((state) => state.folders);
  // console.log("tree",tree)
  // useEffect(() => {
  //   setLoadingFolders(true);
  //   fetchFolders()
  //     .then(setFolders)
  //     .catch(console.error)
  //     .finally(() => setLoadingFolders(false));
  // }, []);
  useEffect(() => {
    dispatch(fetchFolderTree());
  }, [dispatch]);
  const update = (patch: Partial<UploadSettings>) =>
    onChange({ ...settings, ...patch });
  // console.log("settings",settings)
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
      >
        <SettingsIcon sx={{ fontSize: 16 }} /> Settings
      </Typography>

      {/* Folder */}
      <TextField
        select
        label="Destination folder"
        value={settings.folderId ?? ""}
        onChange={(e) => update({ folderId: e.target.value || null })}
        size="small"
        fullWidth
        InputProps={{
          endAdornment: loadingFolders ? (
            <CircularProgress size={14} sx={{ mr: 1 }} />
          ) : null,
        }}
      >
        <MenuItem value="">— Root —</MenuItem>
        {tree.map((f) => (
          <MenuItem key={f.id} value={f.id}>
            📁 {f.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Tags */}
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={settings.tags}
        onChange={(_, newValue) => {
          update({
            tags: newValue.map((tag) => String(tag)),
          });
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              // key={option}
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="Type a tag and press Enter"
          />
        )}
      />

      {/* Description */}
      <TextField
        label="Description"
        placeholder="Optional note about this batch..."
        value={settings.description}
        onChange={(e) => update({ description: e.target.value })}
        multiline
        minRows={2}
        maxRows={3}
        size="small"
        fullWidth
        inputProps={{ maxLength: 500 }}
      />

      {/* Toggles */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography variant="body2">Overwrite existing</Typography>
          <Switch
            checked={settings.overwriteExisting}
            onChange={(e) => update({ overwriteExisting: e.target.checked })}
            size="small"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Notify on complete</Typography>
          <Switch
            checked={settings.notifyOnComplete}
            onChange={(e) => update({ notifyOnComplete: e.target.checked })}
            size="small"
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        startIcon={
          isProcessing ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <UploadIcon />
          )
        }
        onClick={onStartUpload}
        disabled={!hasFiles || isProcessing}
        disableElevation
        sx={{ py: 1.25, fontWeight: 500, mt: 0.5 }}
      >
        {isProcessing ? "Uploading..." : "Start upload"}
      </Button>
    </Box>
  );
};
