import React, { useEffect, useState } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { useHistory } from "react-router-dom";
import { apiCall, capitalizeFirstLetter } from "../../util/common";
import queryString from "query-string";
import moment from "moment";
import ChildInformation from "./ChildInformation";
import PumpingInformation from "./PumpingInformation";
import NursingInformation from "./NursingInformation";
import BottleInformation from "./BottleInformation";
import DiaperInformation from "./DiaperInformation";

const defaultViewDetails = {
  user_id: "",
  name: "",
  email: "",
  // address: "",
  profession_name: "",
  dob: "",
  weight: "",
  height: "",
  feet: null,
  inches: null,
  ounces: null,
  lbs: null,
  interest_name: "",
};

const UserDetailPage = (props) => {
  const [viewDetails, setViewDetails] = useState(defaultViewDetails);
  const {
    user_id,
    name,
    email,
    address,
    profession_name,
    dob,
    weight,
    height,
    feet,
    inches,
    ounces,
    lbs,
    feet_inches,
    lbs_ounces,
    interest_name,
  } = viewDetails;
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const params = queryString.parse(props.location.search);

  useEffect(() => {
    if (params.Id) {
      getAccountDetails();
    }
  }, []);

  const getAccountDetails = async () => {
    let req_data = {
      user_id: params.Id,
    };
    let { code, data } = await apiCall("POST", "getUserById", req_data);
    const {
      user_id,
      name,
      email,
      profession_name,
      dob,
      weight,
      height,
      inches,
      ounces,
      lbs,
      feet,
      lbs_ounces,
      feet_inches,
      interest_name,
    } = data;
    if (code == 1) {
      setLoading(false);
      console.log("data", data);
      setViewDetails((prevState) => ({
        ...prevState,
        user_id: user_id,
        name: name,
        email: email,
        // address: res.data.address,
        profession_name: profession_name,
        dob:
          dob == "" || null
            ? moment(new Date()).format("MM/DD/YYYY")
            : moment(dob).format("MM/DD/YYYY"),
        weight: weight,
        height: height,
        feet: feet,
        inches: inches,
        ounces: ounces,
        lbs: lbs,
        feet_inches: feet_inches,
        lbs_ounces: lbs_ounces,
        interest_name: interest_name,
      }));
    } else {
      setLoading(false);
    }
  };

  console.log("viewDetails", viewDetails);

  const goUsers = () => {
    history.push("/app/users");
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={goUsers}>
            User Management
          </span>{" "}
          {">"} Account Detail{" "}
        </div>
        <button className="cus_btn" onClick={history.goBack}>
          <i class="cus_arr zmdi zmdi-arrow-left"></i>&nbsp;BACK
        </button>
      </h1>

      <div className="mb-3">
        <p>
          <h1>
            <span className="view_detail_sa">Account Detail</span>{" "}
          </h1>
        </p>
        <h3>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Name:</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {capitalizeFirstLetter(name ? name : "--")}
            </div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Email:</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {email ? email : "--"}
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-1">
              <span className="view_detail_sa">Address:</span>
            </div>
            <div className="col-md-1 mb-1 view_detail_saas">{address}</div>
          </div> */}
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Profession:</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {profession_name ? profession_name : "--"}
            </div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">DOB:</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">{dob}</div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Weight(Lbs):</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {lbs_ounces ? lbs_ounces : "--"}
            </div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Height(Feet):</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {feet_inches ? feet_inches : "--"}
            </div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Interest:</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {interest_name ? interest_name : "--"}
            </div>
          </div>
          {/* <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Weight(Lbs):</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {ounces ? ounces : "--"}
              {lbs ? "/" : null}
              {lbs ? lbs : null}
           
            </div>
          </div>
          <div className="row">
            <div className="col-3 col-md-2">
              <span className="view_detail_sa">Height(Feet):</span>
            </div>
            <div className="col-8 col-md-3 mb-2 view_detail_saas">
              {feet ? feet + " " + "ft" : "--"}
              {inches ? ", " : null}
              {inches ? inches + " " + "in" : null}
            
            </div>
          </div> */}
        </h3>
      </div>
      <div className="mb-3 newlinks_1">
        {/* <h1 className="main_text_h1 mb-4">
          <div className="custom-breadcrumb">
            <span className="view_detail_sa">Child Information</span>
          </div>
         
        </h1> */}
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="child-tab"
              data-toggle="tab"
              href="#child"
              role="tab"
              aria-controls="child"
              aria-selected="true"
            >
              Child Information
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="nursing-tab"
              data-toggle="tab"
              href="#nursing"
              role="tab"
              aria-controls="nursing"
              aria-selected="true"
            >
              Nursing Information
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="pumping-tab"
              data-toggle="tab"
              href="#pumping"
              role="tab"
              aria-controls="pumping"
              aria-selected="true"
            >
              Pumping Information
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="bottle-tab"
              data-toggle="tab"
              href="#bottle"
              role="tab"
              aria-controls="bottle"
              aria-selected="true"
            >
              Bottle Information
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="diaper-tab"
              data-toggle="tab"
              href="#diaper"
              role="tab"
              aria-controls="diaper"
              aria-selected="true"
            >
              Diaper Information
            </a>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="child"
            role="tabpanel"
            aria-labelledby="child-tab"
          >
            <ChildInformation userId={params.Id} />
          </div>
          <div
            className="tab-pane fade show"
            id="nursing"
            role="tabpanel"
            aria-labelledby="nursing-tab"
          >
            <NursingInformation userId={params.Id} />
          </div>
          <div
            className="tab-pane fade show"
            id="pumping"
            role="tabpanel"
            aria-labelledby="pumping-tab"
          >
            <PumpingInformation userId={params.Id} />
          </div>
          <div
            className="tab-pane fade show"
            id="bottle"
            role="tabpanel"
            aria-labelledby="bottle-tab"
          >
            <BottleInformation userId={params.Id} />
          </div>
          <div
            className="tab-pane fade show"
            id="diaper"
            role="tabpanel"
            aria-labelledby="diaper-tab"
          >
            <DiaperInformation userId={params.Id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
