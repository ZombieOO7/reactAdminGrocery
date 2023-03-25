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
  const [total, setTotal] = useState(2);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getRequestFormList();
  }, []);

  const getRequestFormList = async () => {
    let { code, data } = await apiCall(
      "POST",
      "getCategoryListings",
      undefined
    );
    const { categories, total } = data;
    if (code == 200) {
      setList(categories);
      setTotal(total);
      setLoading(false);
    } else {
      setLoading(false);
    }
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

  const handleDragEnd = async (results) => {
    let tempUser = [...list];
    let selectedRow = tempUser.splice(results.source.index, 1);
    console.log(selectedRow[0]);
    tempUser.splice(results.destination.index, 0, selectedRow[0]);
    const sortedData = tempUser.map((item, key) => ({
      interest_id: item.interest_id,
      sequence: key,
    }));
    console.log("sortedData", sortedData);
    console.log("tempUser", tempUser);
    await setList(tempUser);
    await handleInterestOrder(sortedData);
  };

  const handleInterestOrder = async (sortedData) => {
    let reqData = {
      detail: sortedData,
    };
    let response = await apiCall("POST", "update-category-sequence", reqData);
    if (response.code === 1) {
      displayLog(1, "Order changed successfully");
    } else if (response.code === 0) {
      displayLog(0, "Ordering error");
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
              <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
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
                  <Droppable droppableId="tbody">
                    {(provided) => (
                      <tbody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {loading === true ? null : (
                          <>
                            {list?.length > 0 ? (
                              list.map((item, index) => (
                                <Draggable
                                  key={item.name}
                                  draggableId={item.name}
                                  index={index}
                                >
                                  {(provided) => (
                                    <tr
                                      key={index}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
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
                                  )}
                                </Draggable>
                              ))
                            ) : (
                              <tr className="text-center">
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
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </DragDropContext>
            </div>
          </div>
        </div>
      </RctCollapsibleCard>
    </div>
  );
};

export default InterestListing;
