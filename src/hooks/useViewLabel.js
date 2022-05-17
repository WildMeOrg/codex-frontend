import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

export default function useViewLabel(
  fieldSchema,
  noAsterisk = false,
) {
  const intl = useIntl();
  let label = null;
  if (fieldSchema?.viewLabelId) {
    label = intl.formatMessage({ id: fieldSchema.viewLabelId });
  } else if (fieldSchema?.viewLabel) {
    label = get(fieldSchema, 'viewLabel', undefined);
  } else if (fieldSchema?.labelId) {
    label = intl.formatMessage({ id: fieldSchema.labelId });
  } else {
    label = get(fieldSchema, 'label', undefined);
  }
  if (fieldSchema?.required && !noAsterisk) label = `${label}*`;
  return label;
}
