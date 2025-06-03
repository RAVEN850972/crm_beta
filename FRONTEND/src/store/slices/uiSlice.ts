import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, SidebarState, ModalState } from '../../types';

interface UIState {
  theme: Theme;
  sidebar: SidebarState;
  modal: ModalState;
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
}

const initialState: UIState = {
  theme: 'light',
  sidebar: {
    isCollapsed: false,
    isMobileOpen: false,
  },
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  loading: {
    global: false,
    components: {},
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.sidebar.isMobileOpen = !state.sidebar.isMobileOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isMobileOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ type: ModalState['type']; data?: any }>) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = null;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  openModal,
  closeModal,
  setGlobalLoading,
  setComponentLoading,
} = uiSlice.actions;

export default uiSlice.reducer;