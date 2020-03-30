import defaultProfile from '../../assets/defaultProfile.jpg';

export const selectUsers = state => ({
  alice: {
    name: 'Alice Winterland',
    profile: defaultProfile,
    editable: false,
    fields: [
      {
        name: 'affiliation',
        value: 'University of Denver',
      },
      {
        name: 'location',
        value: 'Seattle, Washington',
      },
      {
        name: 'website',
        value: 'https://id.sito.org/uwi/',
      },
    ],
    data: {
      followedBy: [
        { id: 'jsmith42', name: 'Joe Smith' },
        { id: 'kiki66', name: 'Khai Kinkade' },
        { id: 'jjoop', name: 'Jjoop Loops' },
      ],
      organizations: [
        {
          id: 'asdlfkjasdlfkj',
          name: 'Sahara Conservation Fund',
          role: 'Admin',
        },
        { id: 'asdlkjasdlfkj', name: 'NOAA', role: 'User' },
      ],
      lastSeen: Date.now(),
    },
    encounters: [
      {
        id: 'lkfjaoiwejflkajasd',
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
        profile: defaultProfile,
        user: 'Betty Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 6,
        matchCount: 2,
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
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
  bob: {
    name: 'Bob Dakota',
    profile: defaultProfile,
    editable: true,
    fields: [
      {
        name: 'affiliation',
        value: 'University of Maine',
      },
      {
        name: 'location',
        value: 'Portland, Maine',
      },
      {
        name: 'website',
        value: 'https://id.sito.org/uwi/',
      },
    ],
    data: {
      followedBy: [
        { id: 'jsmith42', name: 'Joe Smith' },
        { id: 'kiki66', name: 'Khai Kinkade' },
        { id: 'jjoop', name: 'Jjoop Loops' },
      ],
      organizations: [],
      lastSeen: Date.now(),
    },
    encounters: [
      {
        id: 'lkfjaoiwejflkajasd',
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
        profile: defaultProfile,
        user: 'Betty Spinoza',
        userId: 'lajfoiwejoiefjaasdf',
        status: 'identification-complete',
        photoCount: 6,
        matchCount: 2,
        submissionDate: Date.now(),
      },
      {
        id: 'lekfjwljefoiajlfew',
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
