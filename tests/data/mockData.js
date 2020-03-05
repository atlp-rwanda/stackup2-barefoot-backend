export default {
  signupData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    address: 'Kigali, Rwanda',
    password: 'helloworld',
    gender: 'Male',
  },
  incompleteData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnny@doe.com',
    gender: 'Male',
  },
  realLoginDataFromTheDb: {
    email: 'john@doe.com',
    password: 'helloworld'
  },
  WrongLoginPasswordData: {
    email: 'john@doe.com',
    password: '12334ewe'
  },
  WrongLoginEmailData: {
    email: 'emmamugi@gmail.com',
    password: 'helloworld'
  },
  emptyLoginPassword: {
    email: 'john@doe.com',
    password: ''
  },
  emptyLoginEmail: {
    email: '',
    password: 'hheerr'
  }
};
