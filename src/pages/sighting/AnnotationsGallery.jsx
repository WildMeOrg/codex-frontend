import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AnnotationEditor from '../../components/AnnotationEditor';
import AvatarGallery from '../../components/AvatarGallery';
import Button from '../../components/Button';

export default function IndividualsGallery({ sighting }) {
  const [activeAnnotation, setAnnotation] = useState(null);

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
      {Boolean(activeAnnotation) && (
        <AnnotationEditor
          annotations={[activeAnnotation]}
          imgSrc={
            activeAnnotation ? activeAnnotation.imageSrc : undefined
          }
          onClose={() => setAnnotation(null)}
          onChange={() => setAnnotation(null)}
        />
      )}
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
                display="primary"
                style={{ marginTop: 6 }}
              >
                <FormattedMessage id="MATCH_ANNOTATION" />
              </Button>
              <Button
                size="small"
                display="basic"
                style={{ marginTop: 4 }}
                onClick={() =>
                  setAnnotation({
                    ...annotation,
                    imageSrc: annotation.profile,
                  })
                }
              >
                <FormattedMessage id="EDIT_ANNOTATION" />
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
