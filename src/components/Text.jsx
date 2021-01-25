import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import ResponsiveText from './ResponsiveText';

function Core(props) {
  const { responsive = false, ...rest } = props;
  if (responsive) return <ResponsiveText {...rest} />;
  return <Typography {...rest} />;
}

export default function Text({ id, values, ...rest }) {
  if (!id) return <Core {...rest} />;
  return (
    <Core {...rest}>
      <FormattedMessage id={id} values={values} />
    </Core>
  );
}
