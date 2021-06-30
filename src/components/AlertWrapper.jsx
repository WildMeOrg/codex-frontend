import React from 'react';
import { FormattedMessage } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
// import ResponsiveText from './ResponsiveText';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Text from './Text';

export default function AlertWrapper({
  description = '',
  titleTxt,
  values,
  children,
  ...rest
}) {
  if (!titleTxt) {
    return (
      <Alert {...rest}>
        <FormattedMessage id={description} values={values} />
        {children}
      </Alert>
    );
  }
  return (
    <Alert {...rest}>
      <AlertTitle>
        <Text id={titleTxt} />
      </AlertTitle>
      <FormattedMessage id={description} values={values} />
      {children}
    </Alert>
  );
}
