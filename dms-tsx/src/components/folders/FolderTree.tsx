import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
// ✅ @mui/x-tree-view v8 — MUI v5 compatible
// Install: npm install @mui/x-tree-view@8.29.0
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GavelIcon from "@mui/icons-material/Gavel";
import InventoryIcon from "@mui/icons-material/Inventory";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import { useFolderTree } from "../../hooks/useFolderHooks";
import type { FolderTreeNode } from "../../types/folder.types";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  folder: FolderIcon,
  work: WorkIcon,
  people: PeopleIcon,
  description: DescriptionIcon,
  analytics: AnalyticsIcon,
  gavel: GavelIcon,
  inventory: InventoryIcon,
  school: SchoolIcon,
  star: StarIcon,
  settings: SettingsIcon,
};

function DynamicIcon({
  icon,
  color,
  fontSize = 19,
}: {
  icon?: string;
  color?: string;
  fontSize?: number;
}) {
  const IconComponent = ICON_MAP[icon ?? "folder"] ?? FolderIcon;
  return (
    <IconComponent
      sx={{ fontSize, color: color ?? "inherit", flexShrink: 0 }}
    />
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface FolderTreeProps {
  selectedId: string | null;
  onSelect: (folder: FolderTreeNode) => void;
  refreshTrigger?: number;
}

// ─── Recursive node ───────────────────────────────────────────────────────────
function FolderNode({
  node,
  selectedId,
  expandedItems,
  onSelect,
}: {
  node: FolderTreeNode;
  selectedId: string | null;
  expandedItems: string[];
  onSelect: (f: FolderTreeNode) => void;
}) {
  const isSelected = node.id === selectedId;
  const isExpanded = expandedItems.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const nodeColor = node.color ?? "#1976d2";

  const label = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.5,
        px: 0.5,
        borderRadius: 1.5,
        bgcolor: isSelected ? `${nodeColor}18` : "transparent",
        transition: "background-color 0.15s ease",
        minWidth: 0,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      {hasChildren && isExpanded ? (
        <FolderOpenIcon
          sx={{ fontSize: 19, color: nodeColor, flexShrink: 0 }}
        />
      ) : (
        <DynamicIcon icon={node.icon} color={nodeColor} />
      )}

      <Typography
        variant="body2"
        noWrap
        sx={{
          flex: 1,
          fontWeight: isSelected ? 600 : 400,
          color: isSelected ? nodeColor : "text.primary",
          lineHeight: 1.4,
        }}
      >
        {node.name}
      </Typography>

      {node.documentCount > 0 && (
        <Tooltip title={`${node.documentCount} document(s)`} placement="right">
          <Chip
            label={node.documentCount}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontWeight: 600,
              flexShrink: 0,
              bgcolor: `${nodeColor}22`,
              color: nodeColor,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Tooltip>
      )}

      {node.isArchived && (
        <Chip
          label="Archived"
          size="small"
          sx={{
            height: 16,
            fontSize: 9,
            flexShrink: 0,
            bgcolor: "grey.200",
            color: "text.secondary",
            "& .MuiChip-label": { px: 0.5 },
          }}
        />
      )}
    </Box>
  );

  return (
    <TreeItem
      nodeId={node.id} // v8 uses itemId instead of nodeId
      label={label}
      sx={{
        "& .MuiTreeItem-content": {
          borderRadius: 1.5,
          py: 0.1,
          "&:hover": { bgcolor: "transparent" },
          "&.Mui-selected": { bgcolor: "transparent" },
          "&.Mui-selected:hover": { bgcolor: "transparent" },
          "&.Mui-focused": { bgcolor: "transparent" },
          "&.Mui-selected.Mui-focused": { bgcolor: "transparent" },
        },
        "& .MuiTreeItem-iconContainer": { color: "text.secondary" },
      }}
    >
      {hasChildren &&
        node.children.map((child) => (
          <FolderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            expandedItems={expandedItems}
            onSelect={onSelect}
          />
        ))}
    </TreeItem>
  );
}

// ─── FolderTree ───────────────────────────────────────────────────────────────
export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedId,
  onSelect,
  refreshTrigger = 0,
}) => {
  const { tree, loading, error, refetch } = useFolderTree();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Auto-expand ancestors of the selected folder
  useEffect(() => {
    if (!selectedId || !tree.length) return;

    function findAncestors(
      nodes: FolderTreeNode[],
      targetId: string,
      ancestors: string[] = [],
    ): string[] | null {
      for (const n of nodes) {
        if (n.id === targetId) return ancestors;
        const found = findAncestors(n.children, targetId, [...ancestors, n.id]);
        if (found) return found;
      }
      return null;
    }

    const ancestors = findAncestors(tree, selectedId);
    if (ancestors && ancestors.length > 0) {
      setExpandedItems((prev) => Array.from(new Set([...prev, ...ancestors])));
    }
  }, [selectedId, tree]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 4,
          color: "text.secondary",
        }}
      >
        <CircularProgress size={24} thickness={4} />
        <Typography variant="caption">Loading folders...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 1.5 }}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={refetch} title="Retry">
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography variant="caption">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 4,
          color: "text.secondary",
        }}
      >
        <FolderIcon sx={{ fontSize: 40, opacity: 0.25 }} />
        <Typography variant="body2" fontWeight={500}>
          No folders yet
        </Typography>
        <Typography variant="caption" textAlign="center">
          Click "Create Folder" to get started
        </Typography>
      </Box>
    );
  }

  return (
    <TreeView
      expanded={expandedItems}
      onNodeToggle={(_e, nodeIds) =>
        setExpandedItems(Array.isArray(nodeIds) ? nodeIds : [nodeIds])
      }
      selected={selectedId ?? ""}
      onNodeSelect={(_e, nodeId) => {
        console.log(nodeId);
      }}
    >
      {tree.map((node) => (
        <FolderNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          expandedItems={expandedItems}
          onSelect={onSelect}
        />
      ))}
    </TreeView>
  );
};
