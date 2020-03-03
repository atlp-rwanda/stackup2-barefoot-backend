const authMockData = [
  {
    id: '3569457606459924',
    displayName: 'Muhire Josué',
    name: { familyName: 'Josué', givenName: 'Muhire' },
    emails: [{ value: 'rutayisirejosue@yahoo.fr' }],
    provider: 'facebook',
    _raw: '{"id":"3569457606459924","name":"Muhire Josu\\u00e9","email":"rutayisirejosue\\u0040yahoo.fr","first_name":"Muhire","last_name":"Josu\\u00e9"}',
    _json: {
      id: '3569457606459924', name: 'Muhire Josué', email: 'rutayisirejosue@yahoo.fr', first_name: 'Muhire', last_name: 'Josué'
    }
  },
  {
    provider: 'google',
    sub: '117377618858044356572',
    id: '117377618858044356572',
    displayName: 'josue muhire',
    name: { givenName: 'josue', familyName: 'muhire' },
    given_name: 'josue',
    family_name: 'muhire',
    email_verified: true,
    verified: true,
    language: 'en-GB',
    locale: undefined,
    email: 'muhirejosue09@gmail.com',
    emails: [{ value: 'muhirejosue09@gmail.com', type: 'account' }],
    photos:
   [{
     value:
        'https://lh3.googleusercontent.com/a-/AOh14GjB3miITcKA9F6s2CW3WbDdz3oun0PB94N-SddB9Q',
     type: 'default'
   }],
    picture:
   'https://lh3.googleusercontent.com/a-/AOh14GjB3miITcKA9F6s2CW3WbDdz3oun0PB94N-SddB9Q',
    _raw:
   '{\n  "sub": "117377618858044356572",\n  "name": "josue muhire",\n  "given_name": "josue",\n  "family_name": "muhire",\n  "picture": "https://lh3.googleusercontent.com/a-/AOh14GjB3miITcKA9F6s2CW3WbDdz3oun0PB94N-SddB9Q",\n  "email": "muhirejosue09@gmail.com",\n  "email_verified": true,\n  "locale": "en-GB"\n}',
    _json:
   {
     sub: '117377618858044356572',
     id: '117377618858044356572',
     name: 'josue muhire',
     given_name: 'josue',
     family_name: 'muhire',
     picture:
      'https://lh3.googleusercontent.com/a-/AOh14GjB3miITcKA9F6s2CW3WbDdz3oun0PB94N-SddB9Q',
     email: 'muhirejosue09@gmail.com',
     email_verified: true,
     locale: 'en-GB'
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
