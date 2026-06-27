import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { trashService } from '../../services/trash.service';
import type { TrashedDocument, TrashedFolder } from '../../types/trash.types';

interface TrashState {
  documents: TrashedDocument[];
  folders:   TrashedFolder[];
  loading:   boolean;
  error:     string | null;
  selectedIds: string[];
}

const initialState: TrashState = {
  documents:   [],
  folders:     [],
  loading:     false,
  error:       null,
  selectedIds: [],
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchTrash = createAsyncThunk(
  'trash/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [documents, folders] = await Promise.all([
        trashService.getTrashedDocuments(),
        trashService.getTrashedFolders(),
      ]);
      return { documents, folders };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to load trash');
    }
  }
);

export const restoreItem = createAsyncThunk(
  'trash/restore',
  async ({ id, type }: { id: string; type: 'document' | 'folder' }, { dispatch, rejectWithValue }) => {
    try {
      if (type === 'document') await trashService.restoreDocument(id);
      else                      await trashService.restoreFolder(id);
      dispatch(fetchTrash());
      return { id, type };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to restore item');
    }
  }
);

export const permanentlyDelete = createAsyncThunk(
  'trash/permanentDelete',
  async ({ id, type }: { id: string; type: 'document' | 'folder' }, { dispatch, rejectWithValue }) => {
    try {
      if (type === 'document') await trashService.permanentlyDeleteDocument(id);
      else                      await trashService.permanentlyDeleteFolder(id);
      dispatch(fetchTrash());
      return { id, type };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to delete item');
    }
  }
);

export const emptyTrash = createAsyncThunk(
  'trash/emptyAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await trashService.emptyTrash();
      dispatch(fetchTrash());
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to empty trash');
    }
  }
);

export const getTrashFiles = createAsyncThunk(
  'trash/trashfiles',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await trashService.emptyTrash();
      dispatch(fetchTrash());
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to empty trash');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const trashSlice = createSlice({
  name: 'trash',
  initialState,
  reducers: {
    toggleSelect(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(s => s !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAll(state) {
      const allIds = [
        ...state.documents.map(d => d.id),
        ...state.folders.map(f => f.id),
      ];
      state.selectedIds = allIds;
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrash.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrash.fulfilled, (state, action) => {
        state.loading   = false;
        state.documents = action.payload.documents;
        state.folders   = action.payload.folders;
      })
      .addCase(fetchTrash.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });
  },
});

export const { toggleSelect, selectAll, clearSelection, clearError } = trashSlice.actions;
export default trashSlice.reducer;
