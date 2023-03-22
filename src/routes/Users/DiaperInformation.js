import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const DiaperInformation = ({ userId }) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [diaperDetails, setDiaperDetails] = useState([]);
  const history = useHistory();
  // const params = queryString.parse(props.location.search);

  useEffect(() => {
    getDiaperDetailByID();
  }, []);

  const getDiaperDetailByID = async () => {
    let req_data = {
      user_id: userId,
    };

    let { code, data } = await apiCall("POST", "diapers-detail", req_data);
    const { diapers } = data;
    if (code == 1) {
      setLoading(false);
      setDiaperDetails(diapers);
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
                  <h2 className="view_detail_sa">View Diaper Information</h2>
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
                    <th className="table__header">Type</th>
                    <th className="table__header">Diaper Situation</th>
                    <th className="table__header">Quantity</th>
                    <th className="table__header">Stool Consistency</th>{" "}
                    <th className="table__header">Stool Colour</th>
                    <th className="table__header">Date</th>
                    <th className="table__header">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {diaperDetails?.length > 0 ? (
                        diaperDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td className="ellipsis12">
                              {item.type ? item.type : "--"}
                            </td>
                            <td className="ellipsis12">
                              {item.diaper_situation_name
                                ? item.diaper_situation_name
                                : "--"}
                            </td>
                            <td className="ellipsis12">
                              {item.quantity ? item.quantity : "--"}
                            </td>
                            <td className="ellipsis12">
                              {item.stool_consistency
                                ? item.stool_consistency
                                : "--"}
                            </td>
                            <td className="ellipsis12">
                              {item.stool_color_name
                                ? item.stool_color_name
                                : "--"}
                            </td>
                            <td>
                              {item.time
                                ? moment(item.time).format("MM/DD/YYYY")
                                : "--"}
                            </td>
                            <td>
                              {item.tracking_time ? item.tracking_time : " --"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={8} style={{ textTransform: "none" }}>
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

export default DiaperInformation;
