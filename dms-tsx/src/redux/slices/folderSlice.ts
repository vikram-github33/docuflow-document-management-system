import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';

import { folderService } from '../../services/folderService';

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  children?: FolderNode[];
}

interface FolderState {
  tree: FolderNode[];
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  tree: [],
  loading: false,
  error: null,
};

export const fetchFolderTree = createAsyncThunk(
  'folders/fetchFolderTree',
  async () => {
    return await folderService.getFolderTree();
  }
);

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFolderTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchFolderTree.fulfilled,
        (state, action: PayloadAction<FolderNode[]>) => {
          state.loading = false;
          state.tree = action.payload;
        }
      )

      .addCase(fetchFolderTree.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? 'Failed to load folders';
      });
  },
});

export default folderSlice.reducer;