import React, { forwardRef } from 'react';
import { get } from 'lodash-es';
import Link from '../../Link';

function UserRenderer(
  {
    datum,
    guidProperty = 'owner.guid',
    nameProperty = 'owner.full_name',
    fallbackName = 'Unnamed User',
  },
  ref,
) {
  const userGuid = get(datum, guidProperty);
  const userName = get(datum, nameProperty, fallbackName);
  return (
    <Link href={`/users/${userGuid}`} ref={ref}>
      {userName}
    </Link>
  );
}

export default forwardRef(UserRenderer);
