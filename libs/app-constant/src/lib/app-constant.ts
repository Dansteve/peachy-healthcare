import { GenderType, User } from '@peachy-healthcare/app-interface';
import { v4 as NEW_UUID } from 'uuid';

export const jwtConstants = {
  secret: 'secretKey-peachy-healthcare',
};


/**
 *
 *
 * @param [length=11]
 * @param [caseType=0] possible value = 0, 1, 2, 3, 4
 * @returns
 * @memberof CryptoService
 */
export const generateRandomString = (length = 16, caseType = 5): string => {
  let pass: any = '';
  let characters: string;
  const fullCharacters = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '/!@#$%^&*()-+<>'];
  switch (caseType) {
    case 0: {
      characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
      break;
    }
    case 1: {
      characters = fullCharacters[0];
      break;
    }
    case 2: {
      characters = fullCharacters[0] + fullCharacters[1];
      break;
    }
    case 3: {
      characters = fullCharacters[0] + fullCharacters[2];
      break;
    }
    case 4: {
      characters = fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
      break;
    }
    case 5: {
      characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2];
      break;
    }
    default: {
      characters = fullCharacters[0] + fullCharacters[1] + fullCharacters[2] + fullCharacters[3];
      break;
    }
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    pass += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return pass;
};


export const initialUsers: User[] = [
  {
    id: NEW_UUID(),
    firstName: 'Dansteve',
    lastName: 'Adekanbi',
    username: 'dansteve.adekanbi@mail.bcu.ac.uk',
    age: '36',
    gender: 'Male',
    phoneNumber: '0123456789',
    password: 'password',
    userRef: generateRandomString(11, 3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      "postcode": "B8 3QU",
      "latitude": 52.4904132,
      "longitude": -1.8510468,
      "formatted_address": [
        "40 Highfield Road",
        "",
        "",
        "Saltley, Birmingham",
        "West Midlands"
      ],
      "thoroughfare": "Highfield Road",
      "building_name": "",
      "sub_building_name": "",
      "sub_building_number": "",
      "building_number": "40",
      "line_1": "40 Highfield Road",
      "line_2": "",
      "line_3": "",
      "line_4": "",
      "locality": "Saltley",
      "town_or_city": "Birmingham",
      "county": "West Midlands",
      "district": "Birmingham",
      "country": "England",
      "residential": true,
      search: ''
    }
  },
];

export const Genders: GenderType[] = [
  'Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say'
];

export enum ConstPageValue {
  DASHBOARD = 'dashboard',
  HOME = 'home',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SIGNUP = 'signup',
  SIGN_OUT = 'sign out',
  PROFILE = 'profile',
  PROFILE_UPDATE = 'profile-update',
  TRANSACTIONS = 'transactions',
}
