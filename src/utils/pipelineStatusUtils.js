import { pick } from 'lodash-es';

export function getProgress(pipelineStepStatus) {
  return pick(pipelineStepStatus, ['ahead', 'eta', 'progress']);
}
