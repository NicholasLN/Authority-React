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
  fetchVote(voteId) {
    return this.auth
      .get(`/legislatureinfo/fetchVote/${voteId}`)
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  voteAye(voteId) {
    return this.auth
      .post(`/legislatureactions/voteAye`, { voteId })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  voteNay(voteId) {
    return this.auth
      .post(`/legislatureactions/voteNay`, { voteId })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
}
const LegislatureService = new LegislatureSrvc();
export default LegislatureService;
