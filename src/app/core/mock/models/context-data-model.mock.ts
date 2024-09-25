import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';

export const ContextDataMock: { [key: string]: any } = {
  [QUOTE_CONTEXT_DATA]: {
    client: { isClient: true },
    personalData: {},
    driven: { drivenLicense: 'license', drivenLicenseCountry: 'country' },
    vehicle: { make: 'make', powerRange: 'range', yearOfManufacture: 'year' },
    place: {},
    dateOfIssue: {}
  },
  [QUOTE_APP_CONTEXT_DATA]: {
    viewedPages: []
  }
};
