import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MainColumn from '../../components/MainColumn';
import PhotoUploader from '../../components/PhotoUploader';

export default function StandardReport() {
  const [step, setStep] = useState(1);

  return (
    <MainColumn>
      <Grid container direction="column">
        <Grid item>
          <Stepper activeStep={step} alternativeLabel>
            <Step>
              <StepLabel>Choose type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Upload photographs</StepLabel>
            </Step>
            <Step>
              <StepLabel>Group photographs</StepLabel>
            </Step>
            <Step>
              <StepLabel>Set metadata</StepLabel>
            </Step>
          </Stepper>
        </Grid>
        <Grid item>
          <PhotoUploader
            title={<FormattedMessage id="UPLOAD_PHOTOS" />}
            onComplete={result => {
              console.log(result);
            }}
          />
        </Grid>

        <Grid item>
          <Button>Continue</Button>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
