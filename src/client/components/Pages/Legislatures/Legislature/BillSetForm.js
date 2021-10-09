import React, { useEffect, useState } from "react";

export default function BillSetForm({ billSetInformation, formData, setFormData }) {
  const addInputFormData = (inputName, inputValue) => {
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, newValue: { inputName, inputValue }, constitutional: billSetInformation.constitutional });
  };

  const changeBillOption = (inputValue) => {
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, option: inputValue, constitutional: billSetInformation.constitutional });
  };

  useEffect(() => {
    console.log("rerender", billSetInformation.action);
    setFormData({ type: billSetInformation.type, action: billSetInformation.action, constitutional: billSetInformation.constitutional });
    console.log(billSetInformation);
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
      default:
        return "Unknown Bill Type";
    }
  } else {
    return <b>Bill Set Option has No Type</b>;
  }
}
