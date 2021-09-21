/**
 * Calculates the sum population of the specified demographic set.
 * @param {Array} demoSet
 */
function demoSetPopulation(demoSet) {
  var value = 0;
  demoSet.map((demographic) => {
    value += demographic.population;
  });
  return value;
}

module.exports = {
  demoSetPopulation,
};
