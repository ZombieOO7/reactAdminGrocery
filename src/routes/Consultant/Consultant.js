import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  displayLog,
  apiCall,
  capitalizeFirstLetter,
  confirmBox,
} from "../../util/common";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import { Col, Row, CardBody } from "reactstrap";

const ConsultantListing = () => {
  const [list, setList] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getConsultantListing();
  }, [page_no]);

  useEffect(() => {
    getConsultantListing();
  }, []);

  const getConsultantListing = async () => {
    let req_data = {
      page_no: page_no,
      limit: limit,
    };
    let { code, data } = await apiCall("POST", "getAllConsultant", req_data);
    const { Consultant, total } = data;
    if (code == 1) {
      setList(Consultant);
      setTotal(total);
      setLoading(false);
    } else {
      setList([]);
      setTotal([]);
      setLoading(false);
    }
  };

  const opnAddNewUserModal = () => {
    history.push("/app/Consultant/AddEditConsultant");
  };

  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };

  const handleNameChange = (e) => {
    setSearchByname(e.target.value);
    setPageNo(1);
  };

  const handleDelete = async (item) => {
    const { name, consultant_id } = item;
    if (
      await confirmBox(
        capitalizeFirstLetter(name === null ? "" : name),
        `Are you sure you want to delete`
      )
    ) {
      let reqData = {
        consultant_id: consultant_id,
      };
      let { code } = await apiCall("POST", "deleteConsultantById", reqData);
      if (code == 1) {
        getConsultantListing();
        displayLog(code, "Consultant has been successfully deleted");
      } else {
        setLoading(false);
      }
    } else {
    }
  };

  const handleRedirection = () => {
    history.push({ pathname: "/app/Consultant/AddEditConsultant" });
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Consultant Management</h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col
                  sm="6"
                  md="3"
                  className="mb-3 mb-xl-0"
                  style={{ position: "relative", right: "0" }}
                >
                  <div className="ml-2">
                    {/* {loading == false ? (
                      <>
                        {list?.length <= 0 ? (
                          <button
                            className="exportbutton"
                            onClick={handleRedirection}
                            style={{ width: "225px" }}
                          >
                            <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                            Add New Consultant
                          </button>
                        ) : null}
                      </>
                    ) : null} */}
                    <button
                      className="exportbutton"
                      onClick={handleRedirection}
                      style={{ width: "225px" }}
                    >
                      <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Consultant
                    </button>
                  </div>
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
                    <th className="table__header">Name </th>
                    <th className="table__header">Email </th>
                    <th className="table__header">Image</th>
                    <th className="table__header">Type</th>
                    <th className="table__header">Calendly URL</th>
                    <th className="table__header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true ? null : (
                    <>
                      {list?.length > 0 ? (
                        list.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td>
                              {item.name
                                ? capitalizeFirstLetter(item.name)
                                : "--"}
                            </td>
                            <td style={{ textTransform: "lowercase" }}>
                              {item.email ? item.email : "--"}
                            </td>
                            <td>
                              {item.image == "" ? (
                                <div>
                                  <img
                                    src={require("../../assets/avatars/user-icons@3x.png")}
                                    alt="default iamge"
                                    className="listimages"
                                  />
                                </div>
                              ) : (
                                <img
                                  src={item.image}
                                  alt={`${item.name}`}
                                  className="listimages"
                                />
                              )}
                            </td>
                            <td className="ellipsis12">{item.address}</td>
                            <td
                              className="ellipsis12"
                              style={{ textTransform: "lowercase" }}
                            >
                              {item.calendly_url === null
                                ? "--"
                                : item.calendly_url}
                            </td>

                            <td className="list-action">
                              <Tooltip title="Edit Consultant Account">
                                <Link
                                  to={{
                                    pathname: "Consultant/AddEditConsultant",
                                    search: `?Id=${item.consultant_id}`,
                                  }}
                                >
                                  <i class="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              <Tooltip
                                id="tooltip-fab"
                                title="Delete Consultant Account"
                              >
                                <button
                                  type="button"
                                  className="rct-link-btn"
                                  onClick={() => handleDelete(item)}
                                >
                                  <i class="delete_new zmdi zmdi-delete"></i>
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={11} style={{ textTransform: "none" }}>
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
                {list.length > 0 ? (
                  <tfoot className="border-top">
                    <tr>
                      <td colSpan="100%" className="Align">
                        <ReactPaginate
                          pageCount={Math.ceil(total / limit)}
                          onPageChange={handlePageClick}
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                          containerClassName={"pagination newpagination"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          activeClassName={"active"}
                          forcePage={page_no - 1}
                        />
                      </td>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>
          </div>
        </div>
      </RctCollapsibleCard>
    </div>
  );
};

export default ConsultantListing;
