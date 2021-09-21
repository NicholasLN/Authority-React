import React, { useState, useEffect, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import PartyInfoService from "../../../../service/PartyService";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { AlertContext } from "../../../../context/AlertContext";

export default function CreateRoleForm({ partyInfo, updatePartyInfo }) {
  const debounced = useDebouncedCallback((value) => updateRoleSearchOptions(value), 300);
  const [roleSearchOptions, setRoleSearchOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const { setAlert, setAlertType } = useContext(AlertContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updateRoleSearchOptions = async (value = "") => {
    var searchText = value;
    var results = await PartyInfoService.searchPartyMembers(partyInfo.id, searchText);
    setRoleSearchOptions(results);
  };
  const handleCreateRole = () => {
    handleSubmit(async (data) => {
      if (selectedUser) {
        data.roleOccupant = selectedUser;
      } else {
        data.roleOccupant = 0;
      }
      data.partyId = partyInfo.id;
      var newPartyInfo = await PartyInfoService.createPartyRole(data);
      if (newPartyInfo.hasOwnProperty("error")) {
        setAlert(newPartyInfo.error);
      } else {
        setAlert("Role successfully created.");
        setAlertType("success");
        updatePartyInfo(newPartyInfo);
      }
    })();
  };
  useEffect(() => {
    async function fetchData() {
      await updateRoleSearchOptions();
    }
    fetchData();
  }, [partyInfo]);

  return (
    <tr>
      <td>
        <b>Create new party position</b>
      </td>
      <td>
        <div className="row">
          <div className="col-sm">
            <input {...register("createRoleName", { required: true })} className="form-control" type="input" placeholder="Role Name (25 char. max)" />
            {errors.createRoleName && <span>Role name required</span>}
          </div>
          <div className="col-sm">
            <input type="input" placeholder="Search for user." className="form-control" onChange={(e) => debounced(e.target.value)} />
            <Select options={roleSearchOptions} onChange={(e) => setSelectedUser(e.value)} />
          </div>
        </div>
        <div className="row">
          <hr style={{ marginBottom: "0" }} />
          <h6 style={{ margin: "8px 0px 8px 0px" }}>Role Permissions (can only choose 3)</h6>
          <hr />
          <div className="row" style={{ textAlign: "left" }}>
            <div className="col-sm-4">
              <input {...register("perms.sendFunds")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Send Funds</label>
            </div>
            <div className="col-sm-4">
              <input {...register("perms.feeChange")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Fee Change</label>
            </div>
            <div className="col-sm-4">
              <input {...register("perms.delayVote")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Delay Party Votes</label>
            </div>
            <div className="col-sm-4">
              <input {...register("perms.purgeMembers")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Purge Members</label>
            </div>
            <div className="col-sm-4">
              <input {...register("perms.approveFundingReq")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Approve Funding Req</label>
            </div>
            <div className="col-sm-4">
              <input {...register("perms.makePartyAnnouncements")} className="form-check-input" type="checkbox" />
              <label className="form-check-label">Make Party Announcements</label>
            </div>
          </div>
        </div>
      </td>
      <td>
        <button className="btn btn-primary" onClick={handleCreateRole}>
          Create Role
        </button>
      </td>
    </tr>
  );
}
