import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import TableChartIcon from "@mui/icons-material/TableChart";
import ArticleIcon from "@mui/icons-material/Article";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectFolder,
  selectFile,
  fetchFolderTree,
} from "../../redux/slices/folderSlice";
import {
  getFileIconConfig,
  formatFileSize,
  timeAgo,
  formatSizeBytes,
} from "../../utils/fileIcons";
import type { FolderTreeNode, FolderDocument } from "../../types/folder.types";
import { moveFilesInTrash } from "services/document.service";

function FileIcon({ fileType, color }: { fileType: string; color: string }) {
  const sx = { fontSize: 18, color };
  if (fileType === "application/pdf") return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith("image/")) return <ImageIcon sx={sx} />;
  if (fileType.includes("sheet") || fileType.includes("csv"))
    return <TableChartIcon sx={sx} />;
  if (fileType.includes("word") || fileType.includes("document"))
    return <ArticleIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

type SortField = "name" | "type" | "modified";
type SortDir = "asc" | "desc";

interface FolderViewProps {
  folder: FolderTreeNode;
}

export const FolderView: React.FC<FolderViewProps> = ({ folder }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const open = Boolean(anchorEl);

  const dispatch = useAppDispatch();
  const { tree } = useAppSelector((s) => s.folders);
  const color = folder.color ?? "#1976d2";

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // Count all descendants
  const countDescendants = (nodes: FolderTreeNode[]): number =>
    nodes.reduce((acc, n) => acc + 1 + countDescendants(n.children ?? []), 0);

  const subfolderCount = folder.children?.length ?? 0;
  const descendantCount = countDescendants(folder.children ?? []);

  // Sort documents
  const sortedDocs = [...(folder.documents ?? [])].sort((a, b) => {
    let cmp = 0;
    if (sortField === "name") cmp = a.fileName.localeCompare(b.fileName);
    if (sortField === "type") cmp = a.fileType.localeCompare(b.fileType);
    if (sortField === "modified")
      cmp = (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleOpen = (event: React.MouseEvent<HTMLElement>, doc: any) => {
    event.stopPropagation();
    setOpenDeleteDialog(true);
    setAnchorEl(null);
    setSelectedDoc(doc);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    await moveFilesInTrash(selectedDoc.id);
    setOpenDeleteDialog(false);
    setAnchorEl(null);
    setSelectedDoc(null);
    dispatch(fetchFolderTree());
    // Refresh your list here
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Folder header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          sx={{ bgcolor: `${color}18`, width: 52, height: 52, borderRadius: 2 }}
        >
          <FolderIcon sx={{ color, fontSize: 30 }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontSize: 18, lineHeight: 1.2 }}
          >
            {folder.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="monospace"
            sx={{ fontSize: 11 }}
          >
            {folder.path}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75, mt: 0.5, flexWrap: "wrap" }}>
            {folder.isArchived && (
              <Chip
                label="Archived"
                size="small"
                sx={{ height: 18, fontSize: 10 }}
              />
            )}
            {folder.color && (
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: color,
                  mt: 0.2,
                  border: "1.5px solid",
                  borderColor: "divider",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1.5,
        }}
      >
        {[
          { label: "Files", value: folder.documents.length },
          { label: "Subfolders", value: subfolderCount },
          { label: "All folders", value: descendantCount },
          { label: "Status", value: folder.isArchived ? "Archived" : "Active" },
        ].map(({ label, value }) => (
          <Paper
            key={label}
            variant="outlined"
            sx={{ p: 1.25, borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ fontSize: 20, lineHeight: 1 }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 11 }}
            >
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider />

      {/* Subfolders */}
      {subfolderCount > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontSize: 10,
              mb: 1,
              display: "block",
            }}
          >
            Subfolders ({subfolderCount})
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 1,
            }}
          >
            {folder.children.map((child) => {
              const childColor = child.color ?? "#1976d2";
              return (
                <Paper
                  key={child.id}
                  variant="outlined"
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "all 0.15s",
                    "&:hover": {
                      borderColor: childColor,
                      bgcolor: `${childColor}08`,
                      transform: "translateY(-1px)",
                      boxShadow: 1,
                    },
                  }}
                  onClick={() => dispatch(selectFolder(child))}
                >
                  <FolderIcon
                    sx={{ color: childColor, fontSize: 22, flexShrink: 0 }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      fontWeight={500}
                      sx={{ fontSize: 12 }}
                    >
                      {child.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 10 }}
                    >
                      {child.documentCount} file
                      {child.documentCount !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Files table */}
      {sortedDocs.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontSize: 10,
              mb: 1,
              display: "block",
            }}
          >
            Files ({sortedDocs.length})
          </Typography>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, py: 1 }}>
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortDir : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 11, fontWeight: 600, py: 1, width: 80 }}
                  >
                    <TableSortLabel
                      active={sortField === "type"}
                      direction={sortField === "type" ? sortDir : "asc"}
                      onClick={() => handleSort("type")}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 11, fontWeight: 600, py: 1, width: 80 }}
                  >
                    Size
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 11, fontWeight: 600, py: 1, width: 100 }}
                  >
                    <TableSortLabel
                      active={sortField === "modified"}
                      direction={sortField === "modified" ? sortDir : "asc"}
                      onClick={() => handleSort("modified")}
                    >
                      Modified
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: 40, py: 1 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDocs.map((doc) => {
                  const cfg = getFileIconConfig(doc.fileType);
                  return (
                    <TableRow
                      key={doc.id}
                      hover
                      sx={{ cursor: "pointer", "& td": { py: 0.75 } }}
                      onClick={() =>
                        dispatch(selectFile({ doc, folderId: folder.id }))
                      }
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FileIcon fileType={doc.fileType} color={cfg.color} />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontSize: 12, maxWidth: 240 }}
                          >
                            {doc.fileName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cfg.label}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 9,
                            bgcolor: `${cfg.color}15`,
                            color: cfg.color,
                            "& .MuiChip-label": { px: 0.5 },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {doc.updatedAt ? timeAgo(doc.updatedAt) : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="More actions">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              handleOpen(e, doc);
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertIcon sx={{ fontSize: 15 }} />
                            {/* <ListItemIcon>
                              <DeleteIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Move to Trash</ListItemText> */}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={() => handleDelete()}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Move to Trash</ListItemText>
              </MenuItem>
            </Menu>
            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
            >
              <DialogTitle>Move to Trash</DialogTitle>

              <DialogContent>
                Are you sure you want to move
                <strong>{selectedDoc?.fileName}</strong>
                to trash?
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)}>
                  Cancel
                </Button>

                <Button
                  color="error"
                  variant="contained"
                  onClick={handleDelete}
                >
                  Move to Trash
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      )}

      {/* Empty folder */}
      {subfolderCount === 0 && sortedDocs.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <FolderIcon sx={{ fontSize: 52, opacity: 0.2 }} />
          <Typography variant="body2" fontWeight={500}>
            This folder is empty
          </Typography>
          <Typography variant="caption">
            Upload files or create subfolders to get started
          </Typography>
        </Box>
      )}
    </Box>
  );
};
