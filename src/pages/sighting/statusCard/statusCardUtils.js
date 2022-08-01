import {
  formatDate,
  formatDateCustom,
} from '../../../utils/formatters';
import stages from './stages';

export function getDateString(date) {
  return date ? formatDate(date, true) : '';
}

export function getDateTimeString(date) {
  return date ? formatDateCustom(date, 'PPp') : '';
}

export function getStage(pipelineStepState) {
  const { skipped, inProgress, complete, failed } =
    pipelineStepState || {};

  if (skipped) return stages.skipped;

  if (inProgress) return stages.current;

  if (failed) return stages.failed;

  if (complete) return stages.finished;

  return stages.waiting;
}
