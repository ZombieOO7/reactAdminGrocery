import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  apiCall,
  capitalizeFirstLetter,
  displayLog,
  confirmBox,
  tConvert,
} from "../../util/common";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import { Col, Row, CardBody } from "reactstrap";

const MilestoneListing = () => {
  const [list, setList] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getMilestoneListing();
  }, [page_no]);

  const getMilestoneListing = async () => {
    let req_data = {
      page_no: page_no,
      limit: limit,
    };
    let data = await apiCall("POST", "getMilestoneListing", req_data);
    if (data.code == 1) {
      setList(data.data.Milestone);
      setTotal(data.data.total);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };

  const handleChange = () => {
    history.push({ pathname: "/app/Milestone/AddEditMilestone" });
  };

  const handleDelete = async (item) => {
    const { milestone_id, name } = item;
    if (
      await confirmBox(
        capitalizeFirstLetter(name),
        `Are you sure you want to delete`
      )
    ) {
      let reqData = {
        milestone_id: milestone_id,
      };
      let { code } = await apiCall("POST", "deleteMilestoneById", reqData);

      if (code == 1) {
        getMilestoneListing();
        displayLog(code, "Milestone has been successfully deleted");
      } else {
        setLoading(false);
      }
    } else {
    }
  };
  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Milestones Management</h1>

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
                    <button
                      className="exportbutton"
                      onClick={handleChange}
                      style={{ color: "white", width: "225px" }}
                    >
                      <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Milestone
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
                    <th className="table__header">Name</th>
                    <th className="table__header">Description</th>
                    <th className="table__header">Image</th>
                    <th className="table__header">Age Range</th>
                    <th className="table__header">Actions</th>
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
                              {capitalizeFirstLetter(
                                item.name ? item.name : "--"
                              )}
                            </td>
                            <td className="ellipsis12">
                              {item.description ? item.description : "--"}
                            </td>
                            <td>
                              {item.image == null ? (
                                "--"
                              ) : (
                                <img
                                  src={item.image}
                                  alt={`${item.name}`}
                                  className="listimages"
                                />
                              )}
                            </td>
                            <td>{item.range_name ? item.range_name : "--"}</td>

                            <td className="list-action">
                              <Tooltip title="Edit Milestone">
                                <Link
                                  to={{
                                    pathname: "Milestone/AddEditMilestone",
                                    search: `?Id=${item.milestone_id}`,
                                  }}
                                >
                                  <i class="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              <Tooltip
                                id="tooltip-fab"
                                title="Delete Milestone"
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

export default MilestoneListing;
