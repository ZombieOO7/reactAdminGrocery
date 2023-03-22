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
import { Multiselect } from "multiselect-react-dropdown";

const defaulFormField = {
  name: "",
  image: "",
  description: "",
};

const AddEditMilestone = (props) => {
  const [milestoneFields, setMilestoneField] = useState(defaulFormField);
  const { name, image, description } = milestoneFields;
  const [selectedAgeRange, setSelectedAgeRange] = useState([]);
  const [ageRangeListing, setAgeRangeListing] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [monthListing, setMonthListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);

  useEffect(() => {
    if (Id) {
      getMilestoneRecord();
    }
    getAgeRangeListing();
    getMonthListing();
  }, []);

  const getAgeRangeListing = async () => {
    let { data } = await apiCall("POST", "getAgeRange", null);
    setAgeRangeListing(data);
  };

  const getMonthListing = async () => {
    let { data } = await apiCall("POST", "getMonthList", null);
    setMonthListing(data);
  };

  const getMilestoneRecord = async () => {
    let requestData = {
      milestone_id: Id,
    };
    let { code, data } = await apiCall("POST", "getMilestoneById", requestData);
    console.log("data", data);
    const {
      name,
      image,
      description,
      range_name,
      age_range,
      month_name,
      year,
    } = data;
    if (code === 1) {
      let images = [];
      images.push({ data_url: image });
      setMilestoneField((prevState) => ({
        ...prevState,
        name: name,
        image: images,
        description: description,
      }));
    }

    month_name && age_range === ""
      ? setSelectedMonth((prevState) => {
          return [...prevState, { name: "Select Age Range" }];
        })
      : setSelectedMonth((prevState) => {
          return [...prevState, { id: age_range, month_name: month_name }];
        });
    range_name && year === ""
      ? setSelectedAgeRange((prevState) => {
          return [...prevState, { name: "Select Month" }];
        })
      : setSelectedAgeRange((prevState) => {
          return [...prevState, { id: year, range_name: range_name }];
        });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setMilestoneField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSelectState = async (selectedList, selectedItem) => {
    let keyName;

    for (var property in selectedItem) {
      keyName = property;
    }
    let arr = [];
    arr.push({
      id:
        keyName == "month_name" ? selectedItem.month_id : selectedItem.range_id,
      [keyName]:
        keyName == "month_name"
          ? selectedItem.month_name
          : selectedItem.range_name,
    });
    console.log(arr);
    if (keyName == "month_name") {
      setSelectedMonth(arr);
    } else {
      setSelectedAgeRange(arr);
    }
  };

  const onRemoveState = (selectedList, removedItem) => {
    console.log("remo", removedItem);
    let keyName;

    for (var property in removedItem) {
      keyName = property;
    }
    console.log(keyName);
    if (keyName == "month_name") {
      setSelectedMonth([]);
    } else {
      setSelectedAgeRange([]);
    }
  };

  const onLogoChange = (imageList, addUpdateIndex) => {
    setMilestoneField((prevState) => {
      return {
        ...prevState,
        image: imageList,
      };
    });
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Milestone name is required");
    } else if (description == "" || !description.trim()) {
      displayLog(0, "Milestone description is required");
    } else if (selectedMonth.length <= 0) {
      displayLog(0, "Please Select Month Range");
    } else if (selectedAgeRange.length <= 0) {
      displayLog(0, "Please select Age Range");
    } else if (image == "") {
      displayLog(0, "Milestone image is required");
    } else {
      let formData = new FormData();
      let res;
      formData.append("name", name.trim());
      formData.append("description", description);
      if (image[0].file) {
        formData.append("image", image[0].file);
      }
      if (selectedMonth.length > 0) {
        formData.append("age_range", selectedMonth[0].id);
      }
      if (selectedAgeRange.length > 0) {
        formData.append("year", selectedAgeRange[0].id);
      }
      if (Id) {
        formData.append("milestone_id", Id);
        res = await apiCall("POST", "editMilestoneDetails", formData);
      } else {
        res = await apiCall("POST", "addMilestoneDetails", formData);
      }
      if (res.code == 1) {
        displayLog(res.code, res.message);
        history.push({ pathname: "/app/Milestone" });
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
            Milestone Management
          </span>
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
                <Col xs="12" md="8">
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      <em style={{ color: "red" }}>*</em>&nbsp;&nbsp;Shows
                      mandatory fields
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Milestone Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Milestone Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Milestone Description
                      <em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      style={{ height: "200px" }}
                      type="textarea"
                      placeholder={`Enter Milestone Description`}
                      value={description}
                      name="description"
                      id="description"
                      onChange={changeHandler}
                      maxLength={300}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Select Month Range<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Multiselect
                      options={monthListing}
                      selectedValues={selectedMonth}
                      onSelect={onSelectState}
                      onRemove={onRemoveState}
                      singleSelect={true}
                      displayValue="month_name"
                      placeholder="Select Month Range"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Select Age Range<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Multiselect
                      options={ageRangeListing}
                      selectedValues={selectedAgeRange}
                      onSelect={onSelectState}
                      onRemove={onRemoveState}
                      singleSelect={true}
                      displayValue="range_name"
                      placeholder="Select Age Range"
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Milestone Image
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        (Note: Image dimensions should be 158(width) x
                        158(height) in pixels.)
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

export default AddEditMilestone;
