import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import { selectIndividuals } from '../../modules/individuals/selectors';

export default function Individual() {
  const { id } = useParams();

  // fetch data for Id...
  const individuals = useSelector(selectIndividuals);

  const individual = individuals[id];
  console.log(individual);
  if (!individual)
    return <NotFoundPage subtitle="Individual not found" />;
  return (
    <MainColumn>
      <EntityHeader
        name={individual.name}
        imgSrc={individual.profile}
      />
    </MainColumn>
  );
}
