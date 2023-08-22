import { over, set } from 'lodash-es';

export function derivePropertyOverrides(
  formData,
  showSexInput,
  showFirstNameInput,
  showAdoptionNameInput,
  showAutogenNameInput,
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
  if (showAutogenNameInput) {
    for (const key in formData) {
        if (key.startsWith("autogen")) {
          set(
            overrides,
            ['name_context', key],
            formData[key],
          );
            console.log("key: " + key + " value: " + formData[key]);
        }
    }
}
  overrides.taxonomy_guid = formData?.taxonomy_guid;
  console.log('overrides',overrides);
  return overrides;
}

export function isFormComplete(
  formData,
  showSexInput,
  showFirstNameInput,
  showAdoptionNameInput,
) {
  if (showSexInput && !formData?.sex) return false;
  if (showFirstNameInput && !formData?.firstName) return false;
  if (showAdoptionNameInput && !formData?.adoptionName) return false;
  if (!formData?.taxonomy_guid) return false;
  return true;
}
