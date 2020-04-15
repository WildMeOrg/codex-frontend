import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import BigAvatar from './BigAvatar';
import Link from './Link';

export default function AvatarGallery({
  entities,
  renderDetails,
  getHref,
  square = false,
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  const filteredEntities = entities.filter(org =>
    org.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
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
      {filteredEntities.length === 0 && (
        <Typography style={{ marginLeft: 16 }}>
          <FormattedMessage
            id="FILTER_NO_MATCHES"
            values={{ filter }}
          />
        </Typography>
      )}
      <Grid container spacing={6} justify="center">
        {filteredEntities.map((entity, i) => {
          return (
            <Grid
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              item
            >
              <BigAvatar
                imgSrc={entity.profile}
                name={entity.name}
                square={square}
              />
              <Link href={getHref(entity)}>
                <Typography
                  variant="h6"
                  noWrap
                  style={{
                    marginTop: 12,
                    lineHeight: 1,
                    maxWidth: 250,
                  }}
                  title={entity.name}
                >
                  {entity.name}
                </Typography>
              </Link>
              {renderDetails(entity)}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
