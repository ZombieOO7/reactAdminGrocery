import React, { useState, useEffect } from "react";
import RctCollapsibleCard from "../../components/RctCollapsibleCard/RctCollapsibleCard";
import { useHistory, Link } from "react-router-dom";
import {
  apiCall,
  capitalizeFirstLetter,
  displayLog,
  confirmBox,
} from "../../util/common";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import { Col, Row, CardBody } from "reactstrap";

const VideoListing = () => {
  const [list, setList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [searchByName, setSearchByname] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getVideoListing();
  }, [searchByName, pageNo]);

  const getVideoListing = async () => {
    let requestData = {
      page_no: pageNo,
      limit: limit,
    };
    if (searchByName) {
      requestData["search"] = searchByName;
    }
    const { code, message, data } = await apiCall(
      "POST",
      "getVideoListing",
      requestData
    );
    if (code === 1) {
      const { Video, total } = data;
      setList(Video);
      setTotal(total);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };

  const handleRedirection = () => {
    history.push({ pathname: "/app/Video/AddEditVideo" });
  };

  const deleteHandler = async (meditation) => {
    const { name, video_id } = meditation;
    const requestData = { video_id: video_id };
    if (
      await confirmBox(
        capitalizeFirstLetter(name),
        "Are you sure you want to delete"
      )
    ) {
      const { code } = await apiCall("POST", "deleteVideoById", requestData);
      if (code === 1) {
        getVideoListing();
        displayLog(code, "Video has been deleted successfully");
      } else {
        setLoading(false);
      }
    } else {
    }
  };

  const handleNameChange = (e) => {
    setSearchByname(e.target.value);
    setPageNo(1);
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Video Management</h1>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col
                  sm="6"
                  md="6"
                  className="mb-3 mb-xl-0"
                  style={{ position: "relative", right: "0" }}
                >
                  <span className="has-wrapperss">
                    <span className="left_icon_1">
                      <i className="ti-search"></i>
                    </span>
                    <input
                      className="input_default_1"
                      placeholder="Search Video by name, description, category"
                      type="text"
                      value={searchByName}
                      name="searchbyName"
                      onChange={(e) => handleNameChange(e)}
                    />
                  </span>
                </Col>
                <Col
                  sm="6"
                  md="3"
                  className="mb-3 mb-xl-0"
                  style={{ position: "relative", right: "0" }}
                >
                  <div className="ml-2">
                    <button
                      className="exportbutton"
                      onClick={handleRedirection}
                      style={{ color: "white", width: "225px" }}
                    >
                      <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Video
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
                    <th className="table__header">Category</th>
                    <th className="table__header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true ? null : (
                    <>
                      {list?.length > 0 ? (
                        list.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (pageNo - 1) * limit}</td>
                            <td>
                              {capitalizeFirstLetter(
                                item.name ? item.name : "--"
                              )}
                            </td>
                            <td className="ellipsis12">
                              {item.description ? item.description : "--"}
                            </td>
                            <td>
                              {item.image === "" ? (
                                "--"
                              ) : (
                                <img
                                  src={item.image}
                                  alt="Interest Logo"
                                  className="listimages"
                                />
                              )}
                            </td>
                            <td>
                              {item.interest_name ? item.interest_name : "--"}
                            </td>
                            <td className="list-action">
                              <Tooltip title="Edit Video">
                                <Link
                                  to={{
                                    pathname: "Video/AddEditVideo",
                                    search: `?Id=${item.video_id}`,
                                  }}
                                >
                                  <i class="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              <Tooltip id="tooltip-fab" title="Delete Video">
                                <button
                                  type="button"
                                  className="rct-link-btn"
                                  onClick={() => deleteHandler(item)}
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
                          forcePage={pageNo - 1}
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

export default VideoListing;
