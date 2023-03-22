import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, Flip, Slide, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PuffLoader from "react-spinners/PuffLoader";

// rct theme provider
import RctThemeProvider from "./RctThemeProvider";

import RctDefaultLayout from "./DefaultLayout";

import AppSignIn from "./Signin";

class App extends Component {
  render() {
    var DEBUG = true;
    if (!DEBUG) {
      var methods = ["log", "debug", "warn", "info"];
      for (var i = 0; i < methods.length; i++) {
        console[methods[i]] = function() {};
      }
    }

    const { location, match, user, loading } = this.props;

    if (location.pathname === "/") {
      if (user === null) {
        return <Redirect to={"/signin"} />;
      } else {
        return <Redirect to={"/app/dashboard"} />;
      }
    }

    return (
      <RctThemeProvider>
        {loading && (
          <div className="loader loader_343">
            <PuffLoader color="#131c37" size={78} />
          </div>
        )}

        <ToastContainer
          icon={true}
          theme="light"
          position="bottom-right"
          autoClose={1800}
          hideProgressBar={true}
          transition={Zoom}
          newestOnTop
        />

        {localStorage.getItem("AUTH_TOKEN") ? (
          <Switch>
            <Route
              path={`${match.url}app`}
              name="Dashboard"
              render={(props) => (
                <RctDefaultLayout {...props} loading={loading} />
              )}
            />
            <Redirect to={"/app/dashboard"} />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/forgot-password"
              render={(props) => <ForgotPasswords {...props} />}
            />
            <Route
              path="/signin"
              name="Login"
              render={(props) => <AppSignIn {...props} />}
            />
            <Route
              exact
              path="/reset-passwords"
              render={(props) => <Resetpassword {...props} />}
            />
            <Route
              path="/callback"
              render={(props) => {
                handleAuthentication(props);
                return <Callback {...props} />;
              }}
            />
            <Redirect to={"/signin"} />
          </Switch>
        )}
      </RctThemeProvider>
    );
  }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return {
    user,
    loading,
  };
};

export default connect(mapStateToProps)(App);
