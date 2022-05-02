import React, { useMemo } from 'react';
import { get, pickBy } from 'lodash-es';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';

import errorTypes, { errorSchemas } from '../constants/errorTypes';
import Link from './Link';
import Text from './Text';

export default function SadScreen({
  statusCode,
  variant,
  variantOverrides,
  ...rest
})
{
  const theme = useTheme();

  const errorSchema = useMemo(
    () =>
    {
      let displayVariant = variant || errorTypes.genericError;
      if (statusCode === 404) displayVariant = errorTypes.notFound;
      if (statusCode === 403)
        displayVariant = errorTypes.noPermissions;
      if (statusCode === 401)
        displayVariant = errorTypes.notAuthenticated;
      const propOverrides = pickBy(rest, prop => prop !== undefined);
      const variantSpecificOverrides = get(variantOverrides, displayVariant, {});
      return {
        ...errorSchemas[displayVariant],
        ...propOverrides,
        ...variantSpecificOverrides,
      };
    },
    [statusCode, variant],
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${errorSchema.photo})`,
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
          <Text variant="h2" component="h2" id={errorSchema.titleId}>
            {errorSchema.title}
          </Text>
          <Text variant="h4" id={errorSchema.subtitleId}>
            {errorSchema.subtitle}
          </Text>
          <Text style={{ maxWidth: 400, marginTop: 16 }} id={errorSchema.descriptionId}>
            {errorSchema.description}
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
          <Link external href={errorSchema.artistUrl}>
            {errorSchema.artistName}
          </Link>
          {' on '}
          <Link external href={errorSchema.photoUrl}>
            Unsplash
          </Link>
        </Text>
      </div>
    </div>
  );
}
