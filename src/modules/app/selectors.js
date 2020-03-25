import { get } from 'lodash-es';

export const selectAppState = state => state.app;
export const selectAuthenticated = state =>
  get(state, 'app.authenticated', false);
export const selectSidePanelOpen = state =>
  get(state, 'app.sidePanelOpen', false);
