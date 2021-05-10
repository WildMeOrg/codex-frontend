import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// import SpeciesIcon from '@material-ui/icons/Category';
// import RegionIcon from '@material-ui/icons/MyLocation';
// import ContextIcon from '@material-ui/icons/NaturePeople';
// import SubmitterIcon from '@material-ui/icons/Person';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Button from '../../components/Button';
import EntityHeaderNew from '../../components/EntityHeaderNew';
import { selectSightings } from '../../modules/sightings/selectors';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import { formatDate } from '../../utils/formatters';
// import AnnotationsGallery from './AnnotationsGallery';
// import IndividualsGallery from './IndividualsGallery';
import Photographs from './Photographs';
import OverviewContent from './OverviewContent';
import SightingHistoryDialog from './SightingHistoryDialog';
import FeaturedPhoto from './featuredPhoto/FeaturedPhoto';

export default function Sighting() {
  const { id } = useParams();
  const intl = useIntl();
  const {
    data,
    loading,
    error,
    refresh: refreshSightingData,
  } = useSighting(id);
  const fieldSchemas = useSightingFieldSchemas();

  console.log(data);

  /*
    known issue: if data or fieldschemas change values
    or properties this may not update
    switch to data.version?
  */
  const metadata = useMemo(
    () => {
      if (!data || !fieldSchemas) return null;
      return fieldSchemas.map(schema => ({
        ...schema,
        value: schema.getValue(schema, data),
      }));
    },
    [data, fieldSchemas],
  );

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(`Sighting ${id}`);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeTab = window.location.hash || '#overview';

  const is404 = false;

  if (loading) return <LoadingScreen />;
  if (is404)
    return (
      <SadScreen
        subtitleId="SIGHTING_NOT_FOUND"
        variant="genericError"
      />
    );
  if (error) return <SadScreen variant="genericError" />;
  if (!data)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="SIGHTING_NOT_FOUND"
      />
    );

  const sightingDisplayDate = get(data, ['startTime']);
  // const encounters = get(data, ['encounters'], []);
  const assets = get(data, 'assets', []);

  return (
    <MainColumn fullWidth>
      <SightingHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <EntityHeaderNew
        renderAvatar={
          <FeaturedPhoto
            assets={assets}
            loading={loading}
            editable={assets.length > 0}
          />
        }
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          {
            date: formatDate(sightingDisplayDate, true),
          },
        )}
        renderOptions={
          <div>
            <Button id="SUBSCRIBE" display="primary" />
            <IconButton
              aria-controls="sighting-actions"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ marginLeft: 4 }}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id="sighting-actions-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  setHistoryOpen(true);
                  handleClose();
                }}
              >
                View history
              </MenuItem>
              <MenuItem onClick={handleClose}>
                Delete sighting
              </MenuItem>
            </Menu>
          </div>
        }
      >
        Reported by George Masterson
      </EntityHeaderNew>
      <Tabs
        value={activeTab.replace('#', '')}
        onChange={(_, newValue) => {
          window.location.hash = newValue;
        }}
        style={{ margin: '32px 0 20px' }}
      >
        <Tab
          label={<FormattedMessage id="OVERVIEW" />}
          value="overview"
        />
        <Tab
          label={<FormattedMessage id="INDIVIDUALS" />}
          value="individuals"
        />
        <Tab
          label={<FormattedMessage id="ANNOTATIONS" />}
          value="annotations"
        />
        <Tab
          label={<FormattedMessage id="PHOTOGRAPHS" />}
          value="photographs"
        />
      </Tabs>
      {activeTab === '#overview' && (
        <OverviewContent
          metadata={metadata}
          sightingId={id}
          refreshSightingData={refreshSightingData}
        />
      )}
      {activeTab === '#photographs' && (
        <Photographs assets={assets} />
      )}
    </MainColumn>
  );
}

/*

{/* /* {activeTab === '#individuals' && (
  <IndividualsGallery sighting={encounters} />
)}
{activeTab === '#annotations' && (
  <AnnotationsGallery sighting={sighting} />
)} */
