import axios from "axios";
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
}
const DemographicService = new DemographicHelper();
export default DemographicService;
