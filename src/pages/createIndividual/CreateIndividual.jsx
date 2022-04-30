import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SadScreen from '../../components/SadScreen';
import Alert from '../../components/Alert';
import useIndividual from '../../models/individual/useIndividual';
import usePostIndividual from '../../models/individual/usePostIndividual';
import EncounterCard from './EncounterCard';

export default function CreateIndividual() {
  const { search } = useLocation();
  useDocumentTitle('CREATE_INDIVIDUAL');

  const searchParams = new URLSearchParams(search);
  const encounterGuids = searchParams.getAll('e') || [];
  console.log(encounterGuids);

  const {
    mutate: createIndividual,
    loading: createIndividualLoading,
    error: createIndividualError,
  } = usePostIndividual();

  // const [formData, setFormData] = useState({});

  // const showSexInput = Boolean(mergeConflicts?.sex);
  // const nameContexts = mergeConflicts?.name_contexts || [];
  // const showFirstNameInput = nameContexts.includes('FirstName');
  // const showAdoptionNameInput = nameContexts.includes('AdoptionName');
  // const showResolveFields =
  //   showSexInput || showFirstNameInput || showAdoptionNameInput;

  // const formComplete = isFormComplete(
  //   formData,
  //   showSexInput,
  //   showFirstNameInput,
  //   showAdoptionNameInput,
  // );

  async function postIndividual() {
    console.log('here we gooo!');
  }

  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1000,
      }}
    >
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ padding: '20px 6vw' }}
      >
        <Grid item>
          <Text variant="h4" id="CREATE_INDIVIDUAL" />
        </Grid>
        <Grid item>
          {encounterGuids.map(encounterGuid => (
            <EncounterCard
              key={encounterGuid}
              encounterGuid={encounterGuid}
            />
          ))}
        </Grid>
        <Grid
          item
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Text variant="h5" id="METADATA" />
          Sup
        </Grid>
        <Grid item style={{ marginTop: 16 }}>
          {createIndividualError && (
            <Alert
              titleId="SERVER_ERROR"
              style={{ marginTop: 12, marginBottom: 12 }}
              severity="error"
            >
              {createIndividualError}
            </Alert>
          )}
          <Button
            display="primary"
            id="CREATE_INDIVIDUAL"
            loading={createIndividualLoading}
            onClick={postIndividual}
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
