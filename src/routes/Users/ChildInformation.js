import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import queryString from "query-string";

const ChildInformation = ({ userId }) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [childDetail, setChildDetail] = useState([]);

  useEffect(() => {
    getChildById();
  }, []);

  const getChildById = async () => {
    let req_data = {
      user_id: userId,
    };

    let { code, data } = await apiCall("POST", "getChildById", req_data);
    const { Childrens } = data;
    if (code == 1) {
      setLoading(false);
      setChildDetail(Childrens);
    } else {
      setLoading(false);
    }
  };

  const handleDropDown = async (e) => {
    await setStatus(e.target.value);
  };

  return (
    <div>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col sm="12" md="3" className="mb-3 mb-xl-0">
                  <h2 className="view_detail_sa">View Child's Information</h2>
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
                    <th className="table__header">Child Name</th>
                    <th className="table__header">Nutrition</th>
                    <th className="table__header">Date Of Birth</th>
                    <th className="table__header">Due Date</th>
                    <th className="table__header">Weight(Lbs)</th>
                    <th className="table__header">Height(Feet)</th>
                    <th className="table__header">View Growth Detail</th>
                    {/* <th className="table__header">View Nursing Detail</th> */}
                    {/* <th className="table__header">View Pumping Detail</th> */}
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {childDetail?.length > 0 ? (
                        childDetail.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td className="ellipsis12">
                              {item.name ? item.name : "--"}
                            </td>
                            <td>{item.nutrition ? item.nutrition : "--"}</td>
                            <td>
                              {item.dob
                                ? moment(item.dob).format("MM/DD/YYYY")
                                : "--"}
                            </td>
                            <td>
                              {item.due_date
                                ? moment(item.due_date).format("MM/DD/YYYY")
                                : "--"}
                            </td>
                            <td>{item.weight ? item.weight : "--"}</td>
                            <td>{item.height ? item.height : "--"}</td>
                            {/* <td>{item.lbs ? item.lbs + " lbs" : "--"}</td>
                            <td>
                              {item.feet ? item.feet + " " + "ft" : "--"}
                              {item.inches ? ", " : null}
                              {item.inches ? item.inches + " " + "in" : null}
                            </td> */}
                            <td
                              style={{
                                cursor: "pointer",
                                color: "#223263",
                                fontWeight: "500",
                              }}
                            >
                              <Tooltip
                                id="tooltip-fab"
                                title="View Growth Details"
                              >
                                <Link
                                  to={{
                                    pathname: "GrowthDetails",
                                    search: queryString.stringify({
                                      Id: userId,
                                      childId: item.child_id,
                                    }),
                                  }}
                                  style={{
                                    color: "#223263",
                                    fontSize: "25px",
                                  }}
                                >
                                  <i className="zmdi zmdi-eye"></i>
                                </Link>
                              </Tooltip>
                            </td>
                            {/* <td
                              style={{
                                cursor: "pointer",
                                color: "#223263",
                                fontWeight: "500",
                              }}
                            >
                              <Tooltip
                                id="tooltip-fab"
                                title="View Nursing Details"
                              >
                                <Link
                                  to={{
                                    pathname: "NursingDetails",
                                    search: queryString.stringify({
                                      Id: userId,
                                      childId: item.child_id,
                                    }),
                                  }}
                                  style={{
                                    color: "#223263",
                                    fontSize: "25px",
                                  }}
                                >
                                  <i className="zmdi zmdi-eye"></i>
                                </Link>
                              </Tooltip>
                            </td>
                            <td
                              style={{
                                cursor: "pointer",
                                color: "#223263",
                                fontWeight: "500",
                              }}
                            >
                              <Tooltip
                                id="tooltip-fab"
                                title="View Nursing Details"
                              >
                                <Link
                                  to={{
                                    pathname: "PumpingDetails",
                                    search: queryString.stringify({
                                      Id: userId,
                                      childId: item.child_id,
                                    }),
                                  }}
                                  style={{
                                    color: "#223263",
                                    fontSize: "25px",
                                  }}
                                >
                                  <i className="zmdi zmdi-eye"></i>
                                </Link>
                              </Tooltip>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={7} style={{ textTransform: "none" }}>
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

export default ChildInformation;
