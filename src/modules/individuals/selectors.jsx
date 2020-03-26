import defaultProfile from '../../assets/defaultProfile.jpg';

export const selectIndividuals = state => ({
  teddy: {
    name: 'Teddy',
    profile: defaultProfile,
    species: 'bear',
    editable: true,
    fields: [
      {
        name: 'age',
        value: 55,
      },
      {
        name: 'sex',
        value: 'Unknown',
      },
      {
        name: 'status',
        value: 'Alive',
      },
    ],
    data: {
      followedBy: [
        { id: 'jsmith42', name: 'Joe Smith' },
        { id: 'kiki66', name: 'Khai Kinkade' },
        { id: 'jjoop', name: 'Jjoop Loops' },
      ],
      lastSeen: Date.now(),
    },
    encounters: [
      {
        id: 'lkfjaoiwejflkajasd',
        profile: defaultProfile,
        submitter: 'Joe Smith',
        submissionDate: Date.now(),
      },
      {
        id: 'csljlkdjafljsdlfjs',
        profile: defaultProfile,
        submitter: 'Betty Spinoza',
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
        profile: defaultProfile,
        submitter: 'Joe Spinoza',
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
        profile: defaultProfile,
        submitter: 'Betty Smith',
        submissionDate: Date.now(),
      },
    ],
  },
});
