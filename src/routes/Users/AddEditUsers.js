import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  CardBody,
  Col,
  Row,
  CardFooter,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { displayLog, apiCall } from "../../util/common";
import queryString from "query-string";
import moment from "moment";
import ScaleLoader from "react-spinners/ScaleLoader";
import Joi, { log } from "joi-browser";
import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultUserDetails = {
  address: "",
  dob: "",
  email: "",
  height: "",
  image: "",
  name: "",
  weight: "",
  feet: null,
  inches: null,
  ounces: null,
  lbs: null,
};

const AddEditUser = (props) => {
  const [userDetail, setUserDetail] = useState(defaultUserDetails);
  const {
    name,
    email,
    image,
    address,
    dob,
    height,
    weight,
    feet,
    inches,
    ounces,
    lbs,
  } = userDetail;
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState([]);
  const [dobDate, setDobDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const params = queryString.parse(props.location.search);
  const timestamp = moment()
    .valueOf()
    .toString();
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleDobDate = (date) => {
    setDobDate(date);
  };

  useEffect(() => {
    if (params.Id) {
      getById(params.Id);
    }
    getProfessionListing();
  }, []);

  const getProfessionListing = async () => {
    let res = await apiCall("POST", "getProfessionList", null);
    setProfessions(res.data);
  };

  const getById = async () => {
    let reqData = {
      user_id: params.Id,
    };
    let { code, data } = await apiCall("POST", "getUserById", reqData);
    const {
      name,
      weight,
      height,
      image,
      email,
      address,
      dob,
      profession_name,
      feet,
      inches,
      ounces,
      lbs,
    } = data;
    setUserDetail((prevState) => {
      console.log("dob", moment(dob).format("MM/DD/YYYY"));
      return {
        ...prevState,
        address: address,
        // dob:
        //   dob === null || ""
        //     ? moment(new Date()).format("yyyy-MM-DD")
        //     : moment(dob).format("yyyy-MM-DD"),
        // dob: dob ? new Date(dob) : new Date(),
        email: email,
        height: height.toString(),
        image: image,
        name: name,
        weight: weight.toString(),
        feet: feet,
        inches: inches,
        ounces: ounces,
        lbs: lbs,
      };
    });

    setDobDate(dob ? new Date(dob) : new Date());

    profession_name === ""
      ? setSelectedProfession((prevState) => {
          return [...prevState, { name: "Select Profession" }];
        })
      : setSelectedProfession((prevState) => {
          return [...prevState, { name: profession_name }];
        });
  };

  const submitHandler = async () => {
    try {
      var schema = {
        name: Joi.string().required(),
        dob: Joi.date().required(),
      };
      let component = {
        name: name.trim(),
        // dob: dob,
        dob: moment(dobDate).format("yyyy-MM-DD"),
      };

      let validation = await Joi.validate(component, schema);
      console.log("selected profess", selectedProfession);

      if (validation) {
        let res;
        if (selectedProfession?.length > 0) {
          component.profession = selectedProfession[0]?.id;
        }
        if (address !== "") {
          component.address = address;
        }
        // if (weight !== "") {
        //   component.weight = weight;
        // }
        // if (height !== "") {
        //   component.height = height;
        // }
        if (ounces !== "" || null) {
          component.ounces = ounces;
        }
        if (lbs !== "" || null) {
          component.lbs = lbs;
        }
        if (feet !== "" || null) {
          component.feet = feet;
        }
        if (inches !== "" || null) {
          component.inches = inches;
        }
        let reqData = component;
        console.log("component", component);
        if (params && params.Id) {
          reqData["user_id"] = params.Id;
          res = await apiCall("POST", "editUserById", reqData);
          if (res.code == 1) {
            setLoading(false);
            displayLog(1, "User account has been updated successfully");
            history.goBack();
          } else {
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.log("error", error.details[0].type);
      let errorMsg = error.details[0].message;
      if (error.details[0].type === "date.base") {
        errorMsg = "Date of Birth is required";
      } else if (error.details[0].type === "any.empty") {
        errorMsg = "Name is required";
      }
      displayLog(0, errorMsg);
    }
  };

  const handleChange = async (e) => {
    const re = /^[0-9\b]+$/;
    const { value, name } = e.target;
    console.log("checkonchange====", value, name);
    if (
      name === "ounces" ||
      name === "lbs" ||
      name === "feet" ||
      name === "inches"
    ) {
      console.log("inside if====");
      if (value === "" || re.test(e.target.value)) {
        setUserDetail((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      console.log("else====");
      setUserDetail((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const onSelectState = async (selectedList, selectedItem) => {
    const { id, name } = selectedItem;
    let arr = [];
    arr.push({
      id: id,
      name: name,
    });
    setSelectedProfession(arr);
  };

  const onRemoveState = (selectedList, removedItem) => {
    console.log("removedItem", removedItem);
    setSelectedProfession([]);
  };

  const goUser = () => {
    history.push("/app/users");
  };

  return (
    <div className="animated fadeIn">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={goUser}>
            User Management
          </span>{" "}
          {">"} {params.Id ? "Edit" : "Add"} User{" "}
        </div>
        <button className="cus_btn" onClick={history.goBack}>
          <i className="cus_arr zmdi zmdi-arrow-left"></i>&nbsp;BACK
        </button>
      </h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row>
                <Col xs="12" md="6">
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      <em style={{ color: "red" }}>*</em>&nbsp;&nbsp;Shows
                      mandatory fields
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Email
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Email`}
                      value={email}
                      name="email"
                      id="email"
                      disabled="true"
                    />
                  </FormGroup>
                  {/* <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Address
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Address`}
                      value={address}
                      name="address"
                      id="address"
                      onChange={handleChange}
                    />
                  </FormGroup> */}
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Weight
                    </Label>
                    <br />
                    <Row>
                      {/* <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (kg)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Weight`}
                          value={weight}
                          name="weight"
                          id="weight"
                          onChange={handleChange}
                        />
                      </Col> */}
                      <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (lbs)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Lbs`}
                          value={lbs}
                          name="lbs"
                          id="lbs"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (Ounces)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Ounces`}
                          value={ounces}
                          name="ounces"
                          id="ounces"
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Height
                    </Label>
                    <br />
                    <Row>
                      {/* <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (ft)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Ft`}
                          value={height}
                          name="height"
                          id="height"
                          onChange={handleChange}
                        />
                      </Col> */}
                      <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (feet)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Feet`}
                          value={feet}
                          name="feet"
                          id="feet"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col xs="12" md="6">
                        <Label htmlFor="current_password" className="labelsss">
                          (inches)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Inches`}
                          value={inches}
                          name="inches"
                          id="inches"
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Profession
                    </Label>
                    <Multiselect
                      options={professions}
                      selectedValues={selectedProfession}
                      onSelect={onSelectState}
                      onRemove={onRemoveState}
                      singleSelect={true}
                      displayValue="name"
                      placeholder="Select Profession"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Date of Birth
                      <em style={{ color: "red" }}>*</em>
                    </Label>
                    {/* <Input
                      type="date"
                      value={dob}
                      onChange={handleChange}
                      name="dob"
                      max={moment(new Date()).format("yyyy-MM-DD")}
                    /> */}
                    <DatePicker
                      selected={dobDate}
                      onChange={(date) => handleDobDate(date)}
                      placeholderText="Select date of birth"
                      maxDate={new Date()}
                      isClearable
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Image
                    </Label>
                    {image === "" ? (
                      <div>
                        <img
                          src={require("../../assets/avatars/user-icons@3x.png")}
                          alt="default iamge"
                          className="listimages"
                        />
                      </div>
                    ) : (
                      <div>
                        <img
                          src={image}
                          alt={`${name}`}
                          className="listimages"
                        />
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              {params.Id ? (
                <button
                  variant="contained"
                  className="logout mr-2"
                  onClick={() => submitHandler()}
                >
                  <i className="zmdi zmdi-floppy mr-2"></i> Save
                </button>
              ) : (
                <button
                  variant="contained"
                  className="logout mr-2"
                  onClick={() => submitHandler()}
                >
                  <i className="zmdi zmdi-floppy mr-2"></i>
                  Add
                </button>
              )}
              <button
                variant="contained"
                className="editbtnss"
                onClick={history.goBack}
              >
                <i className="zmdi zmdi-close-circle-o mr-2"></i> Cancel
              </button>
            </CardFooter>
          </Col>
        </Row>
      </RctCollapsibleCard>
      {loading ? (
        <div className="cus_loader">
          <ScaleLoader color="#223263" size={68} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddEditUser;
