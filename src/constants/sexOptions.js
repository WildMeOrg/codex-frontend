import { useIntl } from 'react-intl';

const intl = useIntl();

export default [
  {
    value: 'male',
    label: intl.formatMessage({ id: 'MALE' }),
  },
  {
    value: 'female',
    label: intl.formatMessage({ id: 'FEMALE' }),
  },
  {
    value: 'unknown',
    label: intl.formatMessage({ id: 'UNKNOWN' }),
  },
  {
    value: null,
    label: intl.formatMessage({ id: 'VALUE_NOT_SET' }),
    mergeLabelId: 'VALUE_NOT_SET',
    filterLabelId: 'VALUE_NOT_SET',
  },
];
