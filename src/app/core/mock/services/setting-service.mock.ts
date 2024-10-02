import { Configuration } from '../../models';

export class SettingServiceMock {
  public configuration: Configuration = {
    homePageId: 'on-boarding',
    pageMap: {
      'on-boarding': {
        pageId: 'on-boarding',
        route: 'on-boarding',
        nextOptionList: [
          {
            nextPageId: 'is-client'
          }
        ]
      },
      'is-client': {
        pageId: 'is-client',
        route: 'is-client',
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
      'contact-us': {
        pageId: 'contact-us',
        route: 'contact-us',
        configuration: {
          literals: {
            header: '¡Qué sorpresa!',
            subheader: 'Actualmente no podemos hacer seguros con esas condiciones.',
            body: 'Para cualquier consulta:'
          }
        }
      },
      'personal-data': {
        pageId: 'personal-data',
        route: 'personal-data'
      }
    }
  };
}
