import React, { useState } from 'react';
import CreateAdminUser from './CreateAdminUser';
import AdminUserLogin from './AdminUserLogin';
import BasicSettingsForm from './BasicSettingsForm';

const steps = [CreateAdminUser, AdminUserLogin, BasicSettingsForm];

export default function Controller() {
  const [step, setStep] = useState(0);
  const CurrentPage = steps[step];
  return <CurrentPage currentStep={step} setStep={setStep} />;
}
