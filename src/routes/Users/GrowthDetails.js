import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import moment from "moment";
import { Col, Row, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const GrowthDetails = (props) => {
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [growthDetail, setGrowthDetail] = useState([]);
  const history = useHistory();
  const params = queryString.parse(props.location.search);

  useEffect(() => {
    getChildById();
  }, []);

  const getChildById = async () => {
    let req_data = {
      child_id: params.childId,
    };

    let { code, data } = await apiCall("POST", "getGrowthById", req_data);
    const { Growth } = data;
    if (code == 1) {
      setLoading(false);
      setGrowthDetail(Growth);
    } else {
      setLoading(false);
    }
  };

  const goToUserDetail = () => {
    history.push(`/app/Details?Id=${params.Id}`);
  };

  return (
    <div>
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={goToUserDetail}>
            Children Information
          </span>{" "}
          {">"} Child Growth Details{" "}
        </div>
        <button className="cus_btn" onClick={history.goBack}>
          <i className="cus_arr zmdi zmdi-arrow-left"></i>&nbsp;BACK
        </button>
      </h1>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col sm="12" md="3" className="mb-3 mb-xl-0">
                  <h2 className="view_detail_sa">Growth Information</h2>
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
                    <th className="table__header">Weight(Lbs)</th>
                    <th className="table__header">Height(Feet)</th>
                    <th className="table__header">Head Size</th>
                    <th className="table__header">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading === true ? null : (
                    <>
                      {growthDetail?.length > 0 ? (
                        growthDetail.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td>{item.weight ? item.weight : "--"}</td>
                            <td>{item.height ? item.height : "--"}</td>
                            {/* <td>{item.lbs ? item.lbs + " lbs" : "--"}</td>
                            <td>
                              {item.feet ? item.feet + " " + "ft" : "--"}
                              {item.inches ? ", " : null}
                              {item.inches ? item.inches + " " + "in" : null}
                            </td> */}
                            <td>
                              {item.head_size === null ? "--" : item.head_size}
                            </td>
                            <td>
                              {item.date_time
                                ? moment(item.date_time).format("MM/DD/YYYY")
                                : "--"}
                            </td>
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

export default GrowthDetails;
