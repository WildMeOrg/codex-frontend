import React from 'react';
import { get } from 'lodash-es';
import AddIcon from '@material-ui/icons/Add';

import CardContainer from '../../../components/cards/CardContainer';
import MetadataCard from '../../../components/cards/MetadataCardNew';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import ButtonMenu from '../../../components/ButtonMenu';
import MoreMenu from '../../../components/MoreMenu';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import AnnotationsCard from './AnnotationsCard';

export default function Encounters({ sightingData }) {
  const encounterFieldSchemas = useEncounterFieldSchemas();
  const encounters = get(sightingData, 'encounters', []);
  return (
    <div>
      {encounters.map((encounter, i) => {
        const encounterMetadata = encounterFieldSchemas.map(
          schema => ({
            ...schema,
            value: schema.getValue(schema, encounter),
          }),
        );
        return (
          <div key={encounter.id}>
            <div
              style={{
                margin: '0 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                id="ANIMAL_CLUSTER_LABEL"
                variant="h6"
                values={{ i: i + 1 }}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ButtonMenu
                  display="primary"
                  size="small"
                  buttonId="identify-animal-cluster"
                  id="IDENTIFY"
                  actions={[
                    {
                      id: 'start-id',
                      label: 'Kickoff identification',
                      onClick: Function.prototype,
                    },
                    {
                      id: 'identify-manually',
                      label: 'Manually assign',
                      onClick: Function.prototype,
                    },
                  ]}
                />
                <MoreMenu
                  menuId="cluster-actions"
                  items={[
                    {
                      id: 'view-history',
                      onClick: () => {},
                      label: 'View history',
                    },
                    {
                      id: 'create-new-individual',
                      label: 'Create new individual',
                      onClick: Function.prototype,
                    },
                    {
                      id: 'delete-cluster',
                      onClick: () => {},
                      label: 'Delete cluster',
                    },
                  ]}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <CardContainer>
                <AnnotationsCard annotations={[]} />
              </CardContainer>
              <CardContainer size="small">
                <MetadataCard metadata={encounterMetadata} />
              </CardContainer>
            </div>
          </div>
        );
      })}
      <Button
        id="ADD_CLUSTER"
        startIcon={<AddIcon />}
        style={{ margin: '12px 0px 20px 20px' }}
      />
    </div>
  );
}
