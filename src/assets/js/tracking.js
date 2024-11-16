(function () {
  window._satellite = window._satellite || {};

  _satellite.track = function (event, data) {
    try {
      var digitalData = globalThis.digitalData ?? {};

      digitalData = data ? Object.assign(digitalData, data) : digitalData;

      console.group('Track event:', event);
      data && console.log('Track info:', data);
      console.log('Track digital data:', digitalData);
      console.groupEnd();
    } catch (error) {
      console.error('TrackError:', error.message);
    }
  };
})();
