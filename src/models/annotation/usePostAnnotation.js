import { usePost } from '../../hooks/useMutate';

export default function usePostAnnotation() {
  return usePost({
    url: '/annotations/',
    deriveData: ({
      viewpoint,
      asset_guid,
      ia_class,
      rect,
      theta,
      encounterGuid = null,
    }) => {
      const additionalProperties = encounterGuid
        ? { encounter_guid: encounterGuid }
        : {};
      return {
        viewpoint,
        asset_guid,
        ia_class,
        bounds: { theta, rect },
        ...additionalProperties,
      };
    },
  });
}
