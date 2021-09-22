import React, { useEffect, useState } from "react";
import StateInfoService from "./../../service/StateService";
import Select from "react-select";

const styles = {};

export default function StateDropdown(props) {
  const [states, setStates] = useState([]);

  async function fetchStates() {
    let activeStates = await StateInfoService.activeStates();
    var options = [];
    Object.keys(activeStates).forEach(function (k) {
      let stateAbbrv = activeStates[k].abbreviation;
      let stateName = activeStates[k].name;
      var obj = { value: stateAbbrv, label: stateName };
      options.push(obj);
    });
    setStates(options);
  }

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <div className="react-select form-control p-0">
      <Select styles={styles} options={states} onChange={props.onChange} />
    </div>
  );
}
