import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const NursingDetails = ({ userId }) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [NursingDetails, setNursingDetails] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getNursingById();
  }, []);

  const getNursingById = async () => {
    let req_data = {
      user_id: userId,
      child_id: userId,
    };

    let { code, data } = await apiCall("POST", "getNursingById", req_data);
    const { Nursing } = data;
    if (code == 1) {
      setLoading(false);
      setNursingDetails(Nursing);
    } else {
      setLoading(false);
    }
  };

  //  boottle ===  date, time, liquid or formula and quantity,

  //    diaper === type, diper situation, quantity, stool consisxtency, stool color, date, time

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
                  <h2 className="view_detail_sa">View Nursing Information</h2>
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
                    <th className="table__header">Start Date</th>
                    <th className="table__header">Start Time</th>
                    <th className="table__header">End Time</th>
                    {/* <th className="table__header">End Date</th> */}
                    <th className="table__header">Duration</th>
                    <th className="table__header">Nursing Type</th>
                    {/* <th className="table__header">Status</th> */}
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {NursingDetails?.length > 0 ? (
                        NursingDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td>
                              {item.start_date_time !== null
                                ? moment(item.start_date_time).format(
                                    "MM/DD/YYYY"
                                  )
                                : "--"}
                            </td>
                            <td>{item.start_time ? item.start_time : "--"}</td>
                            <td>{item.end_time ? item.end_time : "--"}</td>
                            {/* <td>
                              {item.end_date_time !== null
                                ? moment(item.end_date_time).format(
                                    "MM/DD/YYYY"
                                  )
                                : "--"}
                            </td> */}
                            <td>
                              {item.duration !== null ? item.duration : "--"}
                            </td>
                            <td>
                              {item.nursing_type !== null
                                ? item.nursing_type
                                : "--"}
                            </td>
                            {/* <td>{item.status !== null ? item.status : "--"}</td> */}
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={6} style={{ textTransform: "none" }}>
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

export default NursingDetails;
