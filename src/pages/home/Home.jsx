import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../modules/users/selectors';
import UserProfile from '../../components/UserProfile';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Actions from './Actions';

export default function Home() {
  const intl = useIntl();
  const users = useSelector(selectUsers);

  useDocumentTitle(intl.formatMessage({ id: 'HOME' }));

  return (
    <UserProfile userData={users.bob}>
      <Actions />
    </UserProfile>
  );
}
