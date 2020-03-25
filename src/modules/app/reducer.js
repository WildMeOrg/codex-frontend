import { TOGGLE_SIDE_PANEL, TOGGLE_AUTHENTICATED } from './actions';

const initialState = {
  authenticated: false,
  sidePanelOpen: false,
};

export function appReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case TOGGLE_SIDE_PANEL:
      return {
        ...state,
        sidePanelOpen: !state.sidePanelOpen,
      };
    case TOGGLE_AUTHENTICATED:
      return {
        ...state,
        authenticated: !state.authenticated,
      };
    default:
      return state;
  }
}
