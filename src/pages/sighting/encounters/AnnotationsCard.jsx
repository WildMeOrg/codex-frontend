import React from 'react';
// import Skeleton from '@material-ui/lab/Skeleton';
import Text from '../../../components/Text';
import Card from '../../../components/cards/Card';

export default function AnnotationsCard({
  title,
  titleId = 'ANNOTATIONS',
  annotations,
}) {
  const loading = !annotations;
  return (
    <Card title={title} titleId={titleId}>
      {annotations.length > 0 ? (
        annotations.map(annotation => <div>{annotation.id}</div>)
      ) : (
        <Text
          style={{ marginTop: 4 }}
          id="CLUSTER_NO_ANNOTATIONS"
          variant="body2"
        />
      )}
      {loading ? <Text>loading</Text> : null}
    </Card>
  );
}
