import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import AvatarGallery from '../../components/AvatarGallery';
import Button from '../../components/Button';

export default function IndividualsGallery({ sighting }) {
  const individuals = sighting.encounters.map(encounter => ({
    ...encounter.individual,
    encounter,
  }));

  return (
    <div style={{ marginTop: 12 }}>
      <AvatarGallery
        entities={individuals}
        avatarSize={240}
        square
        linkAll={false}
        getHref={individual => `/individuals/${individual.id}`}
        filterKey="id"
        titleKey="id"
        justify="flex-start"
        renderDetails={individual => {
          const imageCount = get(
            individual,
            'encounter.images.length',
            0,
          );
          return (
            <div>
              <Typography>
                <FormattedMessage
                  id="X_PHOTOS"
                  values={{ imageCount }}
                />
              </Typography>
              <Typography>
                <FormattedMessage
                  id="SEX_IS"
                  values={{ sex: individual.sex }}
                />
              </Typography>
              <Button
                size="small"
                display="panel"
                style={{ marginTop: 4 }}
              >
                Edit Metadata
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
