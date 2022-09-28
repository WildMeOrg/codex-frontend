import { pick } from 'lodash-es';

export function getProgress(pipelineStepState) {
  return pick(pipelineStepState, ['ahead', 'eta', 'progress']);
}
