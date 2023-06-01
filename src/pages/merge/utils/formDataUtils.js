import { set } from 'lodash-es';

export function derivePropertyOverrides(
  formData,
  showSexInput,
  showFirstNameInput,
  showAdoptionNameInput,
) {
  const overrides = {};
  if (showSexInput) overrides.sex = formData?.sex;
  if (showFirstNameInput) {
    set(
      overrides,
      ['name_context', 'FirstName'],
      formData?.firstName,
    );
  }
  if (showAdoptionNameInput) {
    set(
      overrides,
      ['name_context', 'AdoptionName'],
      formData?.adoptionName,
    );
  }
  overrides.taxonomy_guid = formData?.taxonomy_guid;
  console.log('overrides',  overrides);
  return overrides;
}

export function isFormComplete(
  formData,
  showSexInput,
  showFirstNameInput,
  showAdoptionNameInput,
  showSpeciesInput
) {
  if (showSexInput && !formData?.sex) return false;
  if (showFirstNameInput && !formData?.firstName) return false;
  if (showAdoptionNameInput && !formData?.adoptionName) return false;
  if (!formData?.taxonomy_guid) return false;
  return true;
}
