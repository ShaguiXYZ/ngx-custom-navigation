(function () {
  window._satellite = window._satellite || {};

  _satellite.track = (event, data) => {
    try {
      var digitalData = data ?? globalThis.digitalData ?? {};

      Promise.resolve().then(() => sessionStorage.setItem(`@DIGITALDATA_${event.toUpperCase()}`, JSON.stringify(digitalData)));
    } catch (error) {
      console.error('TrackError:', error.message);
    }
  };
})();
