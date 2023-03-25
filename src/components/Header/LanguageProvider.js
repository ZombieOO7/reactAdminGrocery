import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import {
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem,
} from "reactstrap";
import {
  displayLog,
  apiCall,
  confirmBox,
  customApiCall,
} from "../../util/common";
import Modal from "react-modal";

function LanguageProvider() {
  const [langDropdownOpen, setLanguageDropDown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [checkdNoti, setCheckedNoti] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "50%",
      marginRight: "-50%",
      height: "400px",
      transform: "translate(-50%, -50%)",
      borderRadius: "25px",
      boxShadow: "5px 5px rgb(215 215 215)",
    },
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let req_data = {
      page_no: 1,
      limit: 1000000000000000,
    };

    // let { code, data } = await apiCall("POST", "setting", req_data);
    // if (code == 1) {
    //   setLoading(false);
    //   let notifications = [...checkdNoti];
    //   let new_data = data.forEach((element, index) => {
    //     console.log("element", element);
    //     notifications[index] = element.status == 1 ? 1 : 0;
    //   });
    //   console.log("element", notifications);
    //   setCheckedNoti(notifications);
    //   setList(data);
    // } else {
    //   setList([]);
    //   setLoading(false);
    // }
  };

  const toggle = () => {
    setLanguageDropDown(!langDropdownOpen);
  };

  const goChangePassword = () => {
    history.push("/app/changepassword");
  };

  const logout = async (item) => {
    if (await confirmBox(undefined, `Are you sure you want to logout?`)) {
      // let res = await apiCall("POST", "logout", undefined);
      // if (res.code == 1) {
      //   localStorage.clear();
      //   displayLog(1, "You are successfully logged out");
      //   history.push("/signin");
      // }
      localStorage.clear();
      displayLog(1, "You are successfully logged out");
      history.push("/signin");
    }
  };

  const openModal = async () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChangeNotification = async (e, key, data) => {
    let notifications = [...checkdNoti];
    notifications[e.target.name] = +e.target.value;
    setCheckedNoti(notifications);
    let reqData = {
      id: data.id,
      status: data.status == 1 ? 0 : 1,
    };
    let res = await apiCall("POST", "setting/update", reqData);
    if (res.code == 1) {
      getNotifications();
      displayLog(1, "Notification status updated");
    } else {
      displayLog(0, "Error while updating status");
    }
  };

  return (
    <div className="mainDiv">
      <Dropdown
        nav
        className="list-inline-item"
        isOpen={langDropdownOpen}
        toggle={toggle}
      >
        <DropdownToggle caret nav className="header-icon language-icon">
          <i className="zmdi zmdi-account zmdi-hc-lg mr-2"></i>
          <span style={{ marginLeft: "0.5rem" }}>Hi, Admin</span>
        </DropdownToggle>

        <DropdownMenu className="drop_co_2343">
          <DropdownItem
            className="drop_co_1"
            onClick={() => goChangePassword()}
          >
            <i className="zmdi zmdi-rotate-right zmdi-hc-lg mr-2"></i>
            <span>Change password</span>
          </DropdownItem>
          <DropdownItem className="drop_co_1" onClick={() => openModal()}>
            <i className="zmdi zmdi-settings zmdi-hc-lg mr-1"></i>
            <span>Notification setting</span>
          </DropdownItem>
          <DropdownItem
            style={{
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
            className="drop_co_1"
            onClick={() => logout()}
          >
            <i className="zmdi zmdi-power zmdi-hc-lg mr-2"></i>
            <span>Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        className="design_67"
      >
        <div className="bookingModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header position-relative border-0">
                <h5 className="modal-title">Notification status settings</h5>
                <button
                  onClick={closeModal}
                  title="Close Table"
                  className="close"
                  style={{ color: "#7563a6" }}
                >
                  &#10005;
                </button>
              </div>

              <div className="modal-body p-0">
                {list.length > 0 && loading == false ? (
                  <>
                    {list.map((notification, key) => (
                      <div className="toggle-switch" key={key}>
                        <div className="row custom_class_row">
                          <div className="col-sm-9">
                            <span className="mod_bo_ti">
                              {notification.title} status:
                            </span>
                          </div>
                          <div className="col-sm-2">
                            <input
                              type="checkbox"
                              name={key}
                              value={checkdNoti[key] == 1 ? 0 : 1}
                              checked={checkdNoti[key] == 1 ? 1 : 0}
                              onChange={(e) =>
                                handleChangeNotification(e, key, notification)
                              }
                              id={notification.id}
                            />
                            <label htmlFor={notification.id} className="m-0">
                              <span className="toggle-track" />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No Settings Found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default withRouter(LanguageProvider);
