import defaultProfile from '../../assets/defaultProfile.jpg';

export const selectOrgs = state => ({
  noaa: {
    name: 'National Oceanic and Atmospheric Organization',
    id: 'noaa',
    editable: true,
    profile: defaultProfile,
    fields: [
      {
        name: 'description',
        value:
          'NOAA is an agency that enriches life through science. Our reach goes from the surface of the sun to the depths of the ocean floor as we work to keep the public informed of the changing environment around them.',
      },
      {
        name: 'website',
        value: 'https://www.noaa.gov/',
      },
      {
        name: 'collaboration_mode',
        value: 'read',
      },
      {
        name: 'control_member_settings',
        value: true,
      },
      {
        name: 'footer_logo',
        value: null,
      },
    ],
    data: {
      members: [
        { id: 'jsmith42', name: 'Joe Smith', role: 'user' },
        { id: 'kiki66', name: 'Khai Kinkade', role: 'administrator' },
        { id: 'jjoop', name: 'Jjoop Loops', role: 'user' },
      ],
    },
    settings: [
      {
        name: 'inviteonly',
        value: false,
      },
      {
        name: 'visible',
        value: true,
      },
    ],
    encounters: [
      {
        id: 'lkfjaoiwejflkajasd',
        individualId: 'WB-105',
        profile: defaultProfile,
        user: 'Joe Smith',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'ready-for-review',
        photoCount: 14,
        matchCount: 4,
        submissionDate: Date.now(),
      },
      {
        id: 'csljlkdjafljsdlfjs',
        individualId: 'WB-122',
        profile: defaultProfile,
        user: 'Betty Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 6,
        matchCount: 2,
        submissionDate: Date.now(),
      },
      {
        id: 'fewafe',
        individualId: 'WB-152',
        profile: defaultProfile,
        user: 'Joe Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 12,
        matchCount: 6,
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
        individualId: 'WB-105',
        profile: defaultProfile,
        user: 'Betty Smith',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 50,
        matchCount: 1,
        submissionDate: Date.now(),
      },
    ],
  },
});
