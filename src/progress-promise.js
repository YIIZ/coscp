function progressPromise(promises, tickCallback) {
  const total = promises.length;
  let progress = 0;

  function tick(promise) {
    promise.then(() => {
      progress++;
      tickCallback(progress, total);
    });
    return promise;
  }

  return Promise.all(promises.map(tick));
}

module.exports = progressPromise;
