import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AvatarGallery from '../../components/AvatarGallery';

export default function IndividualsGallery({ sighting }) {
  const annotations = sighting.encounters.reduce(
    (memo, encounter) => {
      const newAnnotations = encounter.annotations.map(annotation => {
        const matchingImage = encounter.images.find(
          img => img.id === annotation.imageId,
        );
        return { ...annotation, profile: matchingImage.url };
      });
      return [...memo, ...newAnnotations];
    },
    [],
  );

  return (
    <div style={{ marginTop: 12 }}>
      <AvatarGallery
        getAnnotations={annotation => [annotation]}
        entities={annotations}
        avatarSize={240}
        square
        linkAll={false}
        getHref={() => null}
        filterKey="id"
        titleKey="id"
        justify="flex-start"
        renderDetails={annotation => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                size="small"
                variant="outlined"
                style={{ marginTop: 12 }}
              >
                <FormattedMessage id="EDIT_ANNOTATION" />
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                style={{ marginTop: 6 }}
              >
                <FormattedMessage id="MATCH_ANNOTATION" />
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
