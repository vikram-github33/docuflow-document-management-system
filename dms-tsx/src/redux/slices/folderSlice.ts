import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { folderService } from '../../services/folderService';
import type { FolderTreeNode, Folder } from '../../types/folder.types';

// ── State ─────────────────────────────────────────────────────────────────────
interface FolderState {
  tree: FolderTreeNode[];
  selectedFolder: FolderTreeNode | null;
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  tree: [],
  selectedFolder: null,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const fetchFolderTree = createAsyncThunk(
  'folders/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      return await folderService.getFolderTree();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to load folders';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const createFolderThunk = createAsyncThunk(
  'folders/create',
  async (payload: Parameters<typeof folderService.createFolder>[0], { dispatch, rejectWithValue }) => {
    try {
      const result = await folderService.createFolder(payload);
      // Refresh tree after creation
      dispatch(fetchFolderTree());
      return result;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to create folder';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

export const deleteFolderThunk = createAsyncThunk(
  'folders/delete',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await folderService.deleteFolder(id);
      dispatch(fetchFolderTree());
      return id;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to delete folder';
      return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setSelectedFolder(state, action) {
      state.selectedFolder = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFolderTree
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
      // deleteFolderThunk
      .addCase(deleteFolderThunk.fulfilled, (state, action) => {
        // If the deleted folder was selected, clear it
        if (state.selectedFolder?.id === action.payload) {
          state.selectedFolder = null;
        }
      });
  },
});

export const { setSelectedFolder, clearError } = folderSlice.actions;
export default folderSlice.reducer;
