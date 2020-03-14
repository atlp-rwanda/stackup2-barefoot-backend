const authMockData = [
  {
    id: '3155979791293255',
    username: undefined,
    displayName: 'Ugizwenayo Divine',
    name: {
      familyName: 'Divine',
      givenName: 'Ugizwenayo',
      middleName: undefined
    },
    gender: undefined,
    profileUrl: undefined,
    provider: 'facebook',
    _raw: '{"id":"3155979791293255","name":"Ugizwenayo Divine","first_name":"Ugizwenayo","last_name":"Divine"}',
    _json: {
      id: '3155979791293255',
      name: 'Ugizwenayo Divine',
      first_name: 'Ugizwenayo',
      last_name: 'Divine'
    }
  },
  {
    provider: 'google',
    sub: '116572417699286087831',
    id: '116572417699286087831',
    displayName: 'ugizwenayo Divine',
    name: { givenName: 'ugizwenayo', familyName: 'Divine' },
    given_name: 'ugizwenayo',
    family_name: 'Divine',
    email_verified: true,
    verified: true,
    language: 'en',
    locale: undefined,
    email: 'ugizwenayodiny@gmail.com',
    emails: [{ value: 'ugizwenayodiny@gmail.com', type: 'account' }],
    photos: [
      {
        value: 'https://lh4.googleusercontent.com/-rpYRT-YWYMg/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nB_hbF9PQGxb5vmkoBus1U1Qe0ujQ/photo.jpg',
        type: 'default'
      }
    ],
    picture: 'https://lh4.googleusercontent.com/-rpYRT-YWYMg/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nB_hbF9PQGxb5vmkoBus1U1Qe0ujQ/photo.jpg',
    _raw: '{\n'
      + '  "sub": "116572417699286087831",\n'
      + '  "name": "ugizwenayo Divine",\n'
      + '  "given_name": "ugizwenayo",\n'
      + '  "family_name": "Divine",\n'
      + '  "picture": "https://lh4.googleusercontent.com/-rpYRT-YWYMg/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nB_hbF9PQGxb5vmkoBus1U1Qe0ujQ/photo.jpg",\n'
      + '  "email": "ugizwenayodiny@gmail.com",\n'
      + '  "email_verified": true,\n'
      + '  "locale": "en"\n'
      + '}',
    _json: {
      sub: '116572417699286087831',
      name: 'ugizwenayo Divine',
      given_name: 'ugizwenayo',
      family_name: 'Divine',
      picture: 'https://lh4.googleusercontent.com/-rpYRT-YWYMg/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nB_hbF9PQGxb5vmkoBus1U1Qe0ujQ/photo.jpg',
      email: 'ugizwenayodiny@gmail.com',
      email_verified: true,
      locale: 'en'
    }
  },
  {
    socialMediaId: '11111111111',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    provider: 'tests'
  },
];
export default authMockData;
