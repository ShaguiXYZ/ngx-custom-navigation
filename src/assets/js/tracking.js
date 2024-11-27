(function () {
  window._satellite = window._satellite || {};

  _satellite.track = function (event, data) {
    try {
      var digitalData = data ?? globalThis.digitalData ?? {};

      localStorage.setItem('QUOTE_DIGITALDATA', JSON.stringify(digitalData));
    } catch (error) {
      console.error('TrackError:', error.message);
    }
  };
})();
