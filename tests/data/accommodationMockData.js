import dotenv from 'dotenv';

dotenv.config();

export default {
    accommodationValidData: {
        accommodationName: 'BarefootNomad Motel',
        accommodationAddress: 'Nyabihu',
        currency: 'rwf',
        cost: 100000
    },
    accommodationInValidCurrency: {
        accommodationName: 'guesthouse123',
        accommodationAddress: 'kigali',
        currency: 100,
        cost: 100
    },
    accommodationRoomValidData: {
        roomNumber: '100B',
        roomType: 'double room'
    },
    updateAccommodationRoomValidDataNoRoomName: {
    roomType: 'king room'
    },
    roomAccommodationNotExist: {
        roomNumber: '100B',
        roomType: 'double room'
    },
    roomAccommodationIdIntegerError: {
        accommodationId: 'cool',
        roomNumber: '100B',
        roomType: 'double room'
    },
    accommodationCreatorTravelAdminTest: {
        firstName: 'accommodation',
        lastName: 'creator',
        username: 'accommodationcreatortraveladmin',
        email: 'accommodationcreatortraveladmin@example.com',
        address: 'kigali',
        password: 'AccommodationCreator123@',
        gender: 'Male',
    },
    accommodationCreatorSupplierTest: {
        firstName: 'accommodation',
        lastName: 'creator',
        username: 'accommodationcreatorsuplier',
        email: 'accommodationcreatorsuplier@example.com',
        address: 'kigali',
        password: 'Accommodationcreator123@',
        gender: 'Male',
    },
    accommodationCreatorRequester: {
        firstName: 'accommodation',
        lastName: 'creator',
        username: 'accommodationcreatorrequester',
        email: 'accommodationcreatorrequester@example.com',
        address: 'kigali',
        password: 'Accommodationcreator123@',
        gender: 'Male',
    },
    superUserLogin: {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD
    },
    updateAccommodationValidData: {
    accommodationName: 'newguesthouse',
    accommodationAddress: 'butare'
},
    updateAccommodationRoomValidData: {
        roomNumber: '100F',
        roomType: 'QueenRoom'
},
  bookAccommodation: {
    arrivalDate: new Date(Date.now() + 432000000),
    departureDate: new Date(Date.now() + 518400000),
  },
  accommodationValidData2: {
    accommodationName: 'romano guesthouse 2',
    accommodationAddress: 'kigali',
    currency: 'usd',
    cost: 100
  },
  accommodationValidData3: {
    accommodationName: 'romano guesthouse 3',
    accommodationAddress: 'kigali',
    currency: 'usd',
    cost: 100
  },
  nonExistentAccommodationId: Date.now(),
  invalidAccommodationId: 'invalidId',
};
