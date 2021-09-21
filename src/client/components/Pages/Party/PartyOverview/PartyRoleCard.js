import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import ReactTooltip from "react-tooltip";
import { rolePermTooltip } from "../../../../../server/classes/Misc/Methods";

export default React.memo(({ roleInfo }) => {
  return (
    <>
      {roleInfo.roleOccupant != 0 ? (
        <div className="col-sm-4 mt-2">
          <ReactTooltip id={`${roleInfo.roleName}_rolePermissions`} delayShow={500} delayHide={500}>
            <div style={{ textAlign: "left" }}>
              {roleInfo.rolePermissions.length != 0 ? (
                roleInfo.rolePermissions.map((permission, idx) => {
                  return (
                    <span key={idx}>
                      {rolePermTooltip(permission)}
                      <br />
                    </span>
                  );
                })
              ) : (
                <span>Can do nothing LOL</span>
              )}
            </div>
          </ReactTooltip>
          <span>{roleInfo.roleName}</span>
          <div className="mx-auto" style={{ maxWidth: "20%" }}>
            <LinkContainer to={`/politician/${roleInfo.roleOccupant}`}>
              <a>
                <img data-tip data-for={`${roleInfo.roleName}_rolePermissions`} src={roleInfo.occupantPicture} className="img-fluid img-thumbnail" style={{ border: "5px outset grey" }} />
                <h5>{roleInfo.occupantName}</h5>
              </a>
            </LinkContainer>
          </div>
        </div>
      ) : (
        <div className="col-sm-4 mt-2">
          <ReactTooltip id={`${roleInfo.roleName}_rolePermissions`} delayShow={500} delayHide={500}>
            <div style={{ textAlign: "left" }}>
              {roleInfo.rolePermissions.length != 0 ? (
                roleInfo.rolePermissions.map((permission, idx) => {
                  return (
                    <span key={idx}>
                      {rolePermTooltip(permission)}
                      <br />
                    </span>
                  );
                })
              ) : (
                <span>Can do nothing LOL</span>
              )}
            </div>
          </ReactTooltip>
          <span>{roleInfo.roleName}</span>
          <div className="mx-auto" style={{ maxWidth: "20%" }}>
            <img data-tip data-for={`${roleInfo.roleName}_rolePermissions`} src={roleInfo.occupantPicture} className="img-fluid img-thumbnail" style={{ border: "5px outset grey" }} />
            <h5>Vacant</h5>
          </div>
        </div>
      )}
    </>
  );
});
