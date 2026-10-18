export const state = {
  key: 'new-journey',
  id: 'new-journey',
  name: 'new-journey',
  version: 'v1.0.0',
  breakingchange: '',
  title: 'new-journey-title',
  titleType: 'literal',
  homePageId: 'home',
  pages: [
    {
      pageId: 'home',
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
  collapsedSteppers: {},
  flowExtrasRaw: '',
  stepperExtras: {},
  stepperStateInfo: {},
  catalog: undefined
};
