import React from "react";

export default function RolePermissionRadio({ onChange }) {
  return (
    <div className="row" style={{ textAlign: "left" }}>
      <div className="col-sm-4">
        <input onClick={onChange} value="sendFunds" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Send Funds</label>
      </div>
      <div className="col-sm-4">
        <input onClick={onChange} value="feeChange" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Fee Change</label>
      </div>
      <div className="col-sm-4">
        <input onClick={onChange} value="delayVote" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Delay Party Votes</label>
      </div>
      <div className="col-sm-4">
        <input onClick={onChange} value="purgeMembers" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Purge Members</label>
      </div>
      <div className="col-sm-4">
        <input onClick={onChange} value="approveFundingReq" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Approve Funding Req</label>
      </div>
      <div className="col-sm-4">
        <input onClick={onChange} value="makePartyAnnouncements" className="form-check-input" type="checkbox" />
        <label className="form-check-label">Make Party Announcements</label>
      </div>
    </div>
  );
}
