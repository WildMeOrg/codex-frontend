import React from 'react';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';

import OneIndividualIcon from '../../components/icons/OneIndividualIcon';
import MultipleIndividualsIcon from '../../components/icons/MultipleIndividualsIcon';
import MultipleSightingsIcon from '../../components/icons/MultipleSightingsIcon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ChoiceCard from './ChoiceCard';
import ReportSightingsPage from './ReportSightingsPage';

export default function ReportSplash({ authenticated }) {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'REPORT_SIGHTINGS' }));
  const theme = useTheme();

  return (
    <ReportSightingsPage authenticated={authenticated}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <ChoiceCard
          renderIcon={() => (
            <OneIndividualIcon
              color={theme.palette.primary.main}
              width={160}
              height={160}
            />
          )}
          labelId="ONE_SIGHTING_ONE_INDIVIDUAL"
          descriptionId="ONE_SIGHTING_ONE_INDIVIDUAL_DESCRIPTION"
          href="/report/one"
          style={{ marginLeft: 0 }}
        />

        <ChoiceCard
          renderIcon={() => (
            <MultipleIndividualsIcon
              color={theme.palette.primary.main}
              width={160}
              height={160}
            />
          )}
          labelId="ONE_SIGHTING_MULTIPLE_INDIVIDUALS"
          descriptionId="ONE_SIGHTING_MULTIPLE_INDIVIDUALS_DESCRIPTION"
          href="/report/several"
        />

        <ChoiceCard
          renderIcon={() => (
            <MultipleSightingsIcon
              color={theme.palette.primary.main}
              width={160}
              height={160}
            />
          )}
          labelId="MULTIPLE_SIGHTINGS"
          descriptionId="MULTIPLE_SIGHTINGS_DESCRIPTION"
          href="/report/bulk"
          style={{ marginRight: 0 }}
        />
      </div>
    </ReportSightingsPage>
  );
}
