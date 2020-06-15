import defaultProfile from '../../assets/defaultProfile.jpg';

export const selectUsers = state => ({
  alice: {
    name: 'Alice Winterland',
    id: 'alice',
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
      {
        name: 'email',
        value: 'alice@gmail.com',
      },
      {
        name: 'forum_id',
        value: 'awint404',
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
        individualId: 'WB-102',
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
        individualId: 'WB-105',
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
        individualId: 'WB-107',
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
  bob: {
    name: 'Bob Dakota',
    id: 'bob',
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
      {
        name: 'email',
        value: 'bob@gmail.com',
      },
      {
        name: 'forum_id',
        value: 'boboooo',
      },
      {
        name: 'show_email_in_profile',
        value: true,
      },
      {
        name: 'receive_notification_emails',
        value: true,
      },
      {
        name: 'receive_newsletter_emails',
        value: false,
      },
      {
        name: 'footer_logo',
        value: null,
      },
      {
        name: 'use_usa_dates',
        value: true,
      },
      {
        name: 'locale',
        value: 'en',
      },
    ],
    settings: {
      pendingReports: [
        {
          mode: 'standard',
          uploads: ['abc.org'],
          species: 'dolphinicus gravitus',
          dataGroups: [
            {
              date: Date.now(),
              location: 'Mexico',
              associatedUploads: ['abc.org'],
            },
          ],
        },
      ],
    },
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
        individualId: 'WB-109',
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
        individualId: 'WB-152',
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
        individualId: 'WB-117',
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
        individualId: 'WB-120',
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
