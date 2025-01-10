import { ConfigurationDTO } from 'src/app/core/models';
import { WorkflowManifestId } from 'src/app/library/library-manifest';
import { QuoteModel } from 'src/app/library/models';

export const WORKFLOW: ConfigurationDTO<QuoteModel, WorkflowManifestId> = {
  homePageId: 'calcula-tu-seguro',
  title: { value: 'journey-title', type: 'literal' },
  steppers: [
    {
      steps: [
        {
          label: { value: 'Datos personales' },
          pages: ['is-client', 'place', 'birthdate', 'driving-license-date', 'driving-license-location', 'date-of-issue']
        },
        {
          label: { value: 'Datos del vehículo.' },
          pages: [
            'vehicle-type',
            'license-plate',
            'your-car-is',
            'vehicle-brand',
            'vehicle-models',
            'vehicle-fuel',
            'vehicle-model-versions',
            'license-year'
          ]
        },
        {
          label: { value: 'Datos del Seguro' },
          pages: ['is-policy-owner', 'insurance-companies', 'time-insurance-holder', 'number-accidents']
        },
        {
          label: { value: 'Datos del Contacto' },
          pages: ['client-name', 'client-phone-number', 'client-email', 'client-identification-number']
        }
      ]
    },
    {
      steps: [
        {
          label: { value: 'Datos del Cliente' },
          pages: [
            'is-client-client-name',
            'is-client-client-phone-number',
            'is-client-client-email',
            'is-client-client-identification-number'
          ]
        },
        {
          label: { value: 'Te llamamos' },
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
          label: { value: 'Como podemos contactarte' },
          pages: ['external-contact-us']
        },
        {
          label: { value: 'Cuando podemos contactarte' },
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
          'footer-next': 'EMPEZAR',
          header: 'Calcular mi seguro',
          subheader: 'Estás a menos de 5 minutos de conseguir el seguro más completo',
          'coverage-1': 'Asistencia en carretera nacional e internacional 24/7',
          'coverage-2': 'Te llevamos el coche de sustitución a tu casa',
          'coverage-3': 'Red de talleres excelentes a tu disposición'
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
          header: '¿Eres cliente de Shagui?'
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
          'postal-code': 'Código postal',
          'error-required': 'El código postal es obligatorio para continuar',
          'error-not-found': 'El código postal no existe',
          header: '¿Cuál es tu código postal?',
          'footer-info': '¿Sabías que ser cliente de Shagui tiene muchas ventajas exclusivas?'
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
          header: '¿Cuándo naciste?',
          'birth-date': 'Fecha de nacimiento',
          'error-required': 'La fecha de nacimiento es obligatoria para continuar',
          'error-old-date': 'El cliente a debe ser mayor de {{value}} años',
          'error-younger-date': 'El cliente a de ser menor de {{value}} años'
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
          header: '¿Cuándo sacaste el carnet de conducir?',
          'issue-date': 'Fecha de emisión',
          'error-min-years-between': 'El carnet de conducir debe tener al menos {{value}} años',
          'error-old-date': 'El cliente debe tener al menos {{value}} años de experiencia en la conducción'
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
          header: '¿Dónde sacaste el carnet de conducir?',
          help: 'Indica lugar de origen donde obtuviste tu primera licencia de condución.',
          'help-header': 'Obtención del carnet',
          eu: 'En Europa',
          uk: 'En Reino Unido',
          other: 'En otro país'
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
          'date-of-issue-label': 'Fecha de contratación',
          header: '¿Cuándo quieres que empiece tu seguro?'
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
          'continue-without-license-plate': 'Continuar sin matrícula',
          'footer-info': 'Facilitando tu matrícula obtendrás tu cotización mucho más rápido',
          header: '¿Cuál es la matrícula de tu coche?',
          'license-plate': 'Matrícula',
          'bad-format': 'El formato de la matrícula no es correcto ({{value}})'
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
          nextPageId: 'is-policy-owner'
        }
      ],
      configuration: {
        literals: {
          'continue-without-car': 'Continuar sin vehículo',
          header: 'Selecciona el modelo'
        },
        data: {
          footerConfig: {
            showNext: false
          }
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
          header: '¿Acabas de comprar tu coche?',
          'vehicle-old': 'No, ya lo tenía',
          'vehicle-new': 'Sí, es nuevo',
          'vehicle-second-hand': 'Sí, es de segunda mano',
          'vehicle-unregistered': 'Es nuevo y todavía no lo he matriculado'
        }
      }
    },
    {
      pageId: 'vehicle-models',
      nextOptionList: [
        {
          nextPageId: 'vehicle-fuel'
        }
      ],
      configuration: {
        literals: {
          header: '¿Qué modelo es tu coche?'
        }
      }
    },
    {
      pageId: 'vehicle-fuel',
      nextOptionList: [
        {
          nextPageId: 'vehicle-model-versions'
        }
      ],
      configuration: {
        literals: {
          'cubic-capacity-not-known': 'No sé la cilindrada',
          header: 'Seleccione sus características',
          'power-not-known': 'No sé la potencia'
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
          header: '¿Y la versión?'
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
          header: '¿En qué año matriculaste tu coche?',
          'year-of-manufacture-label': 'Año de matriculación'
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
          header: '¿Eres o has sido titular de un seguro, para este coche u otro, en los últimos {{days}} días?'
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
          header: '¿Con qué compañía tienes tu seguro actualmente?'
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
          year: '{{value}} año',
          years: '{{value}} años',
          header: '¿Cuánto tiempo llevas como titular de un seguro en esta u otras compañías?',
          'time-desc': '{{value}} {{literal-year}} {{or-more}}'
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
          first: 'Nimguno',
          last: { value: 'or-more', type: 'literal' },
          header: {
            value: '¿Has tenido algún accidente en {{last}}{{last-single}} {{value}} {{years}}{{year}}?',
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
                value: 'los últimos',
                type: 'value',
                conditions: [
                  {
                    expression: 'insuranceCompany.yearsAsOwner',
                    operation: '>',
                    value: 1
                  }
                ]
              },
              'last-single': {
                value: 'el último',
                type: 'value',
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
          'footer-info': 'Nos gustaría acompañarte en tus próximos viajes.'
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
          header: 'Nos gustaría conocerte un poco más',
          name: 'Nombre'
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
          header: '¿Cuál es tu número de teléfono?',
          'phone-number': 'Número de teléfono',
          subheader: 'Sabemos que los seguros a veces son complejos. Por eso, solo te llamaremos para darte asistencia personalizada.'
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
          header: 'Déjanos tu email y recibe tu presupuesto al instante',
          'legal-text': { value: 'Texto legal pendiente definir...', type: 'value' },
          'more-info': 'Quiero recibir información sobre productos y ofertas de Shagui',
          'privacy-policy-text': {
            value: 'He leído y acepto la {{private-policy-a}} de Shagui.',
            type: 'value',
            params: {
              'private-policy-a': {
                value: 'privacy-policy-tag',
                params: {
                  link: { value: 'privacy-policy-link', type: 'literal' },
                  'link-text': 'política de privacidad'
                },
                type: 'literal'
              }
            }
          },
          'privacy-policy-tag': "<a class='link nx-font-weight-bold' href='{{link}}' target='_blank'>{{link-text}}</a>",
          'privacy-policy-link': 'https://www.shagui.com/privacidad'
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
          header: '¿Nos puedes facilitar tu documento de identidad?',
          'identification-number': 'Número de DNI o NIE',
          subheader: 'Solo utilizaremos este dato para darte un presupuesto totalmente personalizado',
          'footer-info': 'Para ofrecerte el mejor seguro es importante verificar tu identidad.'
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
          header: '¡Muchas gracias {{ name }}!',
          subheader: 'Uno de nuestros agentes te llamará a la hora que has solicitado para darte toda la información que necesites.',
          body: '',
          'footer-next': 'FINALIZAR'
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
          'footer-next': 'FINALIZAR'
        },
        data: {
          contactUsTexts: ['Horario comercial', 'Lunes a Jueves de 9h a 19h', 'Viernes de 9h a 18h'],
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
          header: '¿Como te llamas?',
          name: 'Nombre'
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
          header: '¿Cuál es tu número de teléfono?',
          'phone-number': 'Número de teléfono'
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
          header: 'Déjanos tu email y nos pondremos en contacto contigo en breve.',
          'legal-text': { value: 'Texto legal pendiente definir...', type: 'value' },
          'more-info': 'Quiero recibir información sobre productos y ofertas de Shagui',
          'privacy-policy': 'política de privacidad'
        },
        validationSettings: {
          acceptPrivacyPolicy: { requiredTrue: { disabled: true } }
        },
        zones: { '2': { skipLoad: true } }
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
          header: '¿Nos puedes facilitar tu documento de identidad?',
          subheader: 'Solo utilizaremos este dato para darte un presupuesto totalmente personalizado',
          'identification-number': 'Número de documento de identidad',
          'footer-info': 'Para ofrecerte el mejor seguro es importante verificar tu identidad. '
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
          header: 'Información de contacto',
          subheader: 'Nos gustaría poder ayudarte, <br/>¡contactanos!'
        },
        data: {
          contactUsTexts: [
            "<h1 class='info-header nx-font-weight-bold'>Horario comercial</h1>",
            'Lunes a Jueves de 9h a 19h',
            'Viernes de 9h a 18h'
          ],
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
          contactUsTexts: ['line1', 'line2', 'line3'],
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
    'captcha-header': 'Verificación de seguridad. Por favor, selecciona los simbolos rojos.',
    'journey-title': 'Seguro de coche',
    'bad-format': 'Formato incorrecto',
    'budget-modal-header': 'Datos de tu presupuesto',
    'budget-name': 'Nombre del presupuesto',
    'budget-key': 'Clave del presupuesto',
    'create-budget': 'Crear presupuesto',
    'e-mail': 'Correo electrónico',
    'header-back': 'Volver',
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
    'we-call-you': 'Te llamamos',
    'warning-header-back-button': '¡ Aviso !',
    'warning-text-back-button': 'Usa los botones de la aplicación para desplazarte por ella.',
    'error-required': { value: 'Errors.FieldRequired', type: 'translate' },
    'error-future-date': { value: 'Errors.FutureDate', type: 'translate' },
    'error-past-date': { value: 'Errors.PastDate', type: 'translate' },
    'error-old-date': { value: 'Errors.OldDate', type: 'translate' },
    'error-not-between-dates': { value: 'Errors.NotBetweenDates', type: 'translate' },
    'error-nif': 'El documento no tiene un formato válido',
    'error-nie': 'El documento no tiene un formato válido',
    'terms-and-conditions': 'Términos y condiciones',
    'privacy-policy': 'Política de privacidad',
    'legal-notice': 'Aviso legal y privacidad',
    'cookies-policy': 'Política de cookies'
  }
};
