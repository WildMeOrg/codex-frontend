import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function Status({ onMarkComplete }) {
  const theme = useTheme();

  const photos = [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const finishedPhotoCount = photos.filter(p => p).length;

  return (
    <Grid
      container
      style={{
        width: '100%',
        padding: 20,
        margin: '20px auto',
        maxWidth: '95vw',
        border: `5px double ${theme.palette.secondary.main}`,
      }}
      alignItems="center"
      justify="center"
      direction="column"
      spacing={1}
    >
      <Grid item>
        <Typography variant="h5">
          <FormattedMessage id="IDENTIFYING_INDIVIDUALS" />
        </Typography>
      </Grid>
      <Grid item>
        <Text
          style={{
            textAlign: 'center',
            maxWidth: 500,
            margin: '0 auto',
          }}
          id="IDENTIFYING_INDIVIDUALS_DESCRIPTION" />
      </Grid>
      <Grid
        item
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          margin: '12px 0 20px 0',
        }}
      >
        <Text
          variant="subtitle1"
          style={{ width: '50%', textAlign: 'right', marginRight: 4 }}
          id="PHOTOS_READY_COUNT"
          values={{
            finished: finishedPhotoCount,
            total: photos.length,
          }}
        />
        <Grid
          container
          spacing={1}
          style={{ width: '50%', marginLeft: 4 }}
        >
          {photos.map((photo, i) => (
            <Grid item key={i}>
              <Tooltip
                title={`img215.jpg - ${
                  photo ? 'Complete' : '14th in detection queue'
                }`}
              >
                <div
                  style={{
                    height: 16,
                    width: 16,
                    backgroundColor: photo
                      ? theme.palette.secondary.main
                      : '#ccc',
                  }}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
        <ButtonLink href="/match/S-101" display="primary">
          <FormattedMessage id="MATCH_ANNOTATIONS" />
        </ButtonLink>
        <Button
          display="panel"
          style={{ marginTop: 12 }}
          onClick={onMarkComplete}
        >
          <FormattedMessage id="MARK_SIGHTING_COMPLETE" />
        </Button>
      </Grid>
    </Grid>
  );
}
