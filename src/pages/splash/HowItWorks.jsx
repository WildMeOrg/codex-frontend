import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ChevronLeft';
import ForwardIcon from '@material-ui/icons/ChevronRight';
import InlineButton from '../../components/InlineButton';
import Text from '../../components/Text';
import Step1 from './svg/Step1';
import Step2 from './svg/Step2';
import Step3 from './svg/Step3';
import Step4 from './svg/Step4';

const stepMap = {
  1: {
    title: 'HOW_IT_WORKS_STEP_1_TITLE',
    description: 'HOW_IT_WORKS_STEP_1_DESCRIPTION',
    component: Step1,
  },
  2: {
    title: 'HOW_IT_WORKS_STEP_2_TITLE',
    description: 'HOW_IT_WORKS_STEP_2_DESCRIPTION',
    component: Step2,
  },
  3: {
    title: 'HOW_IT_WORKS_STEP_3_TITLE',
    description: 'HOW_IT_WORKS_STEP_3_DESCRIPTION',
    component: Step3,
  },
  4: {
    title: 'HOW_IT_WORKS_STEP_4_TITLE',
    description: 'HOW_IT_WORKS_STEP_4_DESCRIPTION',
    component: Step4,
  },
};

const ArrowButton = function ({ onClick, disabled, Icon }) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      style={{
        color: disabled
          ? 'rgba(255, 255, 255, 0.26)'
          : theme.palette.common.white,
        height: 'min-content',
      }}
    >
      <Icon fontSize="large" />
    </IconButton>
  );
};

const StepButton = function ({
  translationId,
  step,
  setStep,
  active,
}) {
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
};

export default function HowItWorks() {
  const theme = useTheme();
  const [step, setStep] = useState('1');

  const CurrentGraphic = stepMap[step].component;

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
      <Text
        responsive
        variant="h2"
        style={{
          color: theme.palette.primary.main,
          margin: '12px 0',
        }}
        id="HOW_IT_WORKS"
      />
      <Text variant="subtitle1" id={stepMap[step].title} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ArrowButton
          onClick={() => {
            const currentStep = parseInt(step, 10);
            const nextStep = currentStep - 1;
            setStep(`${nextStep}`);
          }}
          disabled={step === '1'}
          Icon={BackIcon}
        />
        <CurrentGraphic
          color={theme.palette.primary.main}
          style={{ height: 'auto', width: 300 }}
        />
        <ArrowButton
          onClick={() => {
            const currentStep = parseInt(step, 10);
            const nextStep = currentStep + 1;
            setStep(`${nextStep}`);
          }}
          disabled={step === '4'}
          Icon={ForwardIcon}
        />
      </div>
      <Text
        style={{
          color: theme.palette.common.white,
          maxWidth: 400,
          marginTop: 12,
          minHeight: 80,
        }}
        id={stepMap[step].description}
      />
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
