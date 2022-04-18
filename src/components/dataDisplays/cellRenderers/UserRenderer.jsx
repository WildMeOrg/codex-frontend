import React, { forwardRef } from 'react';
import { get } from 'lodash-es';

import Link from '../../Link';
import OverflowController from './OverflowController';

function Core({ value, guid, ...rest }, ref) {
  return (
    <Link href={`/users/${guid}`} ref={ref} {...rest}>
      {value}
    </Link>
  );
}

const CoreForwardRef = forwardRef(Core);

export default function UserRenderer({
  datum,
  guidProperty = 'owner.guid',
  nameProperty = 'owner.full_name',
  fallbackName = 'Unnamed User',
  noWrap = false,
}) {
  const userGuid = get(datum, guidProperty);
  const userName = get(datum, nameProperty, fallbackName);

  const coreComponent = (
    <CoreForwardRef value={userName} guid={userGuid} />
  );

  return noWrap ? (
    <OverflowController title={userName}>
      {coreComponent}
    </OverflowController>
  ) : (
    coreComponent
  );
}
