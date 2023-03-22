import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall, confirmBox, displayLog } from "../../util/common";
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
  audioUrl: "",
  audio_name: "",
  bufferaudio: "",
  image: "",
  description: "",
};

const AddEditMeditation = (props) => {
  const [formField, setFormField] = useState(defaulFormField);
  const {
    name,
    audioUrl,
    image,
    description,
    bufferaudio,
    audio_name,
  } = formField;
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);

  useEffect(() => {
    let rows = 10;
    var output = "";
    for (var i = 1; i <= rows; i++) {
      for (var j = 1; j <= i; j++) {
        output = output + "*" + "  ";
      }
      console.log("*loop", output);
      output = "";
    }

    for (let i = 0; i < rows; i++) {
      var output = "";
      for (let j = 0; j < rows - i; j++) output += " ";
      for (let k = 0; k <= i; k++) output += "* ";
      console.log("*loop", output);
    }
    if (Id) {
      getMeditationById();
    }
    getCategoryListing();
  }, []);

  const getCategoryListing = async () => {
    let { data } = await apiCall("POST", "interestList", null);
    setCategoryList(data);
  };

  const getMeditationById = async () => {
    let requestData = {
      meditation_id: Id,
    };
    const { code, data } = await apiCall(
      "POST",
      "getMeditationById",
      requestData
    );
    const {
      name,
      image,
      description,
      audio,
      interest_name,
      fk_interest_id,
    } = data;
    let images = [];
    images.push({ data_url: image });
    setFormField((prevState) => ({
      ...prevState,
      name: name,
      image: images,
      description: description,
      audioUrl: audio,
    }));

    interest_name === ""
      ? setSelectedCategory((prevState) => {
          return [...prevState, { name: "Select Category" }];
        })
      : setSelectedCategory((prevState) => {
          return [...prevState, { id: fk_interest_id, name: interest_name }];
        });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Category Select
  const onSelectState = async (selectedList, selectedItem) => {
    const { interest_id, name } = selectedItem;
    let arr = [];
    arr.push({
      id: interest_id,
      name: name,
    });
    console.log(arr);
    setSelectedCategory(arr);
  };

  // Category Remove
  const onRemoveState = (selectedList, removedItem) => {
    console.log("removedItem", removedItem);
    setSelectedCategory([]);
  };

  // Image Uploading
  const ImageHandler = (imageList, addUpdateIndex) => {
    setFormField((prevState) => {
      return {
        ...prevState,
        image: imageList,
      };
    });
  };

  //   Uploading meditation audio
  const UploadSong = (e) => {
    let audiosrc = window.URL.createObjectURL(e.target.files[0]);
    setFormField((prevState) => ({
      ...prevState,
      audioUrl: audiosrc,
      bufferaudio: e.target.files[0],
      audio_name: e.target.files[0].name,
    }));
  };

  //   remove Audio
  const removeaudioHandler = async () => {
    if (await confirmBox(undefined, "Are you sure you want to Remove ?")) {
      console.log("Hello");
      setFormField((prevState) => ({
        ...prevState,
        audioUrl: "",
        bufferaudio: "",
        audio_name: "",
      }));
      console.log("audio", audioUrl);
    } else {
    }
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Meditation name is required");
    } else if (description == "" || !description.trim()) {
      displayLog(0, "Meditation description is required");
    } else if (selectedCategory.length <= 0) {
      displayLog(0, "Please select category");
    } else if (image == "") {
      displayLog(0, "Meditation image is required");
    } else if (audioUrl === "") {
      displayLog(0, "Meditation audio is required");
    } else if (bufferaudio?.size > 68157440) {
      displayLog(0, "Meditation audio file size should be less than 65MB");
    } else {
      let formData = new FormData();
      let res;
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (image[0].file) {
        formData.append("image", image[0].file);
      }
      if (selectedCategory.length > 0) {
        formData.append("interest_id", selectedCategory[0].id);
      }
      if (bufferaudio) {
        formData.append("audio", bufferaudio, audio_name);
      }
      if (Id) {
        formData.append("meditation_id", Id);
        res = await apiCall("POST", "editMeditationById", formData);
      } else {
        res = await apiCall("POST", "addMeditationDetails", formData);
      }
      const { code, message } = res;
      if (code == 1) {
        displayLog(code, message);
        history.push({ pathname: "/app/Meditation" });
      } else {
        displayLog(code, message);
      }
    }
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo" onClick={history.goBack}>
            Meditation Management
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
                      Meditation Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Meditation Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Meditation Description
                      <em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      style={{ height: "200px" }}
                      type="textarea"
                      placeholder={`Enter Meditation Description`}
                      value={description}
                      name="description"
                      id="description"
                      onChange={changeHandler}
                      maxLength={300}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Select Category<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Multiselect
                      options={categoryList}
                      selectedValues={selectedCategory}
                      onSelect={onSelectState}
                      onRemove={onRemoveState}
                      singleSelect={true}
                      displayValue="name"
                      placeholder="Select Category"
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Meditation Image
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        (Note: Image dimensions should be 260(width) x
                        260(height) in pixels.)
                      </span>
                    </Label>
                    <ImageUploading
                      multiple
                      value={image}
                      onChange={ImageHandler}
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

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Upload Meditation<em style={{ color: "red" }}>*</em>
                    </Label>
                    <div className="uploadPhotoOuter d-flex align-items-center">
                      <div className="position-relative">
                        <label for="meditaion_song" className="m-0">
                          {audioUrl ? (
                            <audio
                              src={audioUrl}
                              id="meditaion_song"
                              controls
                            />
                          ) : (
                            <input
                              type="file"
                              id="meditation_song"
                              name="img"
                              accept="audio/mp3"
                              onChange={UploadSong}
                            />
                          )}
                        </label>
                      </div>
                      {audioUrl !== "" && (
                        <button
                          type="button"
                          className="btn text-center font-weight-bold remove__button"
                          onClick={removeaudioHandler}
                        >
                          <i class="zmdi zmdi-close-circle zmdi-hc-lg"></i>
                        </button>
                      )}
                    </div>
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

export default AddEditMeditation;
