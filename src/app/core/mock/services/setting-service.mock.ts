import { Configuration } from '../../models';

export class SettingServiceMock {
  public configuration: Configuration = {
    pageMap: [
      {
        pageId: 'on-boarding',
        route: 'on-boarding',
        title: 'On boarding',
        nextOptionList: [
          {
            nextPageId: 'is-client'
          }
        ]
      },
      {
        pageId: 'is-client',
        route: 'is-client',
        title: 'Eres cliente',
        nextOptionList: [
          {
            nextPageId: 'contact-us',
            conditions: [
              {
                expression: 'client.isClient',
                value: 'true'
              }
            ]
          },
          {
            nextPageId: 'personal-data'
          }
        ]
      },
      {
        pageId: 'contact-us',
        route: 'contact-us',
        title: 'Te llamamos',
        pageConfiguration: {
          header: '¡Qué sorpresa!',
          subheader: 'Actualmente no podemos hacer seguros con esas condiciones.',
          body: 'Para cualquier consulta:'
        }
      },
      {
        pageId: 'personal-data',
        route: 'personal-data',
        title: 'Datos personales'
      }
    ]
  };
}
