import axios from "axios";
import fileDownload from "js-file-download";
class DemographicHelper {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }

  fetchDemographicArray(country, state, race, gender) {
    return this.auth
      .get(`/demographicinfo/fetchDemographics/${country}/${state}/${race}/${gender}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
  }
  generatePoliticalLeanings(type, parseForChart, country, state, race, gender) {
    return this.auth
      .get(`/demographicinfo/generatePoliticalLeanings/${type}/${parseForChart}/${country}/${state}/${race}/${gender}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
  }
  conductPoll(sampleSize, confidenceInterval, country, state, race, gender) {
    confidenceInterval = parseFloat(confidenceInterval.replace("%", ""));
    return this.auth
      .get(`/demographicinfo/pollDemographics/${confidenceInterval}/${sampleSize}/${country}/${state}/${race}/${gender}`)
      .then((response) => {
        fileDownload(JSON.stringify(response.data), "poll.json");
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
const DemographicService = new DemographicHelper();
export default DemographicService;
