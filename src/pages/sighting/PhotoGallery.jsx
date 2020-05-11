import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import MatchIcon from '@material-ui/icons/AssignmentInd';
import AvatarGallery from '../../components/AvatarGallery';
import AnnotationEditor from '../../components/AnnotationEditor';

export default function PhotoGallery({ sighting }) {
  const [activeAnnotation, setAnnotation] = useState(null);
  const [
    createAnnotationSource,
    setCreateAnnotationSource,
  ] = useState(null);
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
      {Boolean(activeAnnotation) && (
        <AnnotationEditor
          annotations={[activeAnnotation]}
          imgSrc={activeAnnotation.imageSrc}
          onClose={() => setAnnotation(null)}
          onChange={() => setAnnotation(null)}
        />
      )}
      {Boolean(createAnnotationSource) && (
        <AnnotationEditor
          disableDelete
          titleId="CREATE_ANNOTATION"
          imgSrc={createAnnotationSource}
          onClose={() => setCreateAnnotationSource(null)}
          onChange={() => setCreateAnnotationSource(null)}
        />
      )}
      <AvatarGallery
        avatarSize={240}
        entities={photos}
        square
        linkAll={false}
        getHref={() => null}
        filterKey="name"
        titleKey="name"
        justify="flex-start"
        renderDetails={photo => {
          const annotationCount = photo.annotations.length;
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {annotationCount === 0 && (
                <Typography>
                  <FormattedMessage
                    id="X_ANNOTATIONS"
                    values={{ annotationCount }}
                  />
                </Typography>
              )}
              {photo.annotations.map((annotation, i) => {
                return (
                  <div
                    key={annotation.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>
                      <FormattedMessage
                        id="ANNOTATION_X"
                        values={{ x: i + 1 }}
                      />
                    </Typography>
                    <div>
                      <IconButton onClick={() => {}} size="small">
                        <MatchIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setAnnotation({
                            ...annotation,
                            imageSrc: photo.profile,
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
              <Button
                onClick={() => {
                  setCreateAnnotationSource(photo.profile);
                }}
                size="small"
                variant="outlined"
              >
                <FormattedMessage id="NEW_ANNOTATION" />
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
