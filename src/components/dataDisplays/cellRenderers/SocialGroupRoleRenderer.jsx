import React, { forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import useSiteSettings from '../../../models/site/useSiteSettings';
import Text from '../../Text';
import OverflowController from './OverflowController';

function Core({ value, ...rest }, ref) {
  return (
    <Text variant="body2" ref={ref} {...rest}>
      {value}
    </Text>
  );
}

const CoreForwardRef = forwardRef(Core);

export default function SocialGroupRoleRenderer({
  value,
  noWrap = false,
  ...rest
}) {
  const intl = useIntl();

  const { data } = useSiteSettings();
  const roles = get(data, ['social_group_roles', 'value'], []);
  const matchingRole = roles.find(role => role?.guid === value);
  const knownRole = value && matchingRole?.label;
  const label =
    knownRole || intl.formatMessage({ id: 'UNKNOWN_ROLE' });

  const CoreComponent = <CoreForwardRef value={label} {...rest} />;

  return noWrap ? (
    <OverflowController title={label}>
      {CoreComponent}
    </OverflowController>
  ) : (
    CoreComponent
  );
}
