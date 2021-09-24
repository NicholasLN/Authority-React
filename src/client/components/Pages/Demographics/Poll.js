import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import Body from "../../Structure/Body";
import DemographicTable from "./Table/DemographicTable";
import Dropzone from "react-dropzone";

function Poll(props) {
  try {
    var [pollData, setPollData] = useState(props.history.location.state.pollData);
  } catch (Exception) {
    var [pollData, setPollData] = useState(undefined);
  }

  useEffect(() => {}, [pollData]);

  async function loadPoll([file]) {
    const updatedFile = new Blob([file], { type: file.type });
    var json = await (await updatedFile.text()).toString();
    setPollData(await JSON.parse(json));
  }

  return (
    <Body middleColWidth="11">
      <br />
      <Dropzone onDrop={loadPoll}>
        {({ getRootProps, getInputProps }) => (
          <div className="row" {...getRootProps()}>
            <input {...getInputProps()} />
            {pollData == undefined ? (
              <div>
                <button className="btn btn-primary">Load Poll JSON</button>
              </div>
            ) : (
              <>
                <div className="col-md-7">
                  <div className="row">
                    <div className="col">
                      <h2>Who You Polled</h2>
                      <DemographicTable data={pollData.demoArray} />
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="row">
                    <div className="col">
                      <h2>Poll Data</h2>
                      <table className="table table-striped">
                        <thead className="dark">
                          <tr>
                            <th>Variable</th>
                            <th>Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Margin of Error</td>
                            <td>±{pollData.marginOfError}</td>
                          </tr>
                          <tr>
                            <td>Mean Approval</td>
                            <td>{pollData.mean.toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td>Sample Size</td>
                            <td>{pollData.sampleSize}</td>
                          </tr>
                          <tr>
                            <td>Confidence Level</td>
                            <td>
                              <span data-tip={`You are ${pollData.confidence}% sure that the poll data here presented is accurate.`}>
                                {pollData.confidence.toFixed(2)}% ({pollData.zScore})
                              </span>
                              <ReactTooltip />
                            </td>
                          </tr>
                          <tr>
                            <td>Standard Deviation</td>
                            <td>{pollData.standardDeviation.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>

                      <h2>Poll Question/Respondents</h2>
                      <table className="table table-striped">
                        <thead className="dark">
                          <tr>
                            <td>Answer</td>
                            <td>Respondents</td>
                            <td>Percent</td>
                            <td>Margin of Error</td>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(pollData.questionArray).map((value, idx) => {
                            console.log(pollData.questionArrayMOE);
                            return (
                              <tr key={idx}>
                                <td>{value}</td>
                                <td>{pollData.questionArray[value]}</td>
                                <td>{((pollData.questionArray[value] / pollData.sampleSize) * 100).toFixed(2)}</td>
                                <td>±{(pollData.questionArrayMOE[value] * 100).toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Dropzone>
    </Body>
  );
}

export default withRouter(Poll);
