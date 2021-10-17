import React from "react";
import SelectSearch from "react-select-search";
import "../../css/selectSearch.css";
import AuthorizationService from "../../service/AuthService";

function PoliticianSearch({ onChange, country, active }) {
  const updateRoleSearchOptions = async (value = "") => {
    var searchText = value;
    var results = await AuthorizationService.userSearch(searchText, country, active);
    var arr = results.map((result) => {
      return { value: result.value, name: result.label };
    });
    return arr;
  };
  return (
    <SelectSearch
      options={[]}
      onChange={onChange}
      getOptions={async (query) => {
        var results = await updateRoleSearchOptions(query, country, active);
        return results;
      }}
      search
      placeholder="Politician"
    />
  );
}
export default React.memo(PoliticianSearch);
