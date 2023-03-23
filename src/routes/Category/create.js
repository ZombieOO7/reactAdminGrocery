import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall, displayLog } from "../../util/common";
import {
  CardBody,
  Col,
  Row,
  CardFooter,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import queryString from "query-string";
import ImageUploading from "react-images-uploading";

const defaultInterestField = {
  name: "",
  image: "",
};
const AddEditInterest = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(defaultInterestField);
  const { name, image } = data;
  const history = useHistory();
  const params = queryString.parse(props.location.search);

  useEffect(() => {
    if (params.Id) {
      getData();
    }
  }, []);

  const getData = async () => {
    let req_data = {
      _id: params.Id,
    };
    let { code, data } = await apiCall("POST", "getCategorybyId", req_data);
    const { name, image } = data;
    if (code == 200) {
      let images = [];
      images.push({ data_url: image });
      setData((prevState) => ({
        ...prevState,
        name: name,
        image: images,
      }));
    }
  };

  const onLogoChange = (imageList, addUpdateIndex) => {
    // console.log("imageList", imageList, imageList.src);
    // let img = new Image();
    // img.src = window.URL.createObjectURL(imageList[0].file);
    // img.onload = () => {
    //   if (img.width === 1012 && img.height === 470) {
    //     displayLog(1, "Image dimension is correct");
    //     setData((prevState) => {
    //       return {
    //         ...prevState,
    //         image: imageList,
    //       };
    //     });
    //     return true;
    //   }
    //   displayLog(0, "Image dimension is not correct.");
    //   return true;
    // };

    setData((prevState) => {
      return {
        ...prevState,
        image: imageList,
      };
    });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Category name is required");
    } else if (image == "") {
      displayLog(0, "Category image is required");
    } else {
      let formData = new FormData();
      let res;
      formData.append("name", name.trim());
      if (image[0].file) {
        formData.append("image", image[0].file);
      }
      if (params.Id) {
        formData.append("id", params.Id);
      }
      if (params && params.Id) {
        res = await apiCall("POST", "categoryManagement", formData);
      } else {
        res = await apiCall("POST", "categoryManagement", formData);
      }
      if (res.code == 200) {
        displayLog(res.code, res.message);
        history.push({ pathname: "/app/category" });
      } else {
        displayLog(res.code, res.message);
      }
    }
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={history.goBack}>
            Category Management
          </span>
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
                      Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Category Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Category Image
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {/* (Note: Image dimensions should be 35(width) x 35(height)
                        in pixels.) */}
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
              {params.Id ? (
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

export default AddEditInterest;
