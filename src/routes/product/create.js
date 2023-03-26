import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { apiCall, displayLog } from "../../util/common";
import CKEditor from "react-ckeditor-component";
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
  category: "",
  subCategory: ""
};

const AddEditProduct = (props) => {
  const [articlesFields, setArticlesField] = useState(defaulFormField);
  const { name, image, subCategory, category, description } = articlesFields;
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoryListing, setCategoryListing] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [subCategoryListing, setSubCategoryListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const params = queryString.parse(props.location.search);

  useEffect(() => {
    if (params.Id) {
      getProduct();
    }
    getCategoryListing();
  }, []);

  const getCategoryListing = async () => {
    var response = await apiCall("POST", "getCategoryListings", null);
    console.log('response =======>', response)
    if (response.code == 200) {
      var { categories } = response.data;
      setCategoryListing(categories);
    } else {
      setCategoryListing([]);
    }
  };
  const getSubCategoryListing = async (requestData) => {
    if (requestData) {
      let response = await apiCall("POST", "subcategory/list", requestData);
      if (response.code == 200) {
        var { subCategories } = response.data;
        setSubCategoryListing(subCategories);
      }
    } else {
      // setSubCategoryListing([]);
    }
  };

  const getProduct = async () => {
    var reqData = {
      _id: params.Id
    };
    let { code, data } = await apiCall("POST", "product/detail", reqData);
    const {
      name,
      image,
      category,
      subCategory,
      description,
    } = data;
    if (code === 200) {
      // let images = [];
      // images.push({ data_url: image });
      setArticlesField((prevState) => ({
        ...prevState,
        name: name,
        image: image,
        description: description,
        category: category,
        subCategory: subCategory,
      }));
      getSubCategoryListing({ _id: category._id });
    }

    category === "" ?
      setSelectedCategory((prevState) => {
        return [...prevState, { name: "Select Category" }];
      }) :
      setSelectedCategory((prevState) => {
        return [...prevState, { id: category._id, name: category.name }];
      });
      subCategory === "" ?
        setSelectedSubCategory((prevState) => {
          return [...prevState, { name: "Select Sub Category" }];
        }) :
        setSelectedSubCategory((prevState) => {
          return [...prevState, { id: subCategory._id, name: subCategory.name }];
        });
  };

  const onChange = (evt) => {
    let newContent = evt.editor.getData();
    setArticlesField((prevState) => {
      return {
        ...prevState,
        description: newContent,
      };
    });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setArticlesField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSelectState = async (selectedList, selectedItem) => {
    const { _id, name } = selectedItem;
    let arr = [];
    arr.push({
      id: _id,
      name: name,
    });
    setSelectedCategory(arr);
    getSubCategoryListing({ _id: _id });
  };

  const onRemoveState = (selectedList, removedItem) => {
    setSelectedCategory([]);
  };

  const onSelectSubCategory = async (selectedList, selectedItem) => {
    const { _id, name } = selectedItem;
    let arr = [];
    arr.push({
      id: _id,
      name: name,
    });
    setSelectedSubCategory(arr);
    getSubCategoryListing({ _id: _id });
  };

  const onRemoveSubCategory = (selectedList, removedItem) => {
    setSelectedSubCategory([]);
  };

  const onLogoChange = (imageList, addUpdateIndex) => {
    imageList = imageList.filter(element=>{
      if('data_url' in element == true){
        return element;
      }
    })
    setArticlesField((prevState) => {
      return {
        ...prevState,
        image: imageList,
      };
    });
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Product name is required");
    } else if (selectedCategory.length <= 0) {
      displayLog(0, "Please select category");
    } else if (selectedSubCategory.length <= 0) {
      displayLog(0, "Please select sub category");
      // else if (selectedMilestones.length <= 0) {
      //   displayLog(0, "Please select milestone");
      // }
    } else if (image == "") {
      displayLog(0, "Product image is required");
    } else {
      let formData = new FormData();
      let res;
      formData.append("name", name.trim());
      image.forEach(element => {
        if(element.file){
          formData.append("image", element.file);
        }
      });
      if (selectedCategory.length > 0) {
        formData.append("category", selectedCategory[0].id);
      }
      if (selectedSubCategory.length > 0) {
        formData.append("subCategory", selectedSubCategory[0].id);
      }
      if (description) {
        formData.append("description", description);
      }
      if (params.Id) {
        formData.append("_id", params.Id);
      }
      if (params && params.Id) {
        res = await apiCall("POST", "product/create", formData);
      } else {
        res = await apiCall("POST", "product/create", formData);
      }
      if (res.code == 200) {
        displayLog(res.code, res.message);
        history.push({ pathname: "/app/products" });
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
            Product Management
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
                      Name<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Product Name`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Select Category<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Multiselect
                      options={categoryListing}
                      selectedValues={selectedCategory}
                      onSelect={onSelectState}
                      onRemove={onRemoveState}
                      singleSelect={true}
                      displayValue="name"
                      placeholder="Select Category"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Select Sub Category<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Multiselect
                      options={subCategoryListing}
                      selectedValues={selectedSubCategory}
                      onSelect={onSelectSubCategory}
                      onRemove={onRemoveSubCategory}
                      singleSelect={true}
                      displayValue="name"
                      placeholder="Select Sub Category"
                    />
                  </FormGroup>
                  <FormGroup className="">
                    <Label htmlFor="current_password" className="labelsss">
                      Image
                      <em style={{ color: "red" }}>*</em>
                      {"  "}
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        (Note: Image dimension should be 208(height) in pixels.)
                      </span>
                    </Label>
                    <ImageUploading
                      multiple
                      value={image}
                      onChange={onLogoChange}
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
                                  src={image["data_url"]||image.image}
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
                  <FormGroup style={{ width: "100%" }}>
                    <Label htmlFor="current_password" className="labelsss">
                      Article Description<em style={{ color: "red" }}>*</em>
                    </Label>
                    <CKEditor
                      activeclassName="p10"
                      content={description}
                      events={{
                        change: onChange,
                      }}
                    />
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

export default AddEditProduct;
