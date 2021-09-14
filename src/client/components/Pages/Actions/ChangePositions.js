import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import AuthorizationService from "../../../service/AuthService";
import { AlertContext } from "../../../context/AlertContext";
import { EconomicPositionDropdown, SocialPositionDropdown } from "../../Misc/positionDropdown";

export default function ChangePositionAction() {
  const { register, handleSubmit } = useForm();
  const { setAlert, setAlertType } = useContext(AlertContext);

  const handleChangePositions = () => {
    handleSubmit(async (data) => {
      var body = {
        newEcoPos: data.ecoPos,
        newSocPos: data.socPos,
      };
      var newUserInfo = await AuthorizationService.changePositions(body);
      if (!newUserInfo.hasOwnProperty("error")) {
        setAlert("Successfully changed positions.");
        setAlertType("success");
      } else {
        setAlert("" + newUserInfo.error);
      }
    })();
  };
  return (
    <tr>
      <td>Change Positions</td>
      <td>
        <select {...register("ecoPos")} className="form-control mt-0" defaultValue={0}>
          <EconomicPositionDropdown />
        </select>
        <select {...register("socPos")} className="form-control mt-0" defaultValue={0}>
          <SocialPositionDropdown />
        </select>
      </td>
      <td>
        <button className="btn btn-primary" onClick={handleChangePositions}>
          Change Positions
        </button>
      </td>
    </tr>
  );
}
