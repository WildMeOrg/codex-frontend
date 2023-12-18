import React, { useEffect, useMemo, useState } from 'react';
import _, { get } from 'lodash-es';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { formatSpecifiedTime } from '../../utils/formatters';
import useSiteSettings from '../../models/site/useSiteSettings';
import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Card from '../../components/cards/Card';
import LocationIdViewer from '../../components/fields/view/LocationIdViewer';
import DataLineItem from './DataLineItem';
import Button from '../../components/Button';
import MyImageButton from './ImageButton';
import DerivedAnnotatedPhotograph from '../individualGallery/components/DerivedAnnotatedPhotograph';

export default function ImageCard({
  titleId,
  annotation,
  heatmapon,
  heatmapurl,
  left,
  allData,
}) {
  const { data: siteSettings, loading } = useSiteSettings();

  const regionChoices = useMemo(
    () =>
      get(siteSettings, [
        'site.custom.regions',
        'value',
        'locationID',
      ]),
    [siteSettings],
  );

  const lineItemsBlank = !annotation;
  const individualName =
    annotation?.individual_first_name || 'Unnamed Individual';
  const individualGuid = annotation?.individual_guid;
  const assignedToIndividual =
    individualGuid && individualGuid !== 'None';

  const sightingDisplayTime = formatSpecifiedTime(
    annotation?.sighting_time,
    annotation?.sighting_time_specificity,
  );

  const getSelectedIndexByAnnotation = () => {
    if (_.isNil(annotation) || _.isEmpty(annotation)) {
      return 0;
    }
    const index = allData.findIndex(data => {
      if (data?.guid === annotation?.guid) {
        return true;
      }
      return false;
    });
    if (index === -1) {
      return 0;
    }
    return index;
  };

  const getAnnotationByIndex = index => {
    if (_.isNil(allData) || _.isEmpty(allData)) {
      return annotation;
    }
    if (index < 0 || index > allData.length - 1) {
      return allData[0];
    }
    return allData[index];
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const index = getSelectedIndexByAnnotation();
    setSelectedIndex(index);
  }, [annotation?.image_url, annotation?.bounds]);

  const getDisplayedIndex = index => {
    const arr = _.range(0, allData.length);
    if (index === 0) {
      return _.take(arr, 3);
    }
    if (index === arr.length - 1) {
      return _.takeRight(arr, 3);
    }
    return _.slice(arr, index - 1, index + 2);
  };

  return (
    <Card titleId={titleId}>
      {heatmapon && heatmapurl ? (
        <AnnotatedPhotograph
          assetMetadata={{
            alt: 'Selected query annotation',
            src: heatmapurl,
            dimensions: annotation?.asset_dimensions,
          }}
          annotations={[]}
          width="100%"
          height={420}
          heatmapon={heatmapon && heatmapurl}
          left={left}
        />
      ) : (
        <div>
          <DerivedAnnotatedPhotograph
            key={getAnnotationByIndex(selectedIndex)?.guid}
            assetMetadata={{
              alt: 'Selected query annotation',
              src: getAnnotationByIndex(selectedIndex)?.asset_src,
            }}
            annotations={[getAnnotationByIndex(selectedIndex)]}
            width="100%"
            height={420}
          />
          {allData.length > 1 && (
            <div
              style={{
                width: '100%',
                paddingTop: 20,
                paddingLeft: '20%',
                paddingRight: '20%',
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                display="primary"
                disabled={selectedIndex === 0}
                onClick={() => {
                  if (selectedIndex - 1 < 0) {
                    setSelectedIndex(0);
                  } else {
                    setSelectedIndex(selectedIndex - 1);
                  }
                }}
                startIcon={<ArrowBackIosIcon />}
              />
              {getDisplayedIndex(selectedIndex).map(index => (
                <MyImageButton
                  key={`${index}-${selectedIndex}`}
                  title={index + 1}
                  width="6rem"
                  height="4rem"
                  url={
                    getAnnotationByIndex(index).image_url ||
                    getAnnotationByIndex(index).asset_src
                  }
                  isSelected={selectedIndex === index}
                  onClick={() => {
                    setSelectedIndex(index);
                  }}
                />
              ))}
              <Button
                display="primary"
                disabled={selectedIndex === allData.length - 1}
                onClick={() => {
                  if (selectedIndex + 1 > allData.length - 1) {
                    setSelectedIndex(allData.length - 1);
                  } else {
                    setSelectedIndex(selectedIndex + 1);
                  }
                }}
                style={{ padding: 20 }}
                startIcon={<ArrowForwardIosIcon />}
              />
            </div>
          )}
        </div>
      )}

      <div style={{ padding: 16 }}>
        <DataLineItem
          labelId="INDIVIDUAL"
          loading={loading}
          blank={lineItemsBlank}
        >
          <Text component="span">
            {assignedToIndividual ? (
              <Link newTab href={`/individuals/${individualGuid}`}>
                {individualName}
              </Link>
            ) : (
              'Unassigned'
            )}
          </Text>
        </DataLineItem>
        <DataLineItem
          labelId="REGION"
          loading={loading}
          blank={lineItemsBlank}
        >
          <LocationIdViewer
            value={annotation?.encounter_location}
            choices={regionChoices}
            variant="body1"
          />
        </DataLineItem>
        <DataLineItem
          labelId="SIGHTING_TIME"
          loading={loading}
          blank={lineItemsBlank}
        >
          <Text component="span">{sightingDisplayTime}</Text>
        </DataLineItem>
      </div>
    </Card>
  );
}
