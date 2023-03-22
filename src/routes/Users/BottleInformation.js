import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const BottleInformation = ({ userId }) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [bottleDetails, setBottleDetails] = useState([]);
  const history = useHistory();
  // const params = queryString.parse(props.location.search);

  useEffect(() => {
    getBottleInfoByID();
  }, []);

  const getBottleInfoByID = async () => {
    let req_data = {
      user_id: userId,
    };

    let { code, data } = await apiCall("POST", "bottles-detail", req_data);
    const { bottles } = data;
    console.log(bottles);
    if (code == 1) {
      setLoading(false);
      setBottleDetails(bottles);
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
                  <h2 className="view_detail_sa">View Bottle Information</h2>
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
                    <th className="table__header">Date</th>
                    <th className="table__header">Time</th>
                    <th className="table__header">Liquid</th>
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {bottleDetails?.length > 0 ? (
                        bottleDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td>
                              {item.date !== null
                                ? moment(item.date).format("MM/DD/YYYY")
                                : "--"}
                            </td>
                            <td>{item.time ? item.time : " --"}</td>
                            <td className="ellipsis12">
                              {item.liquid_name ? item.liquid_name : "--"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={4} style={{ textTransform: "none" }}>
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

export default BottleInformation;
