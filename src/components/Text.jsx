import React, { forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import ResponsiveText from './ResponsiveText';

function Core(props, ref) {
  const { responsive = false, ...rest } = props;
  if (responsive) return <ResponsiveText ref={ref} {...rest} />;
  return <Typography ref={ref} {...rest} />;
}

const CoreForwardRef = forwardRef(Core);

function Text({ id, values, domId, children, ...rest }, ref) {
  if (!id)
    return (
      <CoreForwardRef id={domId} ref={ref} {...rest}>
        {children}
      </CoreForwardRef>
    );
  return (
    <CoreForwardRef id={domId} ref={ref} {...rest}>
      <FormattedMessage id={id} values={values} defaultMessage={id}/>
    </CoreForwardRef>
  );
}

export default forwardRef(Text);
