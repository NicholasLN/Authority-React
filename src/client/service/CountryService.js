import axios from "axios";

class CountrySrvc {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }
  fetchCountryInfo(countryId) {
    return this.auth
      .get(`/countryinfo/fetchCountryInfo/${countryId}`)
      .then((response) => response.data)
      .catch((err) => console.error(err));
  }
}
const CountryService = new CountrySrvc();
export default CountryService;
