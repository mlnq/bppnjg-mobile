import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LocationSource = 'auto' | 'gps-only' | 'time-only';

export type PreferencesState = {
  routeLocationSource: LocationSource;
  isDevInfoVisible: boolean;
  isRouteFallbackModeEnabled: boolean;
};

const initialState: PreferencesState = {
  routeLocationSource: 'auto',
  isDevInfoVisible: false,
  isRouteFallbackModeEnabled: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setRouteLocationSource(state, action: PayloadAction<LocationSource>) {
      state.routeLocationSource = action.payload;
    },
    setDevInfoVisibilityEnabled(state, action: PayloadAction<boolean>) {
      state.isDevInfoVisible = action.payload;
    },
    enableDevInfoVisibility(state) {
      state.isDevInfoVisible = true;
    },
    resetDevInfoVisibility(state) {
      state.isDevInfoVisible = false;
    },
    setRouteFallbackModeEnabled(state, action: PayloadAction<boolean>) {
      state.isRouteFallbackModeEnabled = action.payload;
    },
    toggleRouteFallbackMode(state) {
      state.isRouteFallbackModeEnabled = !state.isRouteFallbackModeEnabled;
    },
  },
});

export const {
  setRouteLocationSource,
  setDevInfoVisibilityEnabled,
  enableDevInfoVisibility,
  resetDevInfoVisibility,
  setRouteFallbackModeEnabled,
  toggleRouteFallbackMode,
} = preferencesSlice.actions;

export const preferencesReducer = preferencesSlice.reducer;
