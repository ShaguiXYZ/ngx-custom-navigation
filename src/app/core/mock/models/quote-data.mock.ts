import moment from 'moment';
import { OfferingPriceModel, QuoteModel } from 'src/app/shared/models';

export const mockQuoteData: QuoteModel = {
  personalData: {
    name: 'test',
    surname: 'Jasmine',
    email: 'test@gmail.com',
    identificationNumber: '987',
    productsInfo: true,
    phoneNumber: '123456789',
    birthdate: moment('2000-01-01').toDate(),
    privacyPolicy: true
  },
  client: {
    isClient: true,
    isPolicyOwner: true,
    accidents: 0
  },
  driven: {
    hasDrivenLicense: true,
    drivenLicense: '0987654321z',
    drivenLicenseDate: moment('2015-09-01').toDate(),
    drivenLicenseCountry: 'eu'
  },
  place: {
    postalCode: '08001',
    province: { index: '08', data: 'Barcelona' }
  },
  vehicle: {
    plateNumber: '3333-BBB',
    yearOfManufacture: 2024,
    vehicleTtype: 'old',
    cubicCapacity: { index: 1, data: 'a' },
    make: 'Audi',
    model: 'Q3',
    power: 150
  },
  dateOfIssue: {
    dateOfIssue: moment('2024-09-13').toDate()
  },
  insuranceCompany: {
    company: 'company'
  },
  offering: {
    price: {
      modalityId: 1,
      modalityDescription: 'Terceros-basico',
      modalityFullDescription: 'Terceros básico Robo + Incendio',
      paymentType: '€',
      paymentTypeDescription: 'EUR',
      contractable: '',
      totalPremiumAmount: '822,06',
      fee: '',
      receiptData: {
        firstReceiptAmount: 822.06,
        followingReceiptAmount: 0
      },
      coverageList: [
        {
          code: 1,
          texto: 'COVERTURA-1',
          description: 'Lunas + Robo + Incendio',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        },
        {
          code: 2,
          texto: 'COVERTURA-2',
          description: 'Daños por granizo o lluvia',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        },
        {
          code: 3,
          texto: 'COVERTURA-3',
          description: 'Daños por colisión con animales cinegéticos',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        }
      ],
      configurableCoverageList: []
    }
  },
  contactData: {
    contactHour: '10:00'
  }
};

export const mockOfferingPrices: OfferingPriceModel[] = [
  {
    modalityId: 2,
    modalityDescription: 'string',
    modalityFullDescription: 'string',
    paymentType: 'string',
    paymentTypeDescription: 'string',
    popular: true,
    contractable: 'string',
    totalPremiumAmount: 'string',
    fee: 'string',
    receiptData: {
      firstReceiptAmount: 3,
      followingReceiptAmount: 3
    },
    coverageList: [
      {
        code: 4,
        texto: 'string',
        description: 'string',
        isContracted: 'string',
        value: 2,
        subcoverages: null
      }
    ],
    configurableCoverageList: [
      {
        code: 4,
        texto: 'string',
        description: 'string',
        isContracted: 'string',
        value: 2,
        subcoverages: null
      }
    ]
  },
  {
    modalityId: 8,
    modalityDescription: 'string',
    paymentType: 'string',
    paymentTypeDescription: 'string',
    popular: true,
    contractable: 'string',
    totalPremiumAmount: 'string',
    fee: 'string',
    receiptData: {
      firstReceiptAmount: 8,
      followingReceiptAmount: 8
    },
    coverageList: [
      {
        code: 6,
        texto: 'string',
        description: 'string',
        isContracted: 'string',
        value: 5,
        subcoverages: null
      }
    ],
    configurableCoverageList: [
      {
        code: 4,
        texto: 'string',
        description: 'string',
        isContracted: 'string',
        value: 3,
        subcoverages: null
      }
    ]
  }
];
