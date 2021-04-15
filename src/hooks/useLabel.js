import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

export default function useLabel(fieldSchema) {
  const intl = useIntl();
  let label = null;
  if (fieldSchema.labelId) {
    label = intl.formatMessage({ id: fieldSchema.labelId });
  } else {
    label = get(fieldSchema, 'label', undefined);
  }
  if (fieldSchema.required) label = `${label} *`;
  return label;
}
