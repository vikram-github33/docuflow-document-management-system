import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ExplorerToolbar } from "../../components/explorer/ExplorerToolbar";
import { ExplorerSidebar } from "../../components/explorer/ExplorerSidebar";
import { ExplorerBreadcrumb } from "../../components/explorer/ExplorerBreadcrumb";
import { ExplorerMain } from "../../components/explorer/ExplorerMain";
import {
  ContextMenu,
  type ContextMenuState,
} from "../../components/explorer/ContextMenu";
import { CreateFolderDialog } from "../../components/folders/CreateFolderDialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchFolderTree, selectFolder } from "../../redux/slices/folderSlice";
import type { FolderTreeNode } from "../../types/folder.types";
import { findNodeById } from "utils/fileIcons";
import { ToastMessage, UploadToastStack } from "components/upload-center/UploadToastStack";

export const FolderManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tree, selection } = useAppSelector((s) => s.folders);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchFolderTree());
  }, [dispatch]);
  const pushToast = useCallback(
    (message: string, severity: ToastMessage["severity"] = "info") => {
      setToasts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message,
          severity,
        },
      ]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const handleContextMenu = (
    e: React.MouseEvent,
    type: "folder" | "file",
    id: string,
    node: FolderTreeNode,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, type, id, node });
  };

  const handleCreateSuccess = () => {
    dispatch(fetchFolderTree());
  };

  // The parent folder for CreateFolderDialog
  // const parentFolder = selection?.type === 'folder' ? selection.item : null;
  const parentFolder =
    selection?.type === "folder" ? findNodeById(tree, selection.item.id) : null;
  // console.log("tree",tree)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "grey.50",
      }}
      onContextMenu={(e) => e.preventDefault()} // prevent browser menu on empty areas
    >
      {/* Toolbar */}
      <ExplorerToolbar onNewFolder={() => setCreateDialogOpen(true)} />

      {/* Breadcrumb */}
      <ExplorerBreadcrumb />

      {/* Main layout */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left sidebar — 280px fixed */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: "0.5px solid",
            borderColor: "divider",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ExplorerSidebar onContextMenu={handleContextMenu} />
        </Box>

        {/* Right main panel */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ExplorerMain />
        </Box>
      </Box>

      {/* Context menu */}
      <ContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(null)}
        onNewFolder={() => {
          setContextMenu(null);
          setCreateDialogOpen(true);
        }}
      />

      {/* Create folder dialog */}
      <CreateFolderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        parentFolder={parentFolder}
        allFolders={tree}
        pushToast={pushToast}
      />
      <UploadToastStack toasts={toasts} onClose={removeToast} />
    </Box>
  );
};
