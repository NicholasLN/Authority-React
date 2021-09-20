import axios from "axios";
class PartyService {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }

  fetchPartyById(partyID) {
    let url = `/partyinfo/fetchPartyById/${partyID}`;
    return this.auth
      .get(`/partyinfo/fetchPartyById/${partyID}`)
      .then((response) => response.data)
      .catch((err) => console.log(err));
  }
  fetchRoleList(partyID) {
    let url = `/partyinfo/partyRoleList/${partyID}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchPartyLeader(partyID) {
    let url = `/partyinfo/partyLeaderInfo/${partyID}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchPartyMembers(partyID, results = 0) {
    let url = `/partyinfo/partyMembers/${partyID}/${results}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchParties(country, mode = "active", page = 0, query) {
    let url = `/partyinfo/fetchPoliticalParties/${country}/${mode}/${page}/${query}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchMemberCount(partyID) {
    let url = `/partyinfo/partyMemberCount/${partyID}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  createParty(formData) {
    let url = `/partyactions/createParty`;
    return this.auth
      .post(url, formData)
      .then((response) => response.data)
      .catch((err) => err);
  }
  voteForMember(voteForID) {
    let url = `/partyactions/changePartyVote/${voteForID}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  leaveParty() {
    let url = `/partyactions/leaveParty`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchPartyVotes(partyID, lowerLimit = 0, upperLimit = 10) {
    let url = `/partyvoteinfo/fetchVotes/${partyID}/${lowerLimit}/${upperLimit}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  joinParty(partyId) {
    let url = `/partyactions/joinParty/${partyId}`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  claimLeadership() {
    let url = `/partyactions/claimPartyLeadership`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  resignLeadership() {
    let url = `/partyactions/resignFromRole`;
    return this.auth
      .get(url)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  searchPartyMembers(partyID, userQuery, active = true, hasRole = false, selectSearch = true) {
    let url = `/partyinfo/searchUsersInParty`;
    var body = {
      party: partyID,
      searchQuery: userQuery,
      active: active,
      hasRole: hasRole,
      selectSearch: selectSearch,
    };
    return this.auth
      .post(url, body)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  createPartyRole(body) {
    console.log(body);
    let url = `/partyactions/createPartyRole`;
    return this.auth
      .post(url, body)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  updatePartyPicture(file) {
    let data = new FormData();
    data.append("file", file, file.name);
    return this.auth
      .post("imageupload/newPartyImg", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((response) => response.data);
  }
  createPartyVote(body) {
    return this.auth
      .post("partyvoteactions/createPartyVote", body)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  getPartyVote(id) {
    return this.auth
      .get(`partyvoteinfo/getVote/${id}`)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  voteNay(voteId, partyId) {
    return this.auth
      .post("/partyvoteactions/voteNay", { voteId: voteId, partyId: partyId })
      .then((response) => response.data)
      .catch((err) => "error");
  }
  voteAye(voteId, partyId) {
    return this.auth
      .post("/partyvoteactions/voteAye", { voteId: voteId, partyId: partyId })
      .then((response) => response.data)
      .catch((err) => "error");
  }
  delayVote(voteId, partyId) {
    return this.auth
      .post("/partyvoteactions/delayVote", { voteId, partyId })
      .then((response) => response.data)
      .catch((err) => "error");
  }
  changePartyBio(partyId, newBio) {
    return this.auth
      .post("/partyactions/updatePartyBio", { partyId: partyId, newBio: newBio })
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchCommitteeChartData(partyId) {
    return this.auth
      .get(`/partyinfo/committeePieChart/${partyId}`)
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  fetchTreasuryData(partyId, lowerLimit = 0, upperLimit = 10) {
    return this.auth
      .get(`/partyinfo/getFundingRequests/${partyId}/${lowerLimit}/${upperLimit}`)
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  submitNewFundRequest(requestAmount, requestReason) {
    return this.auth
      .post("/partyactions/createFundRequest", { requestAmount, requestReason })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  approveFundingReq(requestId, partyId) {
    return this.auth
      .post("/partyactions/approveFundingReq", { requestId, partyId })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  denyFundingReq(requestId, partyId) {
    return this.auth
      .post("/partyactions/denyFundingReq", { requestId, partyId })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  donateMoney(moneyAmount, partyId) {
    return this.auth
      .post("/partyactions/donateMoney", { moneyAmount })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
  sendMoney(sendTo, sendAmount) {
    return this.auth
      .post("/partyActions/sendMoney", { sendTo, sendAmount })
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
}
const PartyInfoService = new PartyService();
export default PartyInfoService;
