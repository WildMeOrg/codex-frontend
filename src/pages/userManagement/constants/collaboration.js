import { summaryStates } from '../../../utils/collaborationUtils';

export const collaborationLabelIds = {
  [summaryStates.view]: 'COLLABORATION_STATE_VIEW',
  [summaryStates.export]: 'COLLABORATION_STATE_EXPORT',
  [summaryStates.edit]: 'COLLABORATION_STATE_EDIT',
  [summaryStates.revoked]: 'COLLABORATION_STATE_REVOKED',
};
