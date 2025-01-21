import { ConfigurationDTO } from 'src/app/core/models';
import { WorkflowManifestId } from 'src/app/library/library-manifest';
import { QuoteModel } from 'src/app/library/models';

export const WORKFLOW: ConfigurationDTO<QuoteModel, WorkflowManifestId> = {
  homePageId: 'calcula-tu-seguro',
  title: { value: 'journey-title', type: 'literal' },
  steppers: [
    {
      id: 'main',
      steps: [
        {
          label: { value: 'Steps.PersonalData', type: 'translate' },
          pages: ['is-client', 'place', 'birthdate', 'driving-license-date', 'driving-license-location', 'date-of-issue']
        },
        {
          label: { value: 'Steps.VehicleData', type: 'translate' },
          pages: [
            'vehicle-type',
            'license-plate',
            'your-car-is',
            'vehicle-brand',
            'vehicle-models',
            'vehicle-characteristics',
            'vehicle-model-versions',
            'vehicle-parking',
            'license-year'
          ]
        },
        {
          label: { value: 'Steps.InsuranceData', type: 'translate' },
          pages: ['is-policy-owner', 'insurance-companies', 'time-insurance-holder', 'number-accidents']
        },
        {
          label: { value: 'Steps.ContactData', type: 'translate' },
          pages: ['client-name', 'client-phone-number', 'client-email', 'client-identification-number']
        }
      ]
    },
    {
      id: 'client',
      steps: [
        {
          label: { value: 'Steps.ClientData', type: 'translate' },
          pages: [
            'is-client-client-name',
            'is-client-client-phone-number',
            'is-client-client-email',
            'is-client-client-identification-number'
          ]
        },
        {
          label: { value: 'Steps.WeCallYou', type: 'translate' },
          pages: ['is-client-contact-us']
        }
      ],
      stateInfo: {
        inherited: false
      }
    },
    {
      steps: [
        {
          label: { value: 'Steps.ContactMode', type: 'translate' },
          pages: ['external-contact-us']
        },
        {
          label: { value: 'Steps.ContactTime', type: 'translate' },
          pages: ['external-contact-time']
        }
      ],
      stateInfo: {
        inherited: false
      }
    }
  ],
  pageMap: [
    {
      pageId: 'calcula-tu-seguro',
      component: 'on-boarding',
      nextOptionList: [
        {
          nextPageId: 'is-client'
        }
      ],
      configuration: {
        literals: {
          'footer-next': { value: 'Pages.CalculateYourInsurance.FooterNext', type: 'translate' },
          header: { value: 'Pages.CalculateYourInsurance.Header', type: 'translate' },
          subheader: { value: 'Pages.CalculateYourInsurance.Subheader', type: 'translate' },
          'coverage-1': { value: 'Pages.CalculateYourInsurance.Coverage-1', type: 'translate' },
          'coverage-2': { value: 'Pages.CalculateYourInsurance.Coverage-2', type: 'translate' },
          'coverage-3': { value: 'Pages.CalculateYourInsurance.Coverage-3', type: 'translate' }
        },
        data: {
          headerConfig: {
            showBack: false,
            showContactUs: false
          },
          stepperConfig: {
            visible: false
          }
        }
      }
    },
    {
      pageId: 'is-client',
      nextOptionList: [
        {
          nextPageId: 'is-client-client-name',
          conditions: [
            {
              expression: 'client.isClient',
              value: true
            }
          ]
        },
        {
          nextPageId: 'place'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.IsClient.Header', type: 'translate' }
        },
        data: {
          contextData: { client: { isClient: false } },
          headerConfig: {
            showBack: false,
            showContactUs: false
          }
        }
      }
    },
    {
      pageId: 'place',
      nextOptionList: [
        {
          nextPageId: 'contact-us',
          conditions: [
            {
              expression: 'place.provinceCode',
              value: '51'
            },
            {
              union: 'OR',
              expression: 'place.provinceCode',
              value: '52'
            }
          ]
        },
        {
          nextPageId: 'date-of-issue'
        }
      ],
      configuration: {
        data: {
          footerConfig: {
            info: {
              icon: 'fa-hand-holding-heart',
              literal: 'footer-info'
            }
          }
        },
        literals: {
          'postal-code': { value: 'Pages.PostalCode.Hint', type: 'translate' },
          header: { value: 'Pages.PostalCode.Header', type: 'translate' },
          'footer-info': { value: 'Pages.PostalCode.FooterInfo', type: 'translate' },
          'error-required': { value: 'Pages.PostalCode.ErrorRequired', type: 'translate' },
          'error-not-found': { value: 'Pages.PostalCode.ErrorNotFound', type: 'translate' }
        }
      }
    },
    {
      pageId: 'birthdate',
      nextOptionList: [
        {
          nextPageId: 'driving-license-location'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.Birthdate.Header', type: 'translate' },
          'birth-date': { value: 'Pages.Birthdate.Hint', type: 'translate' },
          'error-required': { value: 'Pages.Birthdate.ErrorRequired', type: 'translate' },
          'error-old-date': { value: 'Pages.Birthdate.ErrorNotOldEnough', type: 'translate' },
          'error-younger-date': { value: 'Pages.Birthdate.ErrorYoungerDate', type: 'translate' }
        },
        data: {
          minValue: 25
        }
      }
    },
    {
      pageId: 'driving-license-date',
      nextOptionList: [
        {
          nextPageId: 'vehicle-type'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.DrivingLicenseDate.Header', type: 'translate' },
          'issue-date': { value: 'Pages.DrivingLicenseDate.Hint', type: 'translate' },
          'error-min-years-between': { value: 'Pages.DrivingLicenseDate.ErrorMinYearsBetween', type: 'translate' },
          'error-old-date': { value: 'Pages.DrivingLicenseDate.ErrorOldDate', type: 'translate' }
        },
        data: { minDrivingYears: 5 }
      }
    },
    {
      pageId: 'driving-license-location',
      nextOptionList: [
        {
          nextPageId: 'contact-us',
          conditions: [
            {
              expression: 'driven.licenseCountry',
              value: 'other'
            }
          ]
        },
        {
          nextPageId: 'driving-license-date'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.DrivingLicenseLocation.Header', type: 'translate' },
          help: { value: 'Pages.DrivingLicenseLocation.Help', type: 'translate' },
          'help-header': { value: 'Pages.DrivingLicenseLocation.HelpHeader', type: 'translate' },
          eu: { value: 'Pages.DrivingLicenseLocation.EU', type: 'translate' },
          uk: { value: 'Pages.DrivingLicenseLocation.UK', type: 'translate' },
          other: { value: 'Pages.DrivingLicenseLocation.Other', type: 'translate' }
        }
      }
    },
    {
      pageId: 'date-of-issue',
      nextOptionList: [
        {
          nextPageId: 'birthdate'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.DateOfIssue.Header', type: 'translate' },
          'date-of-issue-label': { value: 'Pages.DateOfIssue.Hint', type: 'translate' }
        }
      }
    },
    {
      pageId: 'license-plate',
      nextOptionList: [
        {
          nextPageId: 'apology-screen',
          conditions: [
            {
              expression: 'blackList.plateNumber.blacklisted',
              value: true
            }
          ]
        },
        {
          nextPageId: 'license-year',
          conditions: [
            {
              expression: 'driven.hasDrivenLicense',
              value: false
            },
            {
              union: 'AND',
              expression: 'vehicle.vehicleType',
              operation: '!==',
              value: 'new'
            }
          ]
        },
        {
          nextPageId: 'vehicle-brand',
          conditions: [
            {
              expression: 'driven.hasDrivenLicense',
              value: false
            },
            {
              union: 'AND',
              expression: 'vehicle.vehicleType',
              value: 'new'
            }
          ]
        },
        {
          nextPageId: 'your-car-is'
        }
      ],
      configuration: {
        data: {
          footerConfig: {
            info: {
              icon: 'fa-car',
              literal: 'footer-info'
            }
          },
          contextData: { blackList: { plateNumber: { blacklisted: false } } }
        },
        literals: {
          header: { value: 'Pages.LicensePlate.Header', type: 'translate' },
          'continue-without-license-plate': { value: 'Pages.LicensePlate.ContinueWithoutLicensePlate', type: 'translate' },
          'footer-info': { value: 'Pages.LicensePlate.FooterInfo', type: 'translate' },
          'license-plate': { value: 'Pages.LicensePlate.Hint', type: 'translate' },
          'bad-format': { value: 'Pages.LicensePlate.BadFormat', type: 'translate' }
        },
        serviceActivators: [
          {
            entryPoint: 'next-page',
            activator: '$black-list-plate',
            params: { percentBlacklisted: 0.7 },
            conditions: [
              {
                expression: 'driven.hasDrivenLicense',
                value: true
              }
            ]
          }
        ]
      }
    },
    {
      pageId: 'your-car-is',
      nextOptionList: [
        {
          nextPageId: 'vehicle-parking'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.YourCarIs.Header', type: 'translate' },
          'continue-without-car': { value: 'Pages.YourCarIs.ContinueWithoutCar', type: 'translate' }
        },
        data: {
          footerConfig: {
            showNext: false
          }
        }
      }
    },
    {
      pageId: 'vehicle-parking',
      nextOptionList: [
        {
          nextPageId: 'is-policy-owner'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.VehicleParking.Header', type: 'translate' },
          street: { value: 'Pages.VehicleParking.Street', type: 'translate' },
          'public-parking': { value: 'Pages.VehicleParking.PublicParking', type: 'translate' },
          garage: { value: 'Pages.VehicleParking.Garage', type: 'translate' },
          other: { value: 'Pages.VehicleParking.Other', type: 'translate' }
        }
      }
    },
    {
      pageId: 'vehicle-brand',
      nextOptionList: [
        {
          nextPageId: 'vehicle-models'
        }
      ],
      configuration: {
        literals: {
          header: '¿Qué marca es tu coche?'
        }
      }
    },
    {
      pageId: 'vehicle-type',
      nextOptionList: [
        {
          nextPageId: 'vehicle-brand',
          conditions: [
            {
              expression: 'vehicle.vehicleType',
              value: 'unregistered'
            }
          ]
        },
        {
          nextPageId: 'license-plate'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.VehicleType.Header', type: 'translate' },
          'vehicle-old': { value: 'Pages.VehicleType.VehicleOld', type: 'translate' },
          'vehicle-new': { value: 'Pages.VehicleType.VehicleNew', type: 'translate' },
          'vehicle-second-hand': { value: 'Pages.VehicleType.VehicleSecondHand', type: 'translate' },
          'vehicle-unregistered': { value: 'Pages.VehicleType.VehicleUnregistered', type: 'translate' }
        }
      }
    },
    {
      pageId: 'vehicle-models',
      nextOptionList: [
        {
          nextPageId: 'vehicle-characteristics'
        }
      ],
      configuration: {
        literals: {
          header: '¿Qué modelo es tu coche?'
        }
      }
    },
    {
      pageId: 'vehicle-characteristics',
      nextOptionList: [
        {
          nextPageId: 'vehicle-model-versions'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.VehicleCharacteristics.Header', type: 'translate' },
          'cubic-capacity-not-known': { value: 'Pages.VehicleCharacteristics.CubicCapacityNotKnown', type: 'translate' },
          'power-not-known': { value: 'Pages.VehicleCharacteristics.PowerNotKnown', type: 'translate' }
        }
      }
    },
    {
      pageId: 'vehicle-model-versions',
      nextOptionList: [
        {
          nextPageId: 'your-car-is'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.VehicleModelVersions.Header', type: 'translate' }
        }
      }
    },
    {
      pageId: 'license-year',
      nextOptionList: [
        {
          nextPageId: 'vehicle-brand',
          conditions: [
            {
              expression: 'driven.hasDrivenLicense',
              value: false
            }
          ]
        },
        {
          nextPageId: 'is-policy-owner'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.LicenseYear.Header', type: 'translate' },
          'year-of-manufacture-label': { value: 'Pages.LicenseYear.Hint', type: 'translate' }
        },
        data: {
          maxYearsOld: 25
        }
      }
    },
    {
      pageId: 'is-policy-owner',
      nextOptionList: [
        {
          nextPageId: 'client-name',
          conditions: [
            {
              expression: 'client.isPolicyOwner',
              value: false
            },
            {
              union: 'AND',
              expression: 'vehicle.vehicleType',
              value: 'new'
            }
          ]
        },
        {
          nextPageId: 'insurance-companies',
          conditions: [
            {
              expression: 'vehicle.vehicleType',
              value: 'new'
            },
            {
              union: 'OR',
              expression: 'vehicle.vehicleType',
              value: 'second_hand'
            },
            {
              union: 'AND',
              expression: 'client.isPolicyOwner',
              value: true
            }
          ]
        },
        {
          nextPageId: 'apology-screen',
          conditions: [
            {
              expression: 'client.isPolicyOwner',
              value: false
            },
            {
              union: 'AND',
              expression: 'vehicle.vehicleType',
              value: 'old'
            }
          ]
        },
        {
          nextPageId: 'time-insurance-holder'
        }
      ],
      configuration: {
        literals: {
          header: {
            value: 'Pages.IsPolicyOwner.Header',
            params: {
              days: 25
            },
            type: 'translate'
          }
        }
      }
    },
    {
      pageId: 'insurance-companies',
      nextOptionList: [
        {
          nextPageId: 'time-insurance-holder'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.InsuranceCompanies.Header', type: 'translate' }
        }
      }
    },
    {
      pageId: 'time-insurance-holder',
      nextOptionList: [
        {
          nextPageId: 'number-accidents'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.TimeInsuranceHolder.Header', type: 'translate' },
          year: { value: 'Pages.TimeInsuranceHolder.Year', type: 'translate' },
          years: { value: 'Pages.TimeInsuranceHolder.Years', type: 'translate' },
          last: { value: 'or-more', type: 'literal' }
        }
      }
    },
    {
      pageId: 'number-accidents',
      nextOptionList: [
        {
          nextPageId: 'client-name'
        }
      ],
      configuration: {
        data: {
          footerConfig: {
            info: {
              icon: 'fa-location-arrow',
              literal: 'footer-info'
            }
          }
        },
        literals: {
          not: '{{first}}',
          accident: '{{value}} {{last}}',
          accidents: '{{value}} {{last}}',
          first: { value: 'Pages.NumberAccidents.First', type: 'translate' },
          last: { value: 'or-more', type: 'literal' },
          header: {
            value: 'Pages.NumberAccidents.Header',
            type: 'translate',
            params: {
              value: {
                value: 'insuranceCompany.yearsAsOwner',
                type: 'data',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '>',
                    value: 1
                  }
                ]
              },
              last: {
                value: 'Pages.NumberAccidents.Last',
                type: 'translate',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '>',
                    value: 1
                  }
                ]
              },
              'last-single': {
                value: 'Pages.NumberAccidents.LastSingle',
                type: 'translate',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '<=',
                    value: 1
                  }
                ]
              },
              years: {
                value: 'Label.Years',
                type: 'translate',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '>',
                    value: 1
                  }
                ]
              },
              year: {
                value: 'Label.Year',
                type: 'translate',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '<=',
                    value: 1
                  }
                ]
              }
            }
          },
          'footer-info': { value: 'Pages.NumberAccidents.FooterInfo', type: 'translate' }
        }
      }
    },
    {
      pageId: 'client-name',
      nextOptionList: [
        {
          nextPageId: 'client-phone-number'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.ClientName.Header', type: 'translate' },
          name: { value: 'Pages.ClientName.NameHint', type: 'translate' },
          surname: { value: 'Pages.ClientName.SurnameHint', type: 'translate' },
          'name-error-required': { value: 'Pages.ClientName.NameRequired', type: 'translate' },
          'surname-error-required': { value: 'Pages.ClientName.SurnameRequired', type: 'translate' }
        }
      }
    },
    {
      pageId: 'client-phone-number',
      nextOptionList: [
        {
          nextPageId: 'is-client-client-name',
          conditions: [
            {
              expression: 'blackList.phoneNumber.isClient',
              value: true
            }
          ]
        },
        {
          nextPageId: 'client-email'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.ClientPhoneNumber.Header', type: 'translate' },
          subheader: { value: 'Pages.ClientPhoneNumber.Subheader', type: 'translate' },
          'phone-number': { value: 'Pages.ClientPhoneNumber.Hint', type: 'translate' },
          'error-required': { value: 'Pages.ClientPhoneNumber.ErrorRequired', type: 'translate' },
          'bad-format': { value: 'Pages.ClientPhoneNumber.BadFormat', type: 'translate' }
        },
        serviceActivators: [
          {
            entryPoint: 'next-page',
            activator: '$black-list-phone',
            params: { percentIsClient: 0.7 }
          }
        ]
      }
    },
    {
      pageId: 'client-email',
      nextOptionList: [
        {
          nextPageId: 'client-identification-number'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.ClientEmail.Header', type: 'translate' },
          'legal-text': { value: 'Pages.ClientEmail.LegalText', type: 'translate' },
          'accep-info': { value: 'Pages.ClientEmail.AccepInfo', type: 'translate' },
          'privacy-policy': {
            value: 'Pages.ClientEmail.PrivacyPolicy',
            type: 'translate',
            params: {
              'private-policy-a': {
                value: "<a class='link nx-font-weight-bold' href='{{link}}' target='_blank'>{{link-text}}</a>",
                type: 'value',
                params: {
                  link: { value: 'Pages.ClientEmail.PrivacyPolicyLink', type: 'translate' },
                  'link-text': { value: 'Pages.ClientEmail.LinkText', type: 'translate' }
                }
              }
            }
          },
          'error-required': { value: 'Pages.ClientEmail.ErrorRequired', type: 'translate' },
          'bad-format': { value: 'Pages.ClientEmail.BadFormat', type: 'translate' }
        }
      }
    },
    {
      pageId: 'client-identification-number',
      nextOptionList: [
        {
          nextPageId: 'apology-screen',
          conditions: [
            {
              expression: 'blackList.identificationNumber.blacklisted',
              value: true
            }
          ]
        },
        {
          nextPageId: 'is-client-client-name',
          conditions: [
            {
              expression: 'blackList.identificationNumber.isClient',
              value: true
            }
          ]
        },
        {
          nextPageId: 'este-es-tu-seguro'
        }
      ],
      configuration: {
        data: {
          footerConfig: {
            info: {
              icon: 'fa-id-card',
              literal: 'footer-info'
            }
          }
        },
        literals: {
          header: { value: 'Pages.ClientIdentificationNumber.Header', type: 'translate' },
          subheader: { value: 'Pages.ClientIdentificationNumber.Subheader', type: 'translate' },
          'identification-number': { value: 'Pages.ClientIdentificationNumber.Hint', type: 'translate' },
          'footer-info': { value: 'Pages.ClientIdentificationNumber.FooterInfo', type: 'translate' },
          'error-required': { value: 'Pages.ClientPhoneNumber.ErrorRequired', type: 'translate' },
          'error-nif': { value: 'Pages.ClientIdentificationNumber.ErrorNif', type: 'translate' },
          'error-nie': { value: 'Pages.ClientIdentificationNumber.ErrorNie', type: 'translate' }
        },
        serviceActivators: [
          {
            entryPoint: 'next-page',
            activator: '$black-list-identification-number',
            params: { percentIsClient: 0.7 }
          }
        ]
      }
    },
    {
      pageId: 'este-es-tu-seguro',
      component: 'quote-offerings',
      nextOptionList: [
        {
          nextPageId: 'contact-time'
        }
      ],
      configuration: {
        literals: {
          'coverages-modal-header': 'Compara las coberturas de tu seguro',
          'footer-next': 'LLAMAR AHORA',
          'from-now': 'Desde hoy {{value}}',
          popular: 'El más contratado',
          'view-coverages': 'Ver coberturas'
        },
        serviceActivators: [
          {
            entryPoint: 'on-init',
            activator: '$patch-quote',
            params: { insuranceCompany: { company: {} } },
            conditions: [
              {
                expression: 'client.isPolicyOwner',
                value: false
              }
            ]
          },
          {
            entryPoint: '$on-pricing',
            activator: '$store-budget'
          }
        ]
      }
    },
    {
      pageId: 'confirmation',
      nextOptionList: [
        {
          nextPageId: 'calcula-tu-seguro'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.Confirmation.Header', type: 'translate' },
          subheader: { value: 'Pages.Confirmation.Subheader', type: 'translate' },
          'footer-next': { value: 'Pages.Confirmation.FooterNext', type: 'translate' }
        },
        data: {
          contextData: {
            blackList: {},
            client: {},
            contactData: {},
            driven: {},
            insuranceCompany: {},
            personalData: {},
            place: {},
            vehicle: {},
            offering: {}
          },
          headerConfig: {
            showBack: false,
            showContactUs: false
          },
          stepperConfig: {
            visible: false
          }
        }
      }
    },
    {
      pageId: 'contact-time',
      nextOptionList: [
        {
          nextPageId: 'confirmation'
        }
      ],
      configuration: {
        literals: {
          afternoon: 'Por la tarde',
          header: '¿Cuándo podemos llamarte?',
          morning: 'Por la mañana'
        },
        data: {
          hours: {
            am: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
            pm: ['15:00', '16:00', '17:00', '18:00']
          },
          headerConfig: {
            showBack: true,
            showContactUs: false
          }
        }
      }
    },
    {
      pageId: 'contact-us',
      configuration: {
        literals: {
          header: 'Información de contacto',
          subheader: 'Nos gustaría poder ayudarte, <br/>¡contactanos!',
          'footer-next': 'FINALIZAR',
          line1: 'Horario comercial',
          line2: 'Lunes a Jueves de 9h a 19h',
          line3: 'Viernes de 9h a 18h'
        },
        data: {
          bodyLines: ['line1', 'line2', 'line3'],
          headerConfig: {
            showBack: true,
            showContactUs: false
          },
          stepperConfig: {
            label: { value: 'header', type: 'literal' }
          }
        }
      }
    },
    {
      pageId: 'apology-screen',
      configuration: {
        literals: {
          body: 'Lo sentimos, no podemos ofrecerte el seguro que necesitas en esta ocasión.',
          'footer-next': 'FINALIZAR'
        },
        data: {
          headerConfig: {
            showBack: true,
            showContactUs: false
          }
        }
      }
    },
    {
      pageId: 'is-client-client-name',
      component: 'client-name',
      nextOptionList: [
        {
          nextPageId: 'is-client-client-phone-number'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.IsClientClientName.Header', type: 'translate' },
          name: { value: 'Pages.IsClientClientName.HintName', type: 'translate' },
          surname: { value: 'Pages.IsClientClientName.HintNSurname', type: 'translate' },
          'name-error-required': { value: 'Pages.IsClientClientName.ErrorRequired', type: 'translate' }
        },
        validationSettings: {
          surname: { required: { disabled: true } }
        }
      }
    },
    {
      pageId: 'is-client-client-phone-number',
      component: 'client-phone-number',
      nextOptionList: [
        {
          nextPageId: 'is-client-client-email'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.IsClientClientPhoneNumber.Header', type: 'translate' },
          subheader: { value: 'Pages.IsClientClientPhoneNumber.Subheader', type: 'translate' },
          'phone-number': { value: 'Pages.IsClientClientPhoneNumber.Hint', type: 'translate' },
          'error-required': { value: 'Pages.IsClientClientPhoneNumber.ErrorRequired', type: 'translate' },
          'bad-format': { value: 'Pages.IsClientClientPhoneNumber.BadFormat', type: 'translate' }
        }
      }
    },
    {
      pageId: 'is-client-client-email',
      component: 'client-email',
      nextOptionList: [
        {
          nextPageId: 'is-client-client-identification-number'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.IsClientClientEmail.Header', type: 'translate' },
          'e-mail': { value: 'Pages.IsClientClientEmail.Hint', type: 'translate' },
          'accep-info': { value: 'Pages.IsClientClientEmail.AccepInfo', type: 'translate' }
        },
        validationSettings: {
          acceptPrivacyPolicy: { requiredTrue: { disabled: true } }
        },
        zones: { 'privacy-policy': { skipLoad: true }, 'legal-text': { skipLoad: true } }
      }
    },
    {
      pageId: 'is-client-client-identification-number',
      component: 'client-identification-number',
      nextOptionList: [
        {
          nextPageId: 'is-client-contact-us'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Pages.IsClientClientIdentificationNumber.Header', type: 'translate' },
          subheader: { value: 'Pages.IsClientClientIdentificationNumber.Subheader', type: 'translate' },
          'identification-number': { value: 'Pages.IsClientClientIdentificationNumber.Hint', type: 'translate' },
          'footer-info': { value: 'Pages.IsClientClientIdentificationNumber.FooterInfo', type: 'translate' },
          'error-required': { value: 'Pages.IsClientClientPhoneNumber.ErrorRequired', type: 'translate' },
          'error-nif': { value: 'Pages.IsClientClientIdentificationNumber.ErrorNif', type: 'translate' },
          'error-nie': { value: 'Pages.IsClientClientIdentificationNumber.ErrorNie', type: 'translate' }
        },
        validationSettings: {
          identificationNumber: { required: { disabled: true }, '@isNif': { disabled: true }, '@isNie': { disabled: true } }
        }
      }
    },
    {
      pageId: 'is-client-contact-us',
      component: 'contact-us',
      configuration: {
        literals: {
          header: { value: 'Pages.IsClientContactUs.Header', type: 'translate' },
          subheader: { value: 'Pages.IsClientContactUs.Subheader', type: 'translate' },
          'literal-1': "<h1 class='info-header nx-font-weight-bold'>Horario comercial</h1>",
          'literal-2': 'Lunes a Jueves de 9h a 19h',
          'literal-3': 'Viernes de 9h a 18h'
        },
        data: {
          bodyLines: ['literal-1', 'literal-2', 'literal-3'],
          footerConfig: {
            showNext: false
          },
          headerConfig: {
            showBack: true,
            showContactUs: false
          },
          stepperConfig: {
            label: 'stepper-header',
            showSteps: false
          }
        }
      }
    },
    {
      pageId: 'external-contact-us',
      component: 'contact-us',
      nextOptionList: [
        {
          nextPageId: 'external-contact-time'
        }
      ],
      configuration: {
        literals: {
          header: { value: 'Dinos cómo podemos contactarte', type: 'value' },
          subheader: 'Podemos ayudarte, <br/>¿Quieres que te llamemos?',
          body: 'Podemos llamarte y ayudarte a encontrar el mejor seguro para ti, con las mejores coberturas.',
          line1: "<h1 class='info-header nx-font-weight-bold'>Horario comercial</h1>",
          line2: 'Lunes a Jueves de 9h a 19h',
          line3: 'Viernes de 9h a 18h'
        },
        data: {
          bodyLines: ['line1', 'line2', 'line3'],
          headerConfig: {
            showBack: true,
            showContactUs: false
          },
          stepperConfig: {
            label: { value: 'header', type: 'literal' }
          }
        }
      }
    },
    {
      pageId: 'external-contact-time',
      component: 'contact-time',
      nextOptionList: [
        {
          nextPageId: 'external-contact-us'
        }
      ],
      configuration: {
        literals: {
          afternoon: 'Por la tarde',
          header: 'Nos pondremos en contacto contigo, dinos cuándo',
          morning: 'Por la mañana'
        }
      }
    }
  ],
  links: {
    'contact-us': 'external-contact-us'
  },
  literals: {
    'captcha-header': { value: 'Pages.Captcha.Header', type: 'translate' },
    'journey-title': 'Seguro de coche',
    'bad-format': { value: 'Errors.BadFormat', type: 'translate' },
    'budget-modal-header': 'Datos de tu presupuesto',
    'budget-name': 'Nombre del presupuesto',
    'budget-key': 'Clave del presupuesto',
    'create-budget': 'Crear presupuesto',
    'e-mail': { value: 'Label.Email', type: 'translate' },
    'header-back': { value: 'Label.Back', type: 'translate' },
    'save-budget': 'Guardar presupuesto',
    'retrieve-budget': 'Recuperar presupuesto',
    'store-budget': 'Almacenar presupuesto',
    'quote-copied-to-clipboard':
      'Presupuesto copiado al portapapeles, guardalo en un lugar seguro para poder acceder al mismo en otro momento.',
    'cubic-capacity': { value: 'Label.CubicCapacity', type: 'translate' },
    currency: '€',
    'fee-header': 'Valor de la franquicia',
    'footer-back': { value: 'Label.Back', type: 'translate' },
    'footer-next': { value: 'Label.Next', type: 'translate' },
    fuel: { value: 'Label.Fuel', type: 'translate' },
    'hint-date-format': { value: 'Label.DateFormat', type: 'translate' },
    no: { value: 'Label.No', type: 'translate' },
    'or-more': { value: 'Label.OrMore', type: 'translate' },
    phone: '+49 55 5555 5555',
    power: { value: 'Label.Power', type: 'translate' },
    search: { value: 'Label.Search', type: 'translate' },
    yes: { value: 'Label.Yes', type: 'translate' },
    'we-call-you': { value: 'Label.WeCallYou', type: 'translate' },
    'warning-header-back-button': '¡ Aviso !',
    'warning-text-back-button': 'Usa los botones de la aplicación para desplazarte por ella.',
    'error-required': { value: 'Errors.FieldRequired', type: 'translate' },
    'error-future-date': { value: 'Errors.FutureDate', type: 'translate' },
    'error-past-date': { value: 'Errors.PastDate', type: 'translate' },
    'error-old-date': { value: 'Errors.OldDate', type: 'translate' },
    'error-not-between-dates': { value: 'Errors.NotBetweenDates', type: 'translate' },
    'error-nif': 'El documento no tiene un formato válido',
    'error-nie': 'El documento no tiene un formato válido',
    'terms-and-conditions': { value: 'Footer.TermsAndConditions', type: 'translate' },
    'privacy-policy': { value: 'Footer.PrivacyPolicy', type: 'translate' },
    'legal-notice': { value: 'Footer.LegalNotice', type: 'translate' },
    'cookies-policy': { value: 'Footer.CookiesPolicy', type: 'translate' }
  }
};
