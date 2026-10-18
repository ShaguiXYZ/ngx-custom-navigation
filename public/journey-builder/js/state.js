export const state = {
  key: 'nuevo-journey',
  id: 'nuevo-journey',
  name: 'nuevo-journey',
  version: 'v1.0.0',
  breakingchange: '',
  title: 'nuevo-journey-title',
  titleType: 'literal',
  homePageId: 'inicio',
  pages: [
    {
      pageId: 'inicio',
      component: 'on-boarding',
      extras: {},
      configurationRaw: JSON.stringify(
        {
          literals: {
            'footer-next': { value: 'Pages.CalculateYourInsurance.FooterNext', type: 'translate' },
            header: { value: 'Pages.CalculateYourInsurance.Header', type: 'translate' },
            subheader: { value: 'Pages.CalculateYourInsurance.Subheader', type: 'translate' },
            'coverage-1': { value: 'Pages.CalculateYourInsurance.Coverage-1', type: 'translate' },
            'coverage-2': { value: 'Pages.CalculateYourInsurance.Coverage-2', type: 'translate' },
            'coverage-3': { value: 'Pages.CalculateYourInsurance.Coverage-3', type: 'translate' }
          },
          data: {
            headerConfig: { showBack: false, showContactUs: false },
            stepperConfig: { visible: false }
          }
        },
        null,
        2
      ),
      routes: []
    }
  ],
  steps: [],
  flowExtrasRaw: '',
  stepperExtras: {},
  stepperStateInfo: {},
  catalog: undefined
};
