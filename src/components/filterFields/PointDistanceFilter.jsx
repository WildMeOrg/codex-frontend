import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';

import PointDistanceMap from './mapUtils/PointDistanceMap';
import Button from '../Button';
import Text from '../Text';
import StandardDialog from '../StandardDialog';

const inputWidth = 220;

export default function PointDistanceFilter({
  label,
  labelId,
  description,
  descriptionId,
  filterId,
  defaultDistance = 50,
  clause = 'filter',
  queryTerm,
  onChange,
  style,
  nested = false,
  ...rest
}) {
  const intl = useIntl();
  const theme = useTheme();

  const [distance, setDistance] = useState(defaultDistance);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gpsForMapUpdate, setGpsForMapUpdate] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const onClose = () => setModalOpen(false);

  const translatedLabel = labelId
    ?   (intl.messages[labelId]
      ? intl.formatMessage({ id: labelId })
      : labelId )
    : label; 

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <Text style={{ color: theme.palette.text.secondary }}>
        {translatedLabel}
      </Text>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        style={{ marginLeft: 8, minWidth: 48, height: 36 }}
        id="SET"
        {...rest}
      />
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="SELECT_LOCATION"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          {modalOpen && (
            <PointDistanceMap
              latitude={latitude}
              longitude={longitude}
              gps={gpsForMapUpdate}
              distance={distance}
              onChange={({ lat, lng }) => {
                setLatitude(lat.toString());
                setLongitude(lng.toString());
              }}
            />
          )}
          <Text
            id="SEARCH_CENTER_POINT"
            variant="h6"
            style={{ marginTop: 12 }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              style={{ width: inputWidth, marginRight: 16 }}
              id="gps-latitude"
              label={intl.formatMessage({ id: 'DECIMAL_LATITUDE' })}
              value={latitude}
              onChange={e => {
                const inputValue = e.target.value;
                setLatitude(inputValue);
                if (longitude)
                  setGpsForMapUpdate([inputValue, longitude]);
              }}
            />
            <TextField
              style={{ width: inputWidth }}
              id="gps-longitude"
              label={intl.formatMessage({ id: 'DECIMAL_LONGITUDE' })}
              value={longitude}
              onChange={e => {
                const inputValue = e.target.value;
                setLongitude(inputValue);
                if (latitude)
                  setGpsForMapUpdate([latitude, inputValue]);
              }}
            />
          </div>
          <Text
            id="SEARCH_RADIUS_LABEL"
            variant="h6"
            style={{ marginTop: 12 }}
          />
          <Slider
            style={{ marginTop: 48, width: inputWidth * 2 + 16 }}
            value={distance}
            min={1}
            max={500}
            onChange={(_, newDistance) => {
              setDistance(newDistance);
            }}
            valueLabelDisplay="on"
          />
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button display="basic" onClick={onClose} id="CANCEL" />
          <Button
            display="primary"
            onClick={() => {
              onChange({
                filterId,
                descriptor: `${translatedLabel}: ${distance}km`,
                nested,
                clause,
                query: {
                  geo_distance: {
                    distance: `${distance}km`,
                    [queryTerm]: [
                      parseFloat(latitude),
                      parseFloat(longitude),
                    ],
                  },
                },
              });
              onClose();
            }}
            id="CONFIRM"
          />
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
