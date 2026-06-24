import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { folderService } from "../../services/folderService";
import type {
  FolderTreeNode,
  FolderDocument,
  ExplorerSelection,
  Folder,
} from "../../types/folder.types";
import { findAncestorIds, findNodeById } from "../../utils/fileIcons";

interface FolderState {
  tree: FolderTreeNode[];
  selection: ExplorerSelection;
  expandedIds: string[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  // Keep for backward compat with existing CreateFolderDialog allFolders prop
  selectedFolder: FolderTreeNode | null;
  searchResults: any[];
}

const initialState: FolderState = {
  tree: [],
  selection: null,
  expandedIds: [],
  searchQuery: "",
  loading: false,
  error: null,
  selectedFolder: null,
  searchResults: [],
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchFolderTree = createAsyncThunk(
  "folders/fetchTree",
  async (_, { rejectWithValue }) => {
    try {
      return await folderService.getFolderTree();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load folders";
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  },
);

export const getAiPoweredSearch = createAsyncThunk(
  "folders/search",
  async (query: string, { rejectWithValue }) => {
    try {
      return await folderService.aiPoweredSearch(query);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load folders";
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  },
);

export const createFolderThunk = createAsyncThunk(
  "folders/create",
  async (
    payload: Parameters<typeof folderService.createFolder>[0],
    { dispatch, rejectWithValue },
  ) => {
    try {
      const result = await folderService.createFolder(payload);
      dispatch(fetchFolderTree());
      return result;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create folder";
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  },
);

export const deleteFolderThunk = createAsyncThunk(
  "folders/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await folderService.deleteFolder(id);
      dispatch(fetchFolderTree());
      return id;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete folder";
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    selectFolder(state, action: PayloadAction<FolderTreeNode | null>) {
      const folder = action.payload;
      state.selection = folder ? { type: "folder", item: folder } : null;
      state.selectedFolder = folder; // backward compat

      // Auto-expand ancestors
      if (folder && state.tree.length) {
        const ancestors = findAncestorIds(state.tree, folder.id) ?? [];
        const next = new Set([...state.expandedIds, ...ancestors]);
        state.expandedIds = Array.from(next);
      }
    },

    selectFile(
      state,
      action: PayloadAction<{ doc: FolderDocument; folderId: string } | null>,
    ) {
      if (!action.payload) {
        state.selection = null;
        return;
      }
      state.selection = {
        type: "file",
        item: action.payload.doc,
        folderId: action.payload.folderId,
      };
    },

    clearSelection(state) {
      state.selection = null;
      state.selectedFolder = null;
    },

    setExpandedIds(state, action: PayloadAction<string[]>) {
      state.expandedIds = action.payload;
    },

    expandAll(state) {
      const ids: string[] = [];
      function collect(nodes: FolderTreeNode[]) {
        for (const n of nodes) {
          if (n.children?.length > 0) ids.push(n.id);
          collect(n.children ?? []);
        }
      }
      collect(state.tree);
      state.expandedIds = ids;
    },

    collapseAll(state) {
      state.expandedIds = [];
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    // Backward compat kept for CreateFolderDialog
    setSelectedFolder(state, action: PayloadAction<FolderTreeNode | null>) {
      state.selectedFolder = action.payload;
      state.selection = action.payload
        ? { type: "folder", item: action.payload }
        : null;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolderTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolderTree.fulfilled, (state, action) => {
        state.loading = false;
        state.tree = action.payload;
      })
      .addCase(fetchFolderTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFolderThunk.fulfilled, (state, action) => {
        if (state.selectedFolder?.id === action.payload) {
          state.selectedFolder = null;
          state.selection = null;
        }
      })
      .addCase(getAiPoweredSearch.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAiPoweredSearch.fulfilled, (state, action) => {
        state.loading = false;

        state.searchResults = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })

      .addCase(getAiPoweredSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectFolder,
  selectFile,
  clearSelection,
  setExpandedIds,
  expandAll,
  collapseAll,
  setSearchQuery,
  setSelectedFolder,
  clearError,
} = folderSlice.actions;

export default folderSlice.reducer;
