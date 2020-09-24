import React from 'react';
import ButtonLink from '../../../components/ButtonLink';
import { getFeature } from './utils';

const actions = {
  merge: {
    title: 'Merge',
    buildUrl: (individualId1, individualId2) =>
      `https://www.flukebook.org/merge.jsp?individualA=${individualId1}&individualB=${individualId2}`,
  },
  addToIndividual: {
    title: 'Assign to individual',
    buildUrl: (individualId, encounterId) =>
      `https://www.flukebook.org/IndividualAddEncounter?number=${encounterId}&individual=${individualId}&matchType=Pattern%20match`,
  },
  createIndividual: {
    title: 'Create new individual',
    buildUrl: encounterId =>
      `https://www.flukebook.org/encounters/encounter.jsp?number=${encounterId}`,
  },
};

export default function ActionButton({
  annotation1,
  annotation2,
  ...rest
}) {
  const individualId1 = getFeature(annotation1, 'individualId');
  const individualId2 = getFeature(annotation2, 'individualId');
  const encounterId1 = getFeature(annotation1, 'encounterId');
  const encounterId2 = getFeature(annotation2, 'encounterId');

  let title = null;
  let url = null;
  if (individualId1 && individualId2) {
    title = actions.merge.title;
    url = actions.merge.buildUrl(individualId1, individualId2);
  } else if (individualId1) {
    title = actions.addToIndividual.title;
    url = actions.merge.buildUrl(individualId1, encounterId2);
  } else if (individualId2) {
    title = actions.addToIndividual.title;
    url = actions.merge.buildUrl(individualId2, encounterId1);
  } else {
    title = actions.createIndividual.title;
    url = actions.createIndividual.buildUrl(encounterId1);
  }

  return (
    <ButtonLink
      external
      newTab
      display="primary"
      href={url}
      {...rest}
    >
      {title}
    </ButtonLink>
  );
}
