import axios from "axios";

class PatronHelper {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }
  getPatrons() {
    return this.auth
      .get("/userInfo/getPatrons")
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
}
const PatronService = new PatronHelper();
export default PatronService;
