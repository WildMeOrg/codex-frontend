import React, { useMemo } from 'react';
import { get } from 'lodash-es';

import { formatSpecifiedTime } from '../../utils/formatters';
import useSiteSettings from '../../models/site/useSiteSettings';
import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Card from '../../components/cards/Card';
import LocationIdViewer from '../../components/fields/view/LocationIdViewer';
import DataLineItem from './DataLineItem';

export default function ImageCard({ titleId, annotation }) {
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

  return (
    <Card titleId={titleId}>
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
