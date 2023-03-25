import { displayLog, apiCall, confirmBox } from "../../util/common";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { CardBody, CardFooter, Col, Row } from "reactstrap";
import cryptoJs from "crypto-js";
import config from "../../util/config";

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPas, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    const upperCaseRegEx = /(?=.*?[A-Z])/;
    const lowerCaseRegEx = /(?=.*?[a-z])/;
    const digitRegEx = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;

    const uppercasePassword = upperCaseRegEx.test(newPas);
    const lowercasePassword = lowerCaseRegEx.test(newPas);
    const digitsPassword = digitRegEx.test(newPas);
    const specialCharPassword = specialCharRegExp.test(newPas);
    const minLengthPassword = minLengthRegExp.test(newPas);

    if (current == "") {
      displayLog(0, "Current password is required");
    } else if (newPas == "") {
      displayLog(0, "New password is required");
    } else if (!uppercasePassword) {
      displayLog(0, "New Password must contain atleast one Uppercase Character.");
    } else if (!lowercasePassword) {
      displayLog(0,"New Password must contain atleast one Lowercase Character.");
    } else if (!digitsPassword) {
      displayLog(0, "New Password must contain atleast one digit.")
    } else if (!specialCharPassword) {
      displayLog(0, "New Password must contain atleast one Special Characters.")
    } else if (!minLengthPassword) {
      displayLog(0, "New Password must contain atleast one minumum 8 characters.")
    } else if (confirm == "") {
      displayLog(0, "Confirm password is required.");
    } else if (confirm != newPas) {
      displayLog(0, "New password and Confirm password must be same.");
    } else {
      let data = {
        password: await cryptoJs.AES.encrypt(
          current,
          config.CRYPTO_JS_SECRET_KEY
        ).toString(),
        newPassword: await cryptoJs.AES.encrypt(
          newPas,
          config.CRYPTO_JS_SECRET_KEY
        ).toString(),
        confirmPassword: await cryptoJs.AES.encrypt(
          confirm,
          config.CRYPTO_JS_SECRET_KEY
        ).toString(),
      };
      const response = await apiCall("POST", "changePassword", data);
      if (response.code == 1) {
        logout();
      }
    }
  };

  const logout = async () => {
    localStorage.clear();
    displayLog(1, "You are successfully logged out");
    history.push("/signin");
  };

  const showPasswordOld = () => {
    setShowCurrent(true);
  };

  const hidePasswordOld = () => {
    setShowCurrent(false);
  };

  const showPasswordNew = () => {
    setShowNew(true);
  };

  const hidePasswordNew = () => {
    setShowNew(false);
  };

  const showPasswordCon = () => {
    setShowConfirm(true);
  };

  const hidePasswordCon = () => {
    setShowConfirm(false);
  };

  return (
    <div className="animated fadeIn">
      <h1 className="main_text_h1 mb-4">Change Password</h1>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row>
                <Col xs="12" md="6">
                  <span className="has-wrapperss">
                    <span className="left_icon">
                      <i className="ti-lock"></i>
                    </span>
                    <input
                      type={showCurrent == true ? "text" : "password"}
                      className="input_default"
                      id="current_password"
                      onChange={(e) => setCurrent(e.target.value)}
                      value={current}
                      placeholder="Current password"
                      name="current_password"
                    />
                    {showCurrent == false ? (
                      <span
                        className="password_show_hide"
                        title="Show Password"
                        onClick={showPasswordOld}
                      >
                        <i className="zmdi zmdi-eye"></i>
                      </span>
                    ) : (
                      <span
                        className="password_show_hide"
                        title="Hide Password"
                        onClick={hidePasswordOld}
                      >
                        <i className="zmdi zmdi-eye-off"></i>
                      </span>
                    )}
                  </span>
                  <span className="has-wrapperss">
                    <span className="left_icon">
                      <i className="ti-lock"></i>
                    </span>
                    <input
                      type={showNew == true ? "text" : "password"}
                      id="new_password"
                      onChange={(e) => setNew(e.target.value)}
                      value={newPas}
                      placeholder="New password"
                      name="new_password"
                      className="input_default"
                    />
                    {showNew == false ? (
                      <span
                        className="password_show_hide"
                        title="Show Password"
                        onClick={showPasswordNew}
                      >
                        <i className="zmdi zmdi-eye"></i>
                      </span>
                    ) : (
                      <span
                        className="password_show_hide"
                        title="Hide Password"
                        onClick={hidePasswordNew}
                      >
                        <i className="zmdi zmdi-eye-off"></i>
                      </span>
                    )}
                  </span>
                  <span className="has-wrapperss">
                    <span className="left_icon">
                      <i className="ti-lock"></i>
                    </span>
                    <input
                      type={showConfirm == true ? "text" : "password"}
                      id="confirm_password"
                      onChange={(e) => setConfirm(e.target.value)}
                      value={confirm}
                      placeholder="Confirm new password"
                      name="confirm_password"
                      className="input_default"
                    />
                    {showConfirm == false ? (
                      <span
                        className="password_show_hide"
                        title="Show Password"
                        onClick={showPasswordCon}
                      >
                        <i className="zmdi zmdi-eye"></i>
                      </span>
                    ) : (
                      <span
                        className="password_show_hide"
                        title="Hide Password"
                        onClick={hidePasswordCon}
                      >
                        <i className="zmdi zmdi-eye-off"></i>
                      </span>
                    )}
                  </span>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <button
                style={{ backgroundColor: "#223263" }}
                className="logout"
                variant="contained"
                onClick={submitHandler}
              >
                <i className="zmdi zmdi-floppy mr-2"></i> Save
              </button>
              <button
                style={{ height: "39px" }}
                variant="contained"
                className="ml-4 editbtnss"
                onClick={history.goBack}
              >
                <i className="zmdi zmdi-close-circle-o mr-2"></i> Cancel
              </button>
            </CardFooter>
          </Col>
        </Row>
      </RctCollapsibleCard>
    </div>
  );
}

export default ChangePassword;
