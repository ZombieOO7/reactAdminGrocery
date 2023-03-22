import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { apiCall, displayLog } from "../util/common";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import cryptoJs from "crypto-js";
import config from "../util/config";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordFlag, setShowPasswordFlag] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  const [flag, setFlag] = useState(true);
  const [flag1, setFlag1] = useState(true);
  const [flag2, setFlag2] = useState(false);

  const history = useHistory();

  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onUserLogin = async () => {
    if (email == "") {
      displayLog(0, "Email is required");
    } else if (!regex.test(email)) {
      displayLog(0, "Email is incorrect");
    } else if (password == "") {
      displayLog(0, "Password is required");
    } else {
      let data = {
        email: email.toLowerCase(),
        password: await cryptoJs.AES.encrypt(
          password,
          config.CRYPTO_JS_SECRET_KEY
        ).toString(),
      };

      const response = await apiCall("POST", "logIn", data);
      if (response.code == 200) {
        const authorization = `Bearer ${response.data.auth_token}`;
        localStorage.setItem("AUTH_TOKEN", authorization);
        displayLog(1, "You are successfully logged in");
        history.push({ pathname: "/app/dashboard" });
      }
    }
  };

  const showPassword = () => {
    setShowPasswordFlag(true);
  };

  const hidePassword = () => {
    setShowPasswordFlag(false);
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      onUserLogin();
    }
  };

  const handleChange = (value, name) => {
    if (name == "email") {
      setEmail(value);
      setFlag(false);
    } else if (name == "password") {
      setPassword(value);
      setFlag(false);
    }
    // if (email == "") {
    //   setFlag(true);
    // }
    // if (password == "") {
    //   setFlag(true);
    // }
  };

  const handleFlag1 = () => {
    console.log("flag1");
    setFlag1(false);
    setFlag2(true);
  };

  const handleFlag2 = () => {
    console.log("flag2");
    setFlag2(false);
    setFlag1(true);
  };

  return (
    <div className="login-auth">
      <div className="container login-container" id="container">
        <div className="form-container sign-in-container">
          <span className="erff">
            <h1>Login</h1>
            <div className="inputIcon">
              <span className="main_page_left_icon">
                <i className="ti-email"></i>
              </span>
              <input
                type="mail"
                className="mb-0 cus_padding has-input input-lg"
                value={email}
                name="email"
                id="user-mail"
                placeholder="Email"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                onKeyPress={(e) => enterPressed(e)}
                autoComplete={false}
              />
            </div>
            <div className="inputIcon">
              <span className="main_page_left_icon_1">
                <i className="ti-lock"></i>
              </span>
              <input
                value={password}
                className="mt-0 cus_padding has-input input-lg"
                type={showPasswordFlag == true ? "text" : "password"}
                name="password"
                id="pwd"
                placeholder="Password"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                onKeyPress={(e) => enterPressed(e)}
                autoComplete={false}
              />
              {showPasswordFlag == false ? (
                <span
                  className="cus_ey"
                  title="Show Password"
                  onClick={showPassword}
                >
                  <i className="zmdi zmdi-eye"></i>
                </span>
              ) : (
                <span
                  className="cus_ey"
                  title="Hide Password"
                  onClick={hidePassword}
                >
                  <i className="zmdi zmdi-eye-off"></i>
                </span>
              )}
            </div>
            {/* {flag == true ? (
              <>
                {flag1 == true ? (
                  <button
                    className="new_b"
                    style={{
                      marginTop: "5px",
                      marginRight: "150px",
                      cursor: "pointer",
                    }}
                    onMouseOver={() => handleFlag1()}
                  >
                    Disable
                  </button>
                ) : flag2 == true ? (
                  <button
                    className="new_b"
                    style={{
                      marginTop: "5px",
                      marginLeft: "150px",
                      cursor: "pointer",
                    }}
                    onMouseOver={() => handleFlag2()}
                  >
                    Disable
                  </button>
                ) : null}
              </>
            ) : (
              <button
                className="new_b"
                onClick={() => onUserLogin()}
                style={{ marginTop: "5px" }}
              >
                Login
              </button>
            )} */}

            <button
              className="new_b"
              onClick={() => onUserLogin()}
              style={{ marginTop: "5px" }}
            >
              Login
            </button>
          </span>
        </div>
        <div className="overlay-container signin_back">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <img
                style={{ width: "350px", maxWidth: "100%" }}
                src={require("../assets/img/leva-logo-white.png")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
