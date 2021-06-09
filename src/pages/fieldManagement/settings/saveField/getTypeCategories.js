import { get } from 'lodash-es';

export default function getTypeCategories(siteSettings, type) {
  const customFieldCategories = get(
    siteSettings,
    ['site.custom.customFieldCategories', 'value'],
    [],
  );

  return customFieldCategories.filter(
    category => category.type === type,
  );
}
