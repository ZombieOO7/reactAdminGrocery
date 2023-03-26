import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  apiCall,
  capitalizeFirstLetter,
  displayLog,
  confirmBox,
} from "../../util/common";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import { Col, Row, CardBody } from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const InterestListing = () => {
  const [list, setList] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getRequestFormList();
  }, [page_no]);

  const getRequestFormList = async () => {
    let req_data = {
      page_no: page_no,
      limit: limit,
    };
    let { code, data } = await apiCall("POST","getCategoryListings",req_data);
    const { categories, total } = data;
    if (code == 200) {
      setList(categories);
      setTotal(total);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };
  const handleChange = () => {
    history.push({ pathname: "/app/category/addEditCategory" });
  };

  const handleDelete = async (item) => {
    const { _id, name } = item;
    if (
      await confirmBox(
        capitalizeFirstLetter(name),
        `Are you sure you want to delete`
      )
    ) {
      let reqData = {
        _id: _id,
      };
      let data = await apiCall("POST", "deleteCategory", reqData);
      if (data.code == 200) {
        getRequestFormList();
        displayLog(data.code, "Category has been successfully deleted");
      } else {
        setLoading(false);
      }
    } else {
    }
  };
  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Category Management</h1>

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
                      <i className="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Category
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
                      {/* <th
                        className="table__header"
                        style={{ width: "120px", maxWidth: "100%" }}
                      >
                        Change Order
                      </th> */}
                      <th className="table__header">Sr.No.</th>
                      <th className="table__header">Name</th>
                      <th className="table__header">Icon</th>
                      <th className="table__header">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading === true ? null : (
                      <>
                        {list?.length > 0 ? (
                          list.map((item, index) => (
                            <tr key={index}>
                              {/* <td {...provided.dragHandleProps}>
                                        <i className="zmdi zmdi-arrows"></i>
                                      </td> */}
                              <td>{index + 1}</td>
                              <td>
                                {capitalizeFirstLetter(
                                  item.name ? item.name : "--"
                                )}
                              </td>
                              <td>
                                {item.image == null ? (
                                  "--"
                                ) : (
                                  <img
                                    src={item.image}
                                    alt="Image"
                                    className="listimages"
                                  />
                                )}
                              </td>
                              <td className="list-action">
                                <Tooltip title="Edit Category">
                                  <Link
                                    to={{
                                      pathname:
                                        "category/addEditCategory",
                                      search: `?Id=${item._id}`,
                                    }}
                                  >
                                    <i className="delete_new zmdi zmdi-edit"></i>
                                  </Link>
                                </Tooltip>
                                <Tooltip
                                  id="tooltip-fab"
                                  title="Delete Category"
                                >
                                  <button
                                    type="button"
                                    className="rct-link-btn"
                                    onClick={() => handleDelete(item)}
                                  >
                                    <i className="delete_new zmdi zmdi-delete"></i>
                                  </button>
                                </Tooltip>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="text-center" key="foot">
                            <td
                              colSpan={11}
                              style={{ textTransform: "none" }}
                            >
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

export default InterestListing;
