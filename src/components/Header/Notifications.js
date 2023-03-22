import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Badge } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import { customApiCall, capitalizeFirstLetter } from "../../util/common";
import IntlMessages from "Util/IntlMessages";
import firebase from "firebase/app";
import { toast } from "react-toastify";

function HeaderNotification() {
  const [list, setList] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotifications();
    if (firebase.messaging.isSupported()) {
      firebase.messaging().onMessage(
        (payload) => {
          // console.warn("NOTIFICATION_PAYLOAD", payload);
          const Msg = ({ closeToast }) => (
            <div className="not_tit">
              <span className="aswewerrt">
                {capitalizeFirstLetter(payload.notification.title)}
              </span>
              <p>{payload.notification.body}</p>
            </div>
          );
          toast(<Msg />, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: false,
            theme: "colored",
            icon: ({ theme, type }) => (
              <i className="noti_cu_to zmdi zmdi-notifications-active"></i>
            ),
          });
          getNotifications();
        },
        (e) => {}
      );
    }
  }, []);

  const getNotifications = async () => {
    let data = await customApiCall(
      "GET",
      "getallUnreadNotification",
      undefined
    );
    if (data.code == 1) {
      setList(data.data.allUnreadNotification);
      setTotal(data.data.total);
    } else {
    }
  };

  const readNotification = async (id) => {
    let req_data = {
      is_read: 1,
      notification_id: id,
    };
    let data = await customApiCall("POST", "readNotificationByID", req_data);
    if (data.code == 1) {
      getNotifications();
    }
  };

  return (
    <div className="list-inline-item mr-4">
      <div className="d-flex align-items-center">
        <div className="notificationBlock position-relative">
          {list.length > 0 ? (
            <Tooltip
              title="Click to view unread notifications"
              placement="bottom"
            >
              <IconButton className="shake" aria-label="bell">
                <i
                  className="zmdi zmdi-notifications-active"
                  style={{ color: "#223263" }}
                ></i>
                <Badge
                  color="danger"
                  className="badge-xs badge-top-right rct-notify"
                >
                  {total > 100 ? "99+" : total}
                </Badge>
              </IconButton>
            </Tooltip>
          ) : // <i
          //   className="zmdi zmdi-notifications"
          //   style={{
          //     color: "#7260a5",
          //     fontSize: "20px",
          //     position: "relative",
          //     top: "4px",
          //     cursor: "pointer",
          //   }}
          // ></i>
          null}
          <div className="noticationAll position-absolute">
            <div className="notificationContent">
              {list.length > 0 ? (
                <>
                  {list.map((item, index) => {
                    return (
                      <div>
                        <div className="notiBoxnew">
                          <div className="notification-status">
                            <p>
                              {item.notification_title
                                ? item.notification_title
                                : ""}
                            </p>
                            <label className="mb-0 text-dark">
                              {moment
                                .unix(item.created_date)
                                .format("MM/DD/YYYY")}
                            </label>
                          </div>
                          <span>
                            {item.notification_text
                              ? item.notification_text
                              : "--"}
                          </span>
                          <div
                            className="clear_btn_noti mt-3"
                            onClick={() =>
                              readNotification(item.notification_id)
                            }
                          >
                            Clear
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "40px",
                    color: "#223263",
                  }}
                >
                  No Notification
                </div>
              )}
            </div>
            <div className="viewBtnBox">
              <NavLink
                to={{
                  pathname: "/app/notification",
                }}
                className="viewBtn"
                onClick={() => setIsActive(false)}
              >
                View All
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderNotification;
