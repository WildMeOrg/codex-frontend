import { set } from 'lodash-es';

export function derivePropertyOverrides(
  formData,
  showSexInput,
  showDefaultNameInput,
  showNicknameInput,
) {
  const overrides = {};
  if (showSexInput) overrides.sex = formData?.sex;
  if (showDefaultNameInput) {
    set(
      overrides,
      ['name_context', 'defaultName'],
      formData?.defaultName,
    );
  }
  if (showNicknameInput) {
    set(overrides, ['name_context', 'nickname'], formData?.nickname);
  }
  return overrides;
}

export function isFormComplete(
  formData,
  showSexInput,
  showDefaultNameInput,
  showNicknameInput,
) {
  if (showSexInput && !formData?.sex) return false;
  if (showDefaultNameInput && !formData?.defaultName) return false;
  if (showNicknameInput && !formData?.nickname) return false;
  return true;
}
