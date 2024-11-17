(function () {
  window._satellite = window._satellite || {};

  _satellite.track = function (event, data) {
    try {
      var digitalData = data ?? globalThis.digitalData ?? {};

      console.log('Track digital data:', event, digitalData);
    } catch (error) {
      console.error('TrackError:', error.message);
    }
  };
})();
