import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

export default function useDescription(fieldSchema) {
  const intl = useIntl();
  if (fieldSchema.descriptionId)
    return intl.formatMessage({ id: fieldSchema.descriptionId });
  return get(fieldSchema, 'description', '');
}
