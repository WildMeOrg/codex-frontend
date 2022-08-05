import React from 'react';

import Timeline from '@material-ui/lab/Timeline';

import Card from '../../../components/cards/Card';
import SubmissionStep from './SubmissionStep';
import PreparationStep from './PreparationStep';
import DetectionStep from './DetectionStep';
import CurationStep from './CurationStep';
import IdentificationStep from './IdentificationStep';

export default function StatusCard({ sightingData }) {
  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS">
      <Timeline>
        <SubmissionStep sightingData={sightingData} />
        <PreparationStep sightingData={sightingData} />
        <DetectionStep sightingData={sightingData} />
        <CurationStep sightingData={sightingData} />
        <IdentificationStep sightingData={sightingData} />
      </Timeline>
    </Card>
  );
}
