import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import ResponsiveText from './ResponsiveText';

const Core = function(props) {
  const { responsive = false, ...rest } = props;
  if (responsive) return <ResponsiveText {...rest} />;
  return <Typography {...rest} />;
};

export default function Text({
  id,
  values,
  domId,
  children,
  ...rest
}) {
  if (!id)
    return (
      <Core id={domId} {...rest}>
        {children}
      </Core>
    );
  return (
    <Core id={domId} {...rest}>
      <FormattedMessage id={id} values={values} />
    </Core>
  );
}
