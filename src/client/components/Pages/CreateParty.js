import React, { useContext } from "react";
import Body from "../Structure/Body";
import { useForm } from "react-hook-form";
import { EconomicPositionDropdown, SocialPositionDropdown } from "../Misc/positionDropdown";
import PartyInfoService from "../../service/PartyService";
import { withRouter } from "react-router";
import { AlertContext } from "../../context/AlertContext";
import { UserContext } from "../../context/UserContext";

function CreateParty(props) {
  const { setAlert, setAlertType } = useContext(AlertContext);
  const { playerData, setPlayerData, refresh, setRefresh } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    var newInfo = await PartyInfoService.createParty(data);
    if (newInfo) {
      if (newInfo.hasOwnProperty("error")) {
        setAlert(newInfo.error);
      } else {
        const { newUserInfo, newPartyInfo } = newInfo;
        setPlayerData(newUserInfo);
        setRefresh(refresh + 1);
        setAlert("Party successfully made!");
        setAlertType("success");
        props.history.push(`/party/${newPartyInfo.id}/overview`);
      }
    }
  };

  return (
    <Body middleColWidth="8">
      <br />
      <hr />
      <h3>Create a Political Party</h3>
      <p>
        Political Parties in Authority are the foundation towards any political success. By working together to achieve common goals, you're more likely to succeed.
        <br />
        So, <b className="bold">make a party today!</b>
      </p>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="table table-striped table-responsive">
          <thead className="dark">
            <tr>
              <th style={{ width: "25%" }}>Required Field</th>
              <th style={{ width: "75%" }}>Input</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Party Name</td>
              <td>
                <input {...register("partyName", { required: true })} className="form-control" type="input" placeholder="Party Name" />
                {errors.partyName && <span>Party name is required.</span>}
              </td>
            </tr>
            <tr>
              <td>Base Economic Positions</td>
              <td>
                <select {...register("partyEcoPosition")} className="form-control" defaultValue={"0"}>
                  <EconomicPositionDropdown />
                </select>
              </td>
            </tr>
            <tr>
              <td>Base Social Positions</td>
              <td>
                <select {...register("partySocPosition")} className="form-control" defaultValue={"0"}>
                  <SocialPositionDropdown />
                </select>
              </td>
            </tr>
            <tr>
              <td>
                Leader Title
                <br />
                <span className="bold">
                  Default: <u>Chairman</u>
                </span>
              </td>
              <td>
                <input {...register("chairTitle")} className="form-control" type="input" placeholder="Chair Title" />
              </td>
            </tr>
            <tr>
              <td>
                # of Votes
                <br />
                <span className="bold">Default: 250</span>
              </td>
              <td>
                <input {...register("votes")} className="form-control" placeholder="250" max={1000} type="number" />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" className="btn btn-primary" value="Create Party (costs 50 AUTHORITY)" />
      </form>
    </Body>
  );
}

export default withRouter(CreateParty);
