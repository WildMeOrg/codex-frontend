import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AvatarGallery from '../../components/AvatarGallery';

export default function IndividualsGallery({ sighting }) {
  const photos = sighting.encounters.reduce((memo, encounter) => {
    const newPhotos = encounter.images.map(image => {
      const matchingAnnotations = encounter.annotations.filter(
        annotation => annotation.imageId === image.id,
      );
      return {
        ...image,
        annotations: matchingAnnotations,
        profile: image.url,
        name: image.metadata.filename,
      };
    });
    return [...memo, ...newPhotos];
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      <AvatarGallery
        avatarSize={240}
        entities={photos}
        square
        getHref={() => null}
        filterKey="name"
        titleKey="name"
        justify="flex-start"
        renderDetails={photo => {
          const annotationCount = photo.annotations.length;
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>
                <FormattedMessage
                  id="X_ANNOTATIONS"
                  values={{ annotationCount }}
                />
              </Typography>
              <Button size="small" variant="outlined">
                New Annotation
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
