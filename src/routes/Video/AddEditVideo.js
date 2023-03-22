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
import ReactPlayer from "react-player";

const defaulFormField = {
  name: "",
  videoUrl: "",
  video_name: "",
  buffervideo: "",
  image: "",
  description: "",
  youtubeurllink: "",
  vimeourllink: "",
};

const AddEditVideo = (props) => {
  const [formField, setFormField] = useState(defaulFormField);
  const {
    name,
    videoUrl,
    image,
    description,
    buffervideo,
    video_name,
    youtubeurllink,
    vimeourllink,
  } = formField;
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [urlType, setUrlType] = useState(1);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);

  const handleUrlType = (e) => {
    console.log("value", e.target.value);
    setFormField((prevState) => ({
      ...prevState,
      youtubeurllink: "",
      vimeourllink: "",
    }));
    setUrlType(e.target.value);
  };

  useEffect(() => {
    if (Id) {
      getVideoById();
    }
    getCategoryListing();
  }, []);

  const getCategoryListing = async () => {
    let { data } = await apiCall("POST", "interestList", null);
    setCategoryList(data);
  };

  const getVideoById = async () => {
    let requestData = {
      video_id: Id,
    };
    const { code, data } = await apiCall("POST", "getVideoById", requestData);
    const {
      name,
      image,
      description,
      // video,
      video,
      interest_name,
      fk_interest_id,
      type,
    } = data;
    let images = [];
    images.push({ data_url: image });
    setFormField((prevState) => ({
      ...prevState,
      name: name,
      image: images,
      description: description,
      // videoUrl: video,
    }));

    setUrlType(type);

    if (type == 1) {
      setFormField((prevState) => ({
        ...prevState,
        youtubeurllink: video,
      }));
    }

    if (type == 2) {
      setFormField((prevState) => ({
        ...prevState,
        vimeourllink: video,
      }));
    }

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

  //   Uploading Video
  const UploadVideo = (e) => {
    let videosrc = window.URL.createObjectURL(e.target.files[0]);

    setFormField((prevState) => ({
      ...prevState,
      videoUrl: videosrc,
      buffervideo: e.target.files[0],
      video_name: e.target.files[0].name,
    }));
  };

  //   remove Audio
  const removeVideoHandler = async () => {
    if (await confirmBox(undefined, "Are you sure you want to Remove ?")) {
      setFormField((prevState) => ({
        ...prevState,
        videoUrl: "",
        buffervideo: "",
        video_name: "",
      }));
    } else {
    }
  };

  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Video name is required");
    } else if (description == "" || !description.trim()) {
      displayLog(0, "Video description is required");
    } else if (selectedCategory.length <= 0) {
      displayLog(0, "Please select category");
    } else if (image == "") {
      displayLog(0, "Video image is required");
    } else if (urlType == 1 && youtubeurllink == "") {
      displayLog(0, "YouTube URL is required");
    } else if (
      urlType == 1 &&
      youtubeurllink != "" &&
      !regex.test(youtubeurllink)
    ) {
      displayLog(0, "YouTube URL is not valid!");
    } else if (urlType == 2 && vimeourllink == "") {
      displayLog(0, "Vimeo URL is required");
    } else if (
      urlType == 2 &&
      vimeourllink != "" &&
      !regex.test(vimeourllink)
    ) {
      displayLog(0, "Vimeo URL is not valid!");
    }

    // else if (videoUrl == "") {
    //   displayLog(0, "Video is required");
    // } else if (buffervideo?.size > 68157440) {
    //   displayLog(0, "Video file size should be less than 65MB");
    // }
    else {
      // displayLog(1, "done");
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
      formData.append("type", urlType);
      if (urlType == 1) {
        formData.append("video", youtubeurllink);
      }
      if (urlType == 2) {
        formData.append("video", vimeourllink);
      }
      if (buffervideo) {
        formData.append("video", buffervideo, video_name);
      }
      if (Id) {
        formData.append("video_id", Id);
        res = await apiCall("POST", "editVideoById", formData);
      } else {
        res = await apiCall("POST", "addVideoDetails", formData);
      }
      const { code, message } = res;
      if (code == 1) {
        displayLog(code, message);
        history.push({ pathname: "/app/Video" });
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
            Video Management
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
                      Video Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Video Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Video Description
                      <em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      style={{ height: "200px" }}
                      type="textarea"
                      placeholder={`Enter Video Description`}
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
                      Video Image
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        (Note: Image dimensions should be 187(width) x
                        114(height) in pixels.)
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

                  {/* <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Upload Video<em style={{ color: "red" }}>*</em>
                    </Label>
                    <div className="uploadPhotoOuter d-flex align-items-center">
                      <div className="position-relative">
                        <label htmlFor="video" className="m-0">
                          {videoUrl ? (
                            <ReactPlayer
                              url={videoUrl}
                              controls
                              width={"480px"}
                              height={"240px"}
                            />
                          ) : (
                            <input
                              type="file"
                              id="video"
                              name="video"
                              accept="video/*"
                              onChange={UploadVideo}
                            />
                          )}
                        </label>
                      </div>
                      {videoUrl !== "" && (
                        <button
                          type="button"
                          className="btn text-center font-weight-bold remove__button"
                          onClick={removeVideoHandler}
                        >
                          <i class="zmdi zmdi-close-circle zmdi-hc-lg"></i>
                        </button>
                      )}
                    </div>
                  </FormGroup> */}

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss mt-3">
                      Select URL Type<em style={{ color: "red" }}>*</em> :{" "}
                      <span
                        style={{
                          position: "relative",
                          left: "13px",
                          top: "2px",
                        }}
                      >
                        <div className="form-check form-check-inline">
                          <input
                            style={{ cursor: "pointer" }}
                            className="form-check-input"
                            type="radio"
                            value={1}
                            checked={urlType == 1 ? true : ""}
                            onChange={(e) => handleUrlType(e)}
                          />
                          <label
                            className="form-check-label"
                            for="inlineRadio1"
                          >
                            YouTube
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            style={{ cursor: "pointer" }}
                            className="form-check-input"
                            type="radio"
                            value={2}
                            checked={urlType == 2 ? true : ""}
                            onChange={(e) => handleUrlType(e)}
                          />
                          <label
                            className="form-check-label"
                            for="inlineRadio2"
                          >
                            Vimeo
                          </label>
                        </div>
                      </span>
                    </Label>
                  </FormGroup>

                  {urlType == 1 ? (
                    <FormGroup>
                      <Label htmlFor="current_password" className="labelsss">
                        YouTube URL
                        <em style={{ color: "red" }}>*</em>
                      </Label>
                      <Input
                        type="text"
                        placeholder={`Enter YouTube URL`}
                        value={youtubeurllink}
                        name="youtubeurllink"
                        id="youtubeurllink"
                        onChange={changeHandler}
                        maxLength={300}
                      />
                    </FormGroup>
                  ) : null}
                  {urlType == 2 ? (
                    <FormGroup>
                      <Label htmlFor="current_password" className="labelsss">
                        Vimeo URL
                        <em style={{ color: "red" }}>*</em>
                      </Label>
                      <Input
                        type="text"
                        placeholder={`Enter Vimeo URL`}
                        value={vimeourllink}
                        name="vimeourllink"
                        id="vimeourllink"
                        onChange={changeHandler}
                        maxLength={300}
                      />
                    </FormGroup>
                  ) : null}
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

export default AddEditVideo;
