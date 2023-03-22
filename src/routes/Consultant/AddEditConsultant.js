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
import ScaleLoader from "react-spinners/ScaleLoader";
import ImageUploading from "react-images-uploading";
import validator from "validator";

const defaultUserDetails = {
  address: "",
  email: "",
  image: "",
  name: "",
  url: "",
};

const AddEditConsultant = (props) => {
  const [userDetail, setUserDetail] = useState(defaultUserDetails);
  const { name, description, email, image, address, url } = userDetail;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if (Id) {
      getConsultantById();
    }
  }, []);

  const getConsultantById = async () => {
    let reqData = {
      consultant_id: Id,
    };
    let { data } = await apiCall("POST", "getConsultantById", reqData);
    const { name, image, email, address, calendly_url, description } = data;
    let images = [];
    images.push({ data_url: image });
    setUserDetail((prevState) => {
      return {
        ...prevState,
        address: address,
        email: email,
        url: calendly_url,
        image: images,
        name: name,
        description: description,
      };
    });
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Consultant name is required");
    } else if (description == "" || !description) {
      displayLog(0, "Consultant description is required");
    } else if (email == "" || !email.trim()) {
      displayLog(0, "Consultant email is required");
    } else if (!validator.isEmail(email)) {
      displayLog(0, "Please enter valid Email");
    } else if (address === "" || !address.trim()) {
      displayLog(0, "Consultant type is required");
    } else if (url === "" || !url.trim()) {
      displayLog(0, "Calendly url is required");
    } else if (!validator.isURL(url)) {
      displayLog(0, "Please enter valid Url");
    } else if (image == "") {
      displayLog(0, "Consultant image is required");
    } else {
      let formData = new FormData();
      let res;
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("email", email.trim());
      formData.append("address", address.trim());
      formData.append("calendly_url", url.trim());
      if (image[0].file) {
        formData.append("image", image[0].file);
      }
      if (Id) {
        formData.append("consultant_id", Id);
        res = await apiCall("POST", "editConsultantDetails", formData);
      } else {
        res = await apiCall("POST", "addConsultantDetails", formData);
      }
      if (res.code == 1) {
        displayLog(res.code, res.message);
        history.push({ pathname: "/app/Consultant" });
      } else {
        displayLog(res.code, res.message);
      }
    }
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const goUser = () => {
    history.push("/app/Consultant");
  };

  const onLogoChange = (imageList, addUpdateIndex) => {
    setUserDetail((prevState) => {
      return {
        ...prevState,
        image: imageList,
      };
    });
  };

  return (
    <div className="animated fadeIn">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={goUser}>
            Consultant Management
          </span>{" "}
        </div>
        <button className="cus_btn" onClick={history.goBack}>
          <i class="cus_arr zmdi zmdi-arrow-left"></i>&nbsp;BACK
        </button>
      </h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row>
                <Col xs="12" md="8">
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      <em style={{ color: "red" }}>*</em>&nbsp;&nbsp;Shows
                      mandatory fields
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Consultant Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Consultant Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Consultant Description<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      style={{ height: "200px" }}
                      type="textarea"
                      placeholder={`Enter Consultant Description`}
                      value={description}
                      name="description"
                      id="description"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Consultant Email<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Consultant Email`}
                      value={email}
                      name="email"
                      id="email"
                      onChange={handleChange}
                      maxLength={100}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Consultant Type<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Consultant Type`}
                      value={address}
                      name="address"
                      id="address"
                      onChange={handleChange}
                      maxLength={250}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Calendly URL<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Calendly Url`}
                      value={url}
                      name="url"
                      id="url"
                      onChange={handleChange}
                      maxLength={250}
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Consultant Profile Picture
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        (Note: Image dimensions should be 152(height) in
                        pixels.)
                      </span>
                    </Label>
                    <ImageUploading
                      multiple
                      value={image}
                      onChange={onLogoChange}
                      maxNumber={1}
                      dataURLKey="data_url"
                      name="image"
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                      }) => (
                        <div className="upload__image-wrapper">
                          <button
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                            className="uploadphoto"
                          >
                            Click or Drop here
                          </button>
                          &nbsp;
                          {imageList.length > 0
                            ? imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                  <img
                                    src={image["data_url"]}
                                    alt=""
                                    width="100"
                                    className="mt-3 listimages"
                                  />
                                  <div className="image-item__btn-wrapper">
                                    <i
                                      className="ti-pencil position-relative imageedit"
                                      aria-hidden="true"
                                      onClick={() => onImageUpdate(index)}
                                      title="Edit Image"
                                    ></i>{" "}
                                    <i
                                      className="ti-close  position-relative imagedelete"
                                      onClick={() => onImageRemove(index)}
                                      title="Delete Image"
                                    ></i>
                                  </div>
                                </div>
                              ))
                            : null}
                        </div>
                      )}
                    </ImageUploading>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              {Id ? (
                <button
                  variant="contained"
                  className="logout mr-2"
                  onClick={() => submitHandler()}
                >
                  <i class="zmdi zmdi-floppy mr-2"></i> Save
                </button>
              ) : (
                <button
                  variant="contained"
                  className="logout mr-2"
                  onClick={() => submitHandler()}
                >
                  <i class="zmdi zmdi-floppy mr-2"></i>
                  Add
                </button>
              )}
              <button
                variant="contained"
                className="editbtnss"
                onClick={history.goBack}
              >
                <i class="zmdi zmdi-close-circle-o mr-2"></i> Cancel
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

export default AddEditConsultant;
