import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import BigAvatar from './BigAvatar';
import Link from './Link';

function Details({ entity, titleKey, renderDetails }) {
  return (
    <>
      <Typography
        variant="h6"
        noWrap
        style={{
          marginTop: 12,
          marginBottom: 4,
          lineHeight: 1,
          maxWidth: 250,
        }}
        title={entity[titleKey]}
      >
        {entity[titleKey]}
      </Typography>
      {renderDetails(entity)}
    </>
  );
}

export default function AvatarGallery({
  entities,
  renderDetails,
  getHref,
  linkAll = true,
  avatarSize = 150,
  titleKey = 'name',
  filterKey = 'name',
  getAnnotations = entity => get(entity, 'annotations', undefined),
  justify = 'center',
  square = false,
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  const filteredEntities = entities.filter(entity =>
    entity[filterKey].toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      {entities.length > 6 && (
        <Input
          style={{ margin: '16px 0 20px 16px', width: 260 }}
          placeholder={intl.formatMessage({ id: 'SEARCH' })}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      )}
      {filteredEntities.length === 0 && (
        <Typography style={{ marginLeft: 16 }}>
          <FormattedMessage
            id="FILTER_NO_MATCHES"
            values={{ filter }}
          />
        </Typography>
      )}
      <Grid container spacing={6} justify={justify}>
        {filteredEntities.map(entity => {
          return (
            <Grid key={entity.id} item>
              <Link
                noUnderline
                href={getHref(entity)}
                style={{
                  display: 'flex',
                  alignItems: justify,
                  flexDirection: 'column',
                }}
              >
                <BigAvatar
                  imgSrc={entity.profile}
                  name={entity[titleKey]}
                  square={square}
                  size={avatarSize}
                  annotations={getAnnotations(entity)}
                />
                {linkAll && (
                  <Details
                    renderDetails={renderDetails}
                    titleKey={titleKey}
                    entity={entity}
                  />
                )}
              </Link>
              {!linkAll && (
                <Details
                  renderDetails={renderDetails}
                  titleKey={titleKey}
                  entity={entity}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
