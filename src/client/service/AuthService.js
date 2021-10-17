import axios from "axios";

class AuthService {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }
  login(user) {
    return this.auth
      .post("/auth/login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => response.data);
  }
  logout() {
    return this.auth.get("/auth/logout", {}).then((response) => response.data);
  }
  getLoggedInData(partyInfo = "true", stateInfo = "true", sensitive = "false") {
    let url = `/userinfo/getLoggedInUser/${partyInfo}/${stateInfo}/${sensitive}`;
    return this.auth.get(url).then((response) => response.data);
  }
  getSessionData() {
    return this.auth.get("/init").then((response) => response.data.data);
  }
  getUserData(id, partyInfo = "true", stateInfo = "false") {
    let url = `/userinfo/fetchUserById/${id}/${partyInfo}/${stateInfo}`;
    return this.auth
      .get(url)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return "404";
      });
  }
  register(user) {
    console.log(user);
    return this.auth.post("auth/register", user).then((response) => response.data);
  }
  updateUserPicture(file) {
    let data = new FormData();
    data.append("file", file, file.name);

    return this.auth
      .post("imageupload/newUserImg", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((response) => response.data);
  }
  updatePartyPicture(file) {
    let data = new FormData();
    data.append("picture", file, file.name);
    return this.auth
      .post("imageupload/newPartyImg", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((response) => response.data);
  }

  updateUserPictureURL(url) {
    return this.auth.post("auth/setUserImage", { pictureUrl: url }).then((response) => response.data);
  }
  updateUserBio(bio) {
    return this.auth.post("auth/setUserBio", { bio }).then((response) => response.data);
  }
  updateUserSong(songURL, songName) {
    return this.auth.post("auth/setUserSong", { songURL, songName }).then((response) => response.data);
  }
  changePositions(body) {
    return this.auth.post("useractions/changeUserPositions", body).then((response) => response.data);
  }
  userSearch(query, country = "all", active = "true") {
    return this.auth.get(`userinfo/politicianSearch/${query}/${country}/${active}`).then((response) => response.data);
  }
}

const AuthorizationService = new AuthService();
export default AuthorizationService;
