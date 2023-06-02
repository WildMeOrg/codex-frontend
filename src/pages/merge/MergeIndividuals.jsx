import React, { useState } from 'react';
import { useLocation } from 'react-router';

import Grid from '@material-ui/core/Grid';

import errorTypes from '../../constants/errorTypes';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SadScreen from '../../components/SadScreen';
import Alert from '../../components/Alert';
import IndividualCard from '../../components/cards/IndividualCard';
import useMergeIndividuals from '../../models/individual/useMergeIndividuals';
import useFetchMergeConflicts from '../../models/individual/useFetchMergeConflicts';
import {
  derivePropertyOverrides,
  isFormComplete,
} from './utils/formDataUtils';
import ResolutionSelector from './ResolutionSelector';

export default function MergeIndividuals() {
  const { search } = useLocation();
  useDocumentTitle('MERGE_INDIVIDUALS');

  const searchParams = new URLSearchParams(search);
  const individualGuids = searchParams.getAll('i') || [];

  const { data: mergeConflicts, fetchConflictsError } =
    useFetchMergeConflicts(individualGuids);

  const {
    mutate: mergeIndividuals,
    loading,
    error: mergeError,
  } = useMergeIndividuals();

  const [individuals, setIndividuals] = useState({});

  const [formData, setFormData] = useState({});

  const showSexInput = Boolean(mergeConflicts?.sex);
  const speciesConflict = Boolean(mergeConflicts?.taxonomy_guid);
  const nameContexts = mergeConflicts?.name_contexts || [];
  const showFirstNameInput = nameContexts.includes('FirstName');
  const showAdoptionNameInput = nameContexts.includes('AdoptionName');
  //resolveFields will show up anyway, if every field has no conflicts, 
  //the dropdown will be autopopulated and cannot be adjusted.
  const showResolveFields = true;

  const formComplete = isFormComplete(
    formData,
    showSexInput,
    showFirstNameInput,
    showAdoptionNameInput,    
  );

  if (fetchConflictsError)
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
          {individualGuids.map(individualGuid => (
            <IndividualCard
              key={individualGuid}
              individualGuid={individualGuid}
              showSex={mergeConflicts?.sex}
              setIndividualData={individualData =>
                setIndividuals({
                  ...individuals,
                  [individualGuid]: individualData,
                })
              }
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
                individualData={individuals}
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
                individualData={individuals}
              />
            )}
            {showSexInput && (
              <ResolutionSelector
                value={formData?.sex}
                onChange={newSex =>
                  setFormData({ ...formData, sex: newSex })
                }
                fieldType="sex"
                individualData={individuals}
              />
            )}            
            {
            //taxonomy_guid is a required field, so it will always show up
            (<ResolutionSelector
                value={formData?.taxonomy_guid}
                onChange={newSpecies => {
                  setFormData({ ...formData, taxonomy_guid: newSpecies })
                  }                  
                }
                fieldType="taxonomy"
                individualData={individuals}
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
                targetIndividualGuid: individualGuids?.[0],
                fromIndividualGuids: [individualGuids?.[1]],
                propertyOverrides,
              });                
            }}
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
