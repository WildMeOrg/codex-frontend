import React from 'react';
import { useLocation } from 'react-router';

import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import usePatchIndividual from '../../models/individual/usePatchIndividual';
import EncounterCard from '../../components/cards/EncounterCard';
import IndividualCard from '../../components/cards/IndividualCard';

export default function AssignEncounters() {
  const { search } = useLocation();
  useDocumentTitle('ASSIGN_ANNOTATIONS_TO_INDIVIDUAL');

  const searchParams = new URLSearchParams(search);
  const encounterGuids = searchParams.getAll('e') || [];
  const individualIds = searchParams.getAll('i') || [];

  const {
    mutate: patchIndividual,
    loading,
    error,
  } = usePatchIndividual();

  async function assignEncountersToIndividual() {
    await patchIndividual({});
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
          <Text variant="h4" id="ASSIGN_ANNOTATIONS_TO_INDIVIDUAL" />
        </Grid>
        <Grid item>
          <IndividualCard individualGuid={individualIds?.[0]} />
        </Grid>
        <Grid item>
          {encounterGuids.map(encounterGuid => (
            <EncounterCard
              key={encounterGuid}
              encounterGuid={encounterGuid}
            />
          ))}
        </Grid>
        <Grid item style={{ marginTop: 16 }}>
          {error && (
            <Alert
              titleId="SERVER_ERROR"
              style={{ marginTop: 12, marginBottom: 12 }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          <Button
            display="primary"
            id="ASSIGN_ANNOTATIONS"
            loading={loading}
            onClick={assignEncountersToIndividual}
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
