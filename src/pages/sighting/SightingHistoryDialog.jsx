import React, { useState } from 'react';
import subHours from 'date-fns/subHours';
import format from 'date-fns/format';

import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
// import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import StandardDialog from '../../components/StandardDialog';
// import Link from '../../components/Link';
import Button from '../../components/Button';
import Text from '../../components/Text';

const changesByDay = [
  [
    {
      user: 'jwolf99',
      time: subHours(Date.now(), 2),
      event: 'Changed sex to male',
      data: {
        field: 'sex',
        previousValue: 'female',
        nextValue: 'male',
      },
    },
    {
      user: 'schmitizen',
      time: subHours(Date.now(), 3),
      event: 'Changed sex to female',
      data: {
        field: 'sex',
        previousValue: 'male',
        nextValue: 'female',
      },
    },
    {
      user: 'jwolf99',
      time: subHours(Date.now(), 4),
      event: 'Changed verbatimLocality to "Snark Park"',
      data: {
        field: 'verbatimLocality',
        previousValue: '',
        nextValue: 'Snark Park',
      },
    },
  ],
  [
    {
      user: 'jwolf99',
      time: subHours(Date.now(), 31),
      event: 'Added an annotation',
      data: {
        assetId: 'faowjs-aefawsd-awfwed-fasdfwe',
        x: 12,
        y: 34,
        w: 410,
        h: 231,
      },
    },
  ],
  [
    {
      user: 'sage_bot',
      time: subHours(Date.now(), 80),
      event: 'Detected 9 annotations',
      data: {
        annotationCount: 9,
      },
    },
  ],
  [
    {
      user: 'schmitizen',
      time: subHours(Date.now(), 142),
      event: 'Sighting reported',
      data: {
        anonymousReport: false,
        sex: '',
        verbatimLocality: '',
      },
    },
  ],
];

export default function SightingHistoryDialog({ open, onClose }) {
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <StandardDialog
      open={open}
      onClose={() => {
        setSelectedEvent(null);
        onClose();
      }}
      titleId="HISTORY"
      PaperProps={{
        style: { width: 680, maxWidth: '90%', height: 420 },
      }}
    >
      {selectedEvent ? (
        <div
          style={{
            margin: '20px 40px 40px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Button
              onClick={() => setSelectedEvent(null)}
              display="back"
              id="BACK"
            />
            <Button size="small">Revert action</Button>
          </div>
          <div
            style={{
              maxHeight: 300,
              overflow: 'scroll',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.grey['100'],
              padding: 12,
            }}
          >
            <Text
              variant="body2"
              style={{
                whiteSpace: 'pre',
                fontFamily: 'monospace',
                color: theme.palette.text.secondary,
              }}
            >
              {JSON.stringify(selectedEvent, null, 4)}
            </Text>
          </div>
        </div>
      ) : (
        <List
          dense
          style={{
            margin: '20px 40px 40px 40px',
            maxHeight: 300,
            overflow: 'scroll',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {changesByDay.map((changesInDate, i) => (
            <>
              {i === 0 ? null : <Divider style={{ marginTop: 16 }} />}
              <ListSubheader disableSticky>
                {format(changesInDate[0].time, 'yyyy-MM-dd')}
              </ListSubheader>
              {changesInDate.map(change => (
                <ListItem key={change.time}>
                  <ListItemAvatar>
                    <Avatar>{change.user[0].toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  {/* <ListItemText
                    primary={
                      <span>
                        <Link>
                          {change.user}
                        </Link>
                        <span>
                          {` at ${format(change.time, 'HH:mm')}`}
                        </span>
                      </span>
                    }
                    secondary={change.event}
                  /> */}
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => setSelectedEvent(change)}
                      edge="end"
                    >
                      <InfoIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </>
          ))}
        </List>
      )}
    </StandardDialog>
  );
}
