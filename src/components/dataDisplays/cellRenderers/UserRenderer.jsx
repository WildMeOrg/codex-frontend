import React from 'react';
import { get } from 'lodash-es';
import Link from '../../Link';

export default function UserRenderer({
  datum,
  guidProperty = 'owner.guid',
  nameProperty = 'owner.full_name',
  fallbackName = 'Unnamed User',
}) {
  const userGuid = get(datum, guidProperty);
  const userName = get(datum, nameProperty, fallbackName);
  return <Link href={`/users/${userGuid}`}>{userName}</Link>;
}
