import { SET_NEEDS_FETCH } from './actions';

const initialState = {
  needsFetch: true,
};

export function appReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SET_NEEDS_FETCH:
      return {
        ...state,
        needsFetch: action.needsFetch,
      };
    default:
      return state;
  }
}
