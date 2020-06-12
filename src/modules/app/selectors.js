import { get } from 'lodash-es';

export const selectAppState = state => state.app;

export const selectIsAuthenticated = state =>
  get(state, 'app.authenticated', false);

export const selectSidePanelOpen = state =>
  get(state, 'app.sidePanelOpen', false);

export const selectIsAdministrator = state =>
  get(state, 'app.administrator', true);

export const selectLocale = state => get(state, 'app.locale');

export const selectLoginRedirect = state =>
  get(state, 'app.loginRedirect', '/');
