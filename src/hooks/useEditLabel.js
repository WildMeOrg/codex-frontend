import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

export default function useEditLabel(fieldSchema, noAsterisk = false) {
  const intl = useIntl();
  let label = null;
  if (fieldSchema?.editLabelId) {
    label = intl.formatMessage({ id: fieldSchema.editLabelId });
  } else if(fieldSchema?.labelId){
    label = intl.formatMessage({ id: fieldSchema.labelId });
  }else 
   {
    label = get(fieldSchema, 'label', undefined);
  }
  if (fieldSchema?.required && !noAsterisk) label = `${label}*`;
  return label;
}
