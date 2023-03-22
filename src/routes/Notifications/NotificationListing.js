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

const NotificationListing = () => {
  const [list, setList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getNotificationListing();
  }, [pageNo]);

  const getNotificationListing = async () => {
    let requestData = {
      page_no: pageNo,
      limit: limit,
    };
    const { code, message, data } = await apiCall(
      "POST",
      "getNotificationListing",
      requestData
    );
    if (code === 1) {
      const { Notification, total } = data;
      setList(Notification);
      setTotal(total);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const testData = [
    {
      notification_id: 1,
      name: "test",
      content: "teasdsdf",
    },
    {
      notification_id: 1,
      name: "test",
      content: "teasdsdf",
    },
  ];
  useEffect(() => {
    setList(testData);
  }, []);
  console.log("list", list);

  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };

  const handleRedirection = () => {
    history.push({ pathname: "/app/Notification/AddEditNotification" });
  };

  const handlePushNotification = async (item) => {
    const { notification_id, name } = item;
    const requestData = {
      notification_id: notification_id,
    };
    if (
      await confirmBox(
        capitalizeFirstLetter(name),
        "Are you sure you want to send notification"
      )
    ) {
      const { code } = await apiCall(
        "POST",
        "sendPushNotification",
        requestData
      );
      if (code === 1) {
        getNotificationListing();
        displayLog(code, "Push Notification has been sent successfully");
      } else {
        setLoading(false);
      }
    } else {
    }

    if (code === 1) {
      getNotificationListing();
      displayLog(code, message);
    } else {
      setLoading(false);
    }
  };

  const deleteHandler = async (meditation) => {
    const { name, notification_id } = meditation;
    const requestData = { notification_id: notification_id };
    if (
      await confirmBox(
        capitalizeFirstLetter(name),
        "Are you sure you want to delete"
      )
    ) {
      const { code } = await apiCall(
        "POST",
        "deleteNotificationById",
        requestData
      );
      if (code === 1) {
        getNotificationListing();
        displayLog(code, "Notification has been deleted successfully");
      } else {
        setLoading(false);
      }
    } else {
    }
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Notification Management</h1>
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
                      onClick={handleRedirection}
                      style={{ color: "white", width: "225px" }}
                    >
                      <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Notification
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
                    <th className="table__header">Notification Title</th>
                    <th className="table__header">Notification Body</th>
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
                              {item.content ? item.content : "--"}
                            </td>
                            <td className="list-action">
                              <Tooltip
                                id="tooltip-fab"
                                title="Send Notification"
                              >
                                <button
                                  type="button"
                                  className="rct-link-btn"
                                  onClick={() => handlePushNotification(item)}
                                >
                                  <i class="delete_new zmdi zmdi-mail-send"></i>
                                </button>
                              </Tooltip>
                              <Tooltip title="Edit Notification">
                                <Link
                                  to={{
                                    pathname:
                                      "Notification/AddEditNotification",
                                    search: `?Id=${item.notification_id}`,
                                  }}
                                >
                                  <i class="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              <Tooltip
                                id="tooltip-fab"
                                title="Delete Notification"
                              >
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

export default NotificationListing;
