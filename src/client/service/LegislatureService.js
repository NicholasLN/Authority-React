import axios from "axios";

class LegislatureSrvc {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }
  fetchLegislatures(countryId) {
    return this.auth
      .get(`/legislatureinfo/fetchLegislatures/${countryId}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
  }
  fetchLegislatureVotes(legislatureId) {
    return this.auth
      .get(`/legislatureinfo/fetchLegislatureVotes/${legislatureId}`)
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
}
const LegislatureService = new LegislatureSrvc();
export default LegislatureService;
