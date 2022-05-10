import React from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import useAssignEncountersToIndividual from '../../models/individual/useAssignEncountersToIndividual';
import EncounterCard from '../../components/cards/EncounterCard';
import IndividualCard from '../../components/cards/IndividualCard';

export default function AssignEncounters() {
  const history = useHistory();
  const { search } = useLocation();
  useDocumentTitle('ASSIGN_ANNOTATIONS_TO_INDIVIDUAL');

  const searchParams = new URLSearchParams(search);
  const encounterGuids = searchParams.getAll('e') || [];
  const individualGuids = searchParams.getAll('i') || [];
  const individualGuid = individualGuids?.[0];

  const {
    mutate: assignEncountersToIndividual,
    loading,
    error,
  } = useAssignEncountersToIndividual();

  async function handleClick() {
    const result = await assignEncountersToIndividual({
      individualGuid,
      encounterGuids,
    });
    const successful = result?.status === 200;
    if (successful) {
      history.push(`/individuals/${individualGuid}`);
    }
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
          <Text>
            <Text
              variant="subtitle2"
              id="ASSIGN_ANNOTATIONS_TO_INDIVIDUAL_INSTRUCTIONS"
            />
          </Text>
        </Grid>
        <Grid item>
          <Text variant="h5" id="INDIVIDUAL" />
        </Grid>
        <Grid item>
          <IndividualCard individualGuid={individualGuid} />
        </Grid>
        <Grid item>
          <Text variant="h5" id="ANNOTATIONS" />
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
            onClick={handleClick}
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
