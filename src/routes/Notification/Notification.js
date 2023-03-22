import React, { useState, useEffect } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall } from "../../util/common";
import { Col, Row } from "reactstrap";
import moment from "moment";
import axios from "axios";

function Notification() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let data = await apiCall("GET", "getallNotification", undefined);
    if (data.code == 1) {
      setLoading(false);
      setList(data.data);
    } else {
      setLoading(false);
      setList([]);
    }
  };

  const onClickNotification = () => {
    var payload = {
      priority: "HIGH",
      notification: {
        title: "This is a title",
        body: "This is a notification body",
      },
      to: localStorage.getItem("DEVICE_TOKEN"),
    };

    var sendConfig = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "key=AAAANDpIWtc:APA91bEcSCw65Qj6yw0xgg7uNvhhnHtgvWST6H8p5YC3p11Wv7VbJeS5yNZbBAtjv7XBuTkOOIsOLiFi0saTTkS6pkaSUuKPVAgxevE4l2ezPZT_zZ1ZalCx512cdcvo1Z8HVzVKsT_J",
      },
      data: JSON.stringify(payload),
    };

    axios(sendConfig)
      .then(async function(response) {})
      .catch(function(error) {});
  };

  return (
    <div className="user-management">
      {/* <div>
        <button onClick={onClickNotification}>
          Click here for notification
        </button>
      </div> */}
      <h1 className="main_text_h1 mb-4">Notifications</h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}></Col>
        </Row>

        <div className="mt-4">
          {loading === true ? null : (
            <>
              {list?.length > 0 ? (
                list.map((item, index) => (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="template-row border-bottom">
                        <div className="template-left">
                          <h3>
                            Notification Name:{" "}
                            {item.notification_title
                              ? item.notification_title
                              : "--"}
                          </h3>
                          <p className="m-0">
                            Created at -{" "}
                            {item.created_date
                              ? moment
                                  .unix(item.created_date)
                                  .format("MM/DD/YYYY")
                              : "--"}
                          </p>
                          <p>
                            {item.notification_text
                              ? item.notification_text
                              : "--"}
                          </p>
                        </div>
                        <div className="template-right">
                          <p>
                            {item.created_date
                              ? moment
                                  .unix(item.created_date)
                                  .format("MM/DD/YYYY")
                              : "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
        </div>
      </RctCollapsibleCard>
    </div>
  );
}

export default Notification;
