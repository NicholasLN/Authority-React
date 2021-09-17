import React from "react";
import SelectSearch from "react-select-search";
import PartyInfoService from "../../service/PartyService";
import "../../css/selectSearch.css";

function PartyMemberSearch({ onChange, partyInfo }) {
  const updateRoleSearchOptions = async (value = "", active = true, hasRole = false) => {
    var searchText = value;
    var results = await PartyInfoService.searchPartyMembers(partyInfo.id, searchText, active, hasRole);
    var arr = results.map((result, idx) => {
      return { value: result.value, name: result.label };
    });
    return arr;
  };
  return (
    <SelectSearch
      options={[]}
      onChange={onChange}
      getOptions={async (query) => {
        var results = await updateRoleSearchOptions(query, true, true);
        return results;
      }}
      search
      placeholder="Politician"
    />
  );
}
export default React.memo(PartyMemberSearch);
