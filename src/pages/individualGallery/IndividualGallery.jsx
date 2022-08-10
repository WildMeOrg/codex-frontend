import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { capitalize } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useIndividual from '../../models/individual/useIndividual';
import { deriveIndividualName } from '../../utils/nameUtils';
import errorTypes from '../../constants/errorTypes';
import Button from '../../components/Button';
import Link from '../../components/Link';
import LoadingScreen from '../../components/LoadingScreen';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';

export default function IndividualGallery() {
  const intl = useIntl();
  const theme = useTheme();
  const { guid } = useParams();

  const { data, statusCode, loading, error } = useIndividual(guid);

  const name = deriveIndividualName(
    data,
    'FirstName',
    intl.formatMessage({ id: 'UNNAMED_INDIVIDUAL' }),
  );

  useDocumentTitle('INDIVIDUAL_GALLERY_TITLE', {
    messageValues: { name: capitalize(name) },
    refreshKey: name,
  });

  if (error) {
    return (
      <SadScreen
        statusCode={statusCode}
        variantOverrides={{
          [errorTypes.notFound]: {
            subtitleId: 'INDIVIDUAL_NOT_FOUND',
            descriptionId: 'INDIVIDUAL_NOT_FOUND_DESCRIPTION',
          },
        }}
      />
    );
  }

  if (loading) return <LoadingScreen />;

  return (
    <MainColumn style={{ maxWidth: theme.breakpoints.values.xl }}>
      <Button
        display="back"
        id="INDIVIDUAL_BACK_TO_PROFILE"
        values={{ name }}
        style={{ marginTop: 8 }}
        component={Link}
        to={`/individuals/${guid}`}
        noUnderline
      />
      <Text
        variant="h3"
        style={{ padding: '4px 0 16px 16px' }}
        id="PHOTOS_OF"
        values={{ name }}
      />
    </MainColumn>
  );
}
