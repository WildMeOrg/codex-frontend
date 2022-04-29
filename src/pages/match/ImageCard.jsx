import React, { useMemo } from 'react';
import { get } from 'lodash-es';

import useSiteSettings from '../../models/site/useSiteSettings';
import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import Text from '../../components/Text';
import Card from '../../components/cards/Card';
import LocationIdViewer from '../../components/fields/view/LocationIdViewer';
import DataLineItem from './DataLineItem';

export default function ImageCard({ titleId, annotation }) {
  const {
    data: siteSettings,
    loading,
    siteSettingsVersion,
  } = useSiteSettings();

  const regionChoices = useMemo(
    () => {
      return get(
        siteSettings,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );
    },
    [siteSettingsVersion, siteSettings],
  );

  const lineItemsBlank = !annotation;

  return (
    <Card titleId={titleId} maxHeight="unset">
      <AnnotatedPhotograph
        assetMetadata={{
          alt: 'Selected query annotation',
          src: annotation?.image_url,
          dimensions: annotation?.asset_dimensions,
        }}
        annotations={[annotation]}
        width="100%"
        height={420}
      />
      <div style={{ padding: 16 }}>
        <DataLineItem
          labelId="INDIVIDUAL"
          loading={loading}
          blank={lineItemsBlank}
        >
          <Text component="span">Unassigned</Text>
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
          <Text component="span">November 5, 2010</Text>
        </DataLineItem>
      </div>
    </Card>
  );
}
