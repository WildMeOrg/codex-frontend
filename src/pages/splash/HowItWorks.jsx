import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import InlineButton from '../../components/InlineButton';
import graphic from '../../assets/howitworks.png';

export default function HowItWorks({ padding = 50, textColor }) {
  const [step, setStep] = useState(1);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'black',
        color: textColor,
        textAlign: 'center',
        padding,
      }}
    >
      <Typography variant="h3" component="h3">
        <FormattedMessage id="HOW_IT_WORKS" />
      </Typography>
      <Typography
        variant="subtitle1"
        style={{ color: 'white' }}
      >{`Phase ${step}: Detection`}</Typography>
      <img
        src={graphic}
        alt="How it works"
        style={{ height: 'auto', width: 400 }}
      />
      <Typography style={{ color: 'white' }}>
        Wildbook uses photo identification to detect Wild Blobs
      </Typography>

      <InlineButton onClick={() => setStep(1)}>1</InlineButton>
      <InlineButton
        onClick={() => setStep(2)}
        style={{ marginLeft: 8 }}
      >
        2
      </InlineButton>
      <InlineButton
        onClick={() => setStep(3)}
        style={{ marginLeft: 8 }}
      >
        3
      </InlineButton>
      <InlineButton
        onClick={() => setStep(4)}
        style={{ marginLeft: 8 }}
      >
        4
      </InlineButton>
    </div>
  );
}
