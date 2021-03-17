import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { capitalize, toLower } from 'lodash-es';
import { selectUsers } from '../../modules/users/selectors';
// import useGetUser from '../../models/users/useGetUser';
import UserProfile from '../../components/UserProfile';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User({ userId }) {
  const { id } = useParams();
  const displayedUserId = userId || id;
  useDocumentTitle(capitalize(displayedUserId));
  const users = useSelector(selectUsers);

  // const { data, loading, error } = useGetUser(id);
  // console.log(data, loading, error);

  return <UserProfile userData={users[toLower(displayedUserId)]} />;
}
