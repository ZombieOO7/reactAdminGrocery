/**
 * App Routes
 */
import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

// app default layout
import RctAppLayout from "Components/RctAppLayout";

// router service
import routerService from "../services/_routerService";

class DefaultLayout extends Component {
  render() {
    const { match, loading } = this.props;
    return (
      <>
        <RctAppLayout>
            <>
              {routerService &&
                routerService.map((route, key) => (
                  <>
                    <Switch>
                      <Route
                        key={key}
                        path={`${match.url}/${route.path}`}
                        exact
                        component={route.component}
                      />
                    </Switch>
                    {/* <Redirect to={"/app/dashboard"} /> */}
                  </>
                ))}
            </>
        </RctAppLayout>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return {
    user,
    loading,
  };
};

export default withRouter(connect(mapStateToProps)(DefaultLayout));
