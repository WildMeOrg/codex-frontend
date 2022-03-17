import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import Button from '../../components/Button';
import useIndividual from '../../models/individual/useIndividual';
import useMergeIndividuals from '../../models/individual/useMergeIndividuals';
import useGetMergeConflicts from '../../models/individual/useGetMergeConflicts';
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

  const { data: mergeConflicts } = useGetMergeConflicts(
    individualIds,
  );
  const { data: targetIndividualData } = useIndividual(
    get(individualIds, '0', null),
  );
  const { data: fromIndividualData } = useIndividual(
    get(individualIds, '1', null),
  );
  const individualData = [targetIndividualData, fromIndividualData];

  const { mutate: mergeIndividuals, loading } = useMergeIndividuals();

  const [formData, setFormData] = useState({});

  const showSexInput = Boolean(mergeConflicts?.sex);
  const nameContexts = mergeConflicts?.name_contexts || [];
  const showDefaultNameInput = nameContexts.includes('defaultName');
  const showNicknameInput = nameContexts.includes('Nickname');
  const showResolveFields =
    showSexInput || showDefaultNameInput || showNicknameInput;

  const formComplete = isFormComplete(
    formData,
    showSexInput,
    showDefaultNameInput,
    showNicknameInput,
  );

  console.log(targetIndividualData);

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
            {showDefaultNameInput && (
              <ResolutionSelector
                value={formData?.defaultName}
                onChange={newDefaultName =>
                  setFormData({
                    ...formData,
                    defaultName: newDefaultName,
                  })
                }
                fieldType="defaultName"
                individualData={individualData}
              />
            )}
            {showNicknameInput && (
              <ResolutionSelector
                value={formData?.nickname}
                onChange={newNickname =>
                  setFormData({ ...formData, nickname: newNickname })
                }
                fieldType="nickname"
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
          <Button
            display="primary"
            id="MERGE_INDIVIDUALS"
            loading={loading}
            disabled={loading || !formComplete}
            onClick={() => {
              const propertyOverrides = derivePropertyOverrides(
                formData,
                showSexInput,
                showDefaultNameInput,
                showNicknameInput,
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
