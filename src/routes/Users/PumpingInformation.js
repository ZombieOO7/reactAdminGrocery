import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const PumpingInformation = ({ userId }) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [pumpingDetails, setPumpingDetails] = useState([]);
  const history = useHistory();
  // const params = queryString.parse(props.location.search);

  useEffect(() => {
    getPumpingById();
  }, []);

  const getPumpingById = async () => {
    let req_data = {
      user_id: userId,
    };

    let { code, data } = await apiCall("POST", "getPumpingById", req_data);
    const { pumpings } = data;
    if (code == 1) {
      setLoading(false);
      setPumpingDetails(pumpings);
    } else {
      setLoading(false);
    }
  };

  const goToUserDetail = () => {
    history.push(`/app/Details?Id=${params.Id}`);
  };

  return (
    <div>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col sm="12" md="3" className="mb-3 mb-xl-0">
                  <h2 className="view_detail_sa">View Pumping Information</h2>
                </Col>
              </Row>
            </CardBody>
          </Col>
        </Row>
        <div className="table-responsive">
          <div className="table-responsive">
            <div className="unseen">
              <table className="table table-middle table-hover mb-0">
                <thead>
                  <tr>
                    <th className="table__header">Sr.No.</th>
                    <th className="table__header">Right Ounces(OZ)</th>
                    <th className="table__header">Left Ounces(OZ)</th>
                    <th className="table__header">Date</th>
                    <th className="table__header">Time</th>
                    {/* <th className="table__header">End Date</th> */}
                    {/* <th className="table__header">Duration</th> */}
                    {/* <th className="table__header">Status</th> */}
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {pumpingDetails?.length > 0 ? (
                        pumpingDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td className="ellipsis12">
                              {item.right_ounces !== null
                                ? item.right_ounces
                                : "--"}
                            </td>
                            <td className="ellipsis12">
                              {item.left_ounces !== null
                                ? item.left_ounces
                                : "--"}
                            </td>
                            <td>
                              {item.start_date_time !== null
                                ? moment(item.start_date_time).format(
                                    "MM/DD/YYYY"
                                  )
                                : "--"}
                            </td>
                            <td>{item.start_time ? item.start_time : " --"}</td>
                            {/* <td>
                              {item.end_date_time !== null
                                ? moment(item.end_date_time).format(
                                    "MM/DD/YYYY"
                                  )
                                : "--"}
                            </td>

                            <td>
                              {item.duration !== null ? item.duration : "--"}
                            </td> */}
                            {/* <td>{item.status !== null ? item.status : "--"}</td> */}
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={5} style={{ textTransform: "none" }}>
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RctCollapsibleCard>
    </div>
  );
};

export default PumpingInformation;
