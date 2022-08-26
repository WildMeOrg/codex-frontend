import { summaryStates } from '../../../models/collaboration/model';

export const collaborationLabelIds = {
  [summaryStates.view]: 'COLLABORATION_STATE_VIEW',
  [summaryStates.edit]: 'COLLABORATION_STATE_EDIT',
  [summaryStates.revoked]: 'COLLABORATION_STATE_REVOKED',
};
