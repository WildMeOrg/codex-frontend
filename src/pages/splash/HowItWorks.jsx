import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InlineButton from '../../components/InlineButton';
import ResponsiveHeader from '../../components/ResponsiveHeader';
import graphic from '../../assets/howitworks.png';

const stepMap = {
  1: {
    title: 'HOW_IT_WORKS_STEP_1_TITLE',
    description: 'HOW_IT_WORKS_STEP_1_DESCRIPTION',
    image: graphic,
  },
  2: {
    title: 'HOW_IT_WORKS_STEP_2_TITLE',
    description: 'HOW_IT_WORKS_STEP_2_DESCRIPTION',
    image: graphic,
  },
  3: {
    title: 'HOW_IT_WORKS_STEP_3_TITLE',
    description: 'HOW_IT_WORKS_STEP_3_DESCRIPTION',
    image: graphic,
  },
  4: {
    title: 'HOW_IT_WORKS_STEP_4_TITLE',
    description: 'HOW_IT_WORKS_STEP_4_DESCRIPTION',
    image: graphic,
  },
};

function StepButton({ translationId, step, setStep, active }) {
  return (
    <InlineButton
      onClick={() => setStep(step)}
      style={{
        margin: 8,
        fontWeight: active ? 'bold' : 300,
        fontSize: active ? 16 : 'unset',
      }}
      noUnderline={!active}
    >
      <FormattedMessage id={translationId} />
    </InlineButton>
  );
}

export default function HowItWorks() {
  const theme = useTheme();
  const [step, setStep] = useState('1');

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 50,
      }}
    >
      <ResponsiveHeader
        style={{
          color: theme.palette.primary.main,
          margin: '12px 0',
        }}
      >
        <FormattedMessage id="HOW_IT_WORKS" />
      </ResponsiveHeader>
      <Typography variant="subtitle1">
        <FormattedMessage id={stepMap[step].title} />
      </Typography>
      <img
        src={stepMap[step].image}
        alt="How it works"
        style={{ height: 'auto', width: 300 }}
      />
      <Typography
        style={{ color: theme.palette.common.white, maxWidth: 320 }}
      >
        <FormattedMessage id={stepMap[step].description} />
      </Typography>
      <div style={{ marginTop: 20 }}>
        {Object.keys(stepMap).map(s => (
          <StepButton
            key={s}
            step={s}
            setStep={setStep}
            active={step === s}
            translationId={s.toString()}
          />
        ))}
      </div>
    </div>
  );
}
