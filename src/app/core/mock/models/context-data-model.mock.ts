import { QUOTE_APP_CONTEXT_DATA_NAME, QUOTE_CONTEXT_DATA_NAME } from '../../constants';

export const ContextDataMock: { [key: string]: any } = {
  [QUOTE_CONTEXT_DATA_NAME]: {
    client: { isClient: true },
    personalData: {},
    driven: { drivenLicense: 'license', drivenLicenseCountry: 'country' },
    vehicle: { make: 'make', powerRange: 'range', yearOfManufacture: 'year' },
    place: {},
    dateOfIssue: {}
  },
  [QUOTE_APP_CONTEXT_DATA_NAME]: {
    viewedPages: []
  }
};
