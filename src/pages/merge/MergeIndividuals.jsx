import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import errorTypes from '../../constants/errorTypes';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SadScreen from '../../components/SadScreen';
import Alert from '../../components/Alert';
import useIndividual from '../../models/individual/useIndividual';
import useMergeIndividuals from '../../models/individual/useMergeIndividuals';
import useFetchMergeConflicts from '../../models/individual/useFetchMergeConflicts';
import {
  derivePropertyOverrides,
  isFormComplete,
} from './utils/formDataUtils';
import ResolutionSelector from './ResolutionSelector';
import IndividualCard from './IndividualCard';

export default function MergeIndividuals() {
  const { search } = useLocation();
  useDocumentTitle('MERGE_INDIVIDUALS');

  const searchParams = new URLSearchParams(search);
  const individualIds = searchParams.getAll('i') || [];

  const {
    data: mergeConflicts,
    fetchConflictsError,
  } = useFetchMergeConflicts(individualIds);
  const {
    data: targetIndividualData,
    error: fetchTargetError,
  } = useIndividual(get(individualIds, '0', null));
  const {
    data: fromIndividualData,
    error: fetchFromError,
  } = useIndividual(get(individualIds, '1', null));
  const individualData = [targetIndividualData, fromIndividualData];

  const {
    mutate: mergeIndividuals,
    loading,
    error: mergeError,
  } = useMergeIndividuals();

  const [formData, setFormData] = useState({});

  const fetchError =
    fetchConflictsError || fetchTargetError || fetchFromError;

  const showSexInput = Boolean(mergeConflicts?.sex);
  const nameContexts = mergeConflicts?.name_contexts || [];
  const showFirstNameInput = nameContexts.includes('FirstName');
  const showAdoptionNameInput = nameContexts.includes('AdoptionName');
  const showResolveFields =
    showSexInput || showFirstNameInput || showAdoptionNameInput;

  const formComplete = isFormComplete(
    formData,
    showSexInput,
    showFirstNameInput,
    showAdoptionNameInput,
  );

  if (fetchError)
    return (
      <SadScreen
        variant={errorTypes.genericError}
        subtitleId="DATA_UNAVAILABLE"
      />
    );

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
          <Text variant="h4" id="MERGE_INDIVIDUALS" />
        </Grid>
        <Grid item>
          {individualData.map((individual, i) => (
            <IndividualCard
              key={individual?.guid || i}
              data={individual}
              mergeConflicts={mergeConflicts}
            />
          ))}
        </Grid>
        {showResolveFields && (
          <Grid
            item
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Text variant="h5" id="RESOLVE_FIELDS" />
            {showFirstNameInput && (
              <ResolutionSelector
                value={formData?.firstName}
                onChange={newFirstName =>
                  setFormData({
                    ...formData,
                    firstName: newFirstName,
                  })
                }
                fieldType="firstName"
                individualData={individualData}
              />
            )}
            {showAdoptionNameInput && (
              <ResolutionSelector
                value={formData?.adoptionName}
                onChange={newAdoptionName =>
                  setFormData({
                    ...formData,
                    adoptionName: newAdoptionName,
                  })
                }
                fieldType="adoptionName"
                individualData={individualData}
              />
            )}
            {showSexInput && (
              <ResolutionSelector
                value={formData?.sex}
                onChange={newSex =>
                  setFormData({ ...formData, sex: newSex })
                }
                fieldType="sex"
                individualData={individualData}
              />
            )}
          </Grid>
        )}
        <Grid item style={{ marginTop: 16 }}>
          {mergeError && (
            <Alert
              titleId="SERVER_ERROR"
              style={{ marginTop: 12, marginBottom: 12 }}
              severity="error"
            >
              {mergeError}
            </Alert>
          )}
          <Button
            display="primary"
            id="MERGE_INDIVIDUALS"
            loading={loading}
            disabled={loading || !formComplete}
            onClick={() => {
              const propertyOverrides = derivePropertyOverrides(
                formData,
                showSexInput,
                showFirstNameInput,
                showAdoptionNameInput,
              );

              mergeIndividuals({
                targetIndividualGuid: targetIndividualData?.guid,
                fromIndividualGuids: [fromIndividualData?.guid],
                propertyOverrides,
              });
            }}
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
