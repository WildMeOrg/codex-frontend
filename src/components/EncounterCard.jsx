import React from 'react';
import { FormattedMessage } from 'react-intl';
import { format } from 'date-fns';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Link from './Link';
import Text from './Text';

export default function EncounterCard({ encounter, hideSubmitted }) {
  const {
    user,
    profile,
    photoCount,
    submissionDate,
    status,
  } = encounter;
  return (
    <Card style={{ width: 240 }} elevation={0}>
      <CardActionArea>
        <CardMedia
          style={{ height: 160, width: 240 }}
          image={profile}
          title="Encounter photo"
        >
          {status === 'ready-for-review' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                color: 'white',
                backgroundColor: 'rgba(255, 60, 60, 0.88)',
                width: '100%',
                height: 40,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 10,
                }}
                id="READY_FOR_REVIEW" />
            </div>
          )}
        </CardMedia>
        <CardContent>
          <Text variant="subtitle2">
            {encounter.individualId}
          </Text>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Text
                variant="body2"
                color="textSecondary"
                component="p"
                id="PHOTO_COUNT"
                values={{ photoCount: parseInt(photoCount, 10) }}
              />
            </Grid>
            <Grid item>
              <Text
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {format(submissionDate, 'M/dd/yy')}
              </Text>
            </Grid>
            {!hideSubmitted && (
              <Text variant="caption">
                <FormattedMessage id="SUBMITTED_BY" />
                <Link href={`/users/${user}`}>{user}</Link>
              </Text>
            )}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
