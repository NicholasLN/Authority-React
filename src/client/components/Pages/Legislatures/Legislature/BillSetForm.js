import React, { useContext, useEffect, useState } from "react";
import PoliticianSearch from "../../../Misc/PoliticianSearch";
import { UserContext } from "./../../../../context/UserContext";

export default function BillSetForm({ billSetInformation, legislatureInfo, formData, setFormData }) {
  const { playerData } = useContext(UserContext);

  const addInputFormData = (inputName, inputValue) => {
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, newValue: { inputName, inputValue }, constitutional: billSetInformation.constitutional });
  };

  const changeBillOption = (inputValue) => {
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, option: inputValue, constitutional: billSetInformation.constitutional });
  };

  const appointChangeSelect = (e) => {
    var newFormData = formData;
    newFormData.appointee = e;
    setFormData(newFormData);
  };

  useEffect(() => {
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, constitutional: billSetInformation.constitutional });
  }, [billSetInformation.action]);

  if (billSetInformation.hasOwnProperty("type")) {
    switch (billSetInformation.type) {
      case "optionSelect":
        return (
          <>
            <select
              className="form-control"
              onChange={(e) => {
                changeBillOption(e.target.value);
              }}
              defaultValue={-1}
            >
              <option value=""></option>
              {billSetInformation.options.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </>
        );
      case "inputBill":
        return (
          <>
            {billSetInformation.inputOptions.map((option, index) => {
              return (
                <input
                  className="form-control"
                  key={index}
                  type={option.type}
                  name={option.inputName}
                  placeholder={option.placeholder}
                  defaultValue={0}
                  onInput={(e) => {
                    addInputFormData(option.inputName, e.target.value);
                  }}
                />
              );
            })}
          </>
        );
      case "appointPosition":
        return (
          <>
            <select className="form-control" onChange={(e) => setFormData({ type: "appointPosition", action: "appointPosition", office: e.target.value, appointee: null })}>
              <option value=""></option>
              {legislatureInfo.appoints.map((appoint, index) => {
                if (appoint.members < appoint.numElected) {
                  return (
                    <option key={index} value={appoint.id}>
                      {appoint.officeName}
                    </option>
                  );
                }
              })}
            </select>
            <PoliticianSearch onChange={appointChangeSelect} country={playerData.nation} active={true} />
          </>
        );
      default:
        return "Unknown Bill Type";
    }
  } else {
    return <b>Bill Set Option has No Type</b>;
  }
}
