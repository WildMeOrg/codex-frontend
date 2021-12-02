import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';

import nature from '../assets/nature.jpg';
import ocean from '../assets/ocean.jpeg';
import savanna from '../assets/savanna.jpeg';
import Link from './Link';
import Text from './Text';

const variantMap = {
  genericError: {
    photo: nature,
    photoUrl: 'https://unsplash.com/photos/-f0YLss50Bs',
    artistName: 'Kunal Shinde',
    artistUrl: 'https://unsplash.com/@editholic7',
    subtitleId: 'AN_ERROR_OCCURRED',
    descriptionId: 'UNKNOWN_ERROR_DESCRIPTION',
  },
  serverError: {
    photo: nature,
    photoUrl: 'https://unsplash.com/photos/-f0YLss50Bs',
    artistName: 'Kunal Shinde',
    artistUrl: 'https://unsplash.com/@editholic7',
    subtitle: 'Server unavailable',
    description:
      'The server could not be reached. Unfortunately, normal site functionality is currently unavailable. Check back at a later date or try refreshing the page.',
  },
  notFoundOcean: {
    photo: ocean,
    photoUrl: 'https://unsplash.com/photos/k0Ynnf2CbKw',
    artistName: 'Pierre Leverrier',
    artistUrl: 'https://unsplash.com/@pierre_leverrier',
    title: '404',
    subtitleId: 'PAGE_NOT_FOUND',
    descriptionId: '404_DETAILS',
  },
  notFoundSavanna: {
    photo: savanna,
    photoUrl: 'https://unsplash.com/photos/92MgFhlWD-8',
    artistName: 'David Clode',
    artistUrl: 'https://unsplash.com/@davidclode',
    title: '404',
    subtitleId: 'PAGE_NOT_FOUND',
    descriptionId: '404_DETAILS',
  },
};

export default function SadScreen(props) {
  const { variant } = props;
  const theme = useTheme();

  const screenMetadata = variantMap[variant];

  function getProperty(property) {
    const propertyFromProps = get(props, property);
    return propertyFromProps || get(screenMetadata, property);
  }

  function renderTranslatableText(propertyKey) {
    const translatePropertyKey = `${propertyKey}Id`;
    const translateProperty = getProperty(translatePropertyKey);
    return translateProperty ? (
      <FormattedMessage id={translateProperty} />
    ) : (
      getProperty(propertyKey)
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${getProperty('photo')})`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Paper
          style={{
            margin: '100px 20px 0 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#ffffffc2',
            padding: 20,
          }}
        >
          <Text variant="h2" component="h2">
            {renderTranslatableText('title')}
          </Text>
          <Text variant="h4">
            {renderTranslatableText('subtitle')}
          </Text>
          <Text style={{ maxWidth: 400, marginTop: 16 }}>
            {renderTranslatableText('description')}
          </Text>
        </Paper>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          color: theme.palette.common.white,
        }}
      >
        <Text>
          {'Photo by '}
          <Link external href={getProperty('artistUrl')}>
            {getProperty('artistName')}
          </Link>
          {' on '}
          <Link external href={getProperty('photoUrl')}>
            Unsplash
          </Link>
        </Text>
      </div>
    </div>
  );
}
