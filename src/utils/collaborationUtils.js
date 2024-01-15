export const states = {
  denied: 'denied',
  approved: 'approved',
  pending: 'pending',
  notInitiated: 'not_initiated',
  revoked: 'revoked',
};

export const summaryStates = {
  view: 'view',
  export: 'export',
  edit: 'edit',
  revoked: 'revoked',
};

function getStates(collaboration, stateField) {
  return Object.values(collaboration?.members || {}).map(
    member => member?.[stateField],
  );
}

function isApproved(collaboration, stateField) {
  const currentStates = getStates(collaboration, stateField);

  return (
    currentStates.length > 0 &&
    currentStates.every(state => state === states.approved)
  );
}

function isPending(collaboration, stateField) {
  const currentStates = getStates(collaboration, stateField);

  return (
    currentStates.length > 0 &&
    currentStates.some(state => state === states.pending)
  );
}

function isRevoked(collaboration, stateField) {
  const currentStates = getStates(collaboration, stateField);

  return (
    currentStates.length > 0 &&
    currentStates.some(state => state === states.revoked)
  );
}

export function isViewApproved(collaboration) {
  return isApproved(collaboration, 'viewState');
}

export function isExportApproved(collaboration) {
  return isApproved(collaboration, 'exportState');
}

export function isEditApproved(collaboration) {
  return isApproved(collaboration, 'editState');
}

function isViewPending(collaboration) {
  return isPending(collaboration, 'viewState');
}

function isExportPending(collaboration) {
  return isPending(collaboration, 'exportState');
}

function isEditPending(collaboration) {
  return isPending(collaboration, 'editState');
}

export function isViewRevoked(collaboration) {
  return isRevoked(collaboration, 'viewState');
}

export function isExportRevoked(collaboration) {
  return isRevoked(collaboration, 'exportState');
}

export function getSummaryState(collaboration) {
  if (isViewRevoked(collaboration)) return summaryStates.revoked;

  if (isEditApproved(collaboration)) return summaryStates.edit;

  if (isExportApproved(collaboration)) return summaryStates.export;

  if (isViewApproved(collaboration)) return summaryStates.view;

  return '';
}

export function getRequestedState(collaboration) {
  if (isViewPending(collaboration)) return summaryStates.view;

  if (isExportPending(collaboration) && !isViewRevoked(collaboration)) 
  return summaryStates.export;

  if (
    isEditPending(collaboration) &&
    !isExportRevoked(collaboration) && !isViewRevoked(collaboration)
  ) {
    return summaryStates.edit;
  }

  return '';
}
