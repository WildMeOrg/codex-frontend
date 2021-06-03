import { get } from 'lodash-es';

export function getCustomFields(siteSettings, property) {
  return get(
    siteSettings,
    [
      'data',
      `site.custom.customFields.${property}`,
      'value',
      'definitions',
    ],
    [],
  );
}

export function deriveCustomFieldCategories(
  siteSettings,
  categoryPath,
) {
  const allCategories = get(
    siteSettings,
    ['site.custom.customFieldCategories', 'value'],
    [],
  );
  return allCategories.filter(c => c.type === categoryPath);
}
