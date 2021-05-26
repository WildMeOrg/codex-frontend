import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';

export default function useAssetGroupSchemas() {
  return [
    createFieldSchema(fieldTypes.select, {
      name: 'speciesDetectionModel',
      labelId: 'SPECIES_DETECTION_MODEL',
      descriptionId: 'SPECIES_DETECTION_MODEL_DESCRIPTION',
      choices: [{ value: 'None', label: 'None' }],
      required: true,
    }), // to become multiselect
    createFieldSchema(fieldTypes.string, {
      name: 'description',
      labelId: 'DESCRIPTION',
    }),
  ];
}
