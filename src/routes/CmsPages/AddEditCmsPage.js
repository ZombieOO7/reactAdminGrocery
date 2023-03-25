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
import CKEditor from "react-ckeditor-component";

const defaultCmsDetails = {
  content: "",
  title: "",
};

const AddEditCmsPage = (props) => {
  const [cmsDetails, setCmsDetails] = useState(defaultCmsDetails);
  const { content, title } = cmsDetails;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);

  useEffect(() => {
    if (Id) {
      getCmsDetailById();
    }
  }, []);

  const getCmsDetailById = async () => {
    let reqData = {
      cms_id: Id,
    };
    let { data } = await apiCall("POST", "cms/detail", reqData);
    const { content, title } = data;
    setCmsDetails((prevState) => {
      return {
        ...prevState,
        title: title,
        content: content,
      };
    });
  };

  const submitHandler = async () => {
    let res;
    if (title == "" || !title) {
      displayLog(0, "CMS Page title is required");
    } else if (content == "" || !content) {
      displayLog(0, "CMS Page content is required");
    } else {
      let reqData = {
        title: title,
        content: content,
      };
      if (Id) {
        reqData["cms_id"] = Id;
        res = await apiCall("POST", "cms/update", reqData);
      }
      // else {
      //   res = await apiCall("POST", "addConsultantDetails", reqData);
      // }
      if (res.code == 1) {
        displayLog(res.code, res.message);
        history.push({ pathname: "/app/CMSPages" });
      } else {
        displayLog(res.code, res.message);
      }
    }
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setCmsDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChange = (evt) => {
    let newContent = evt.editor.getData();
    setCmsDetails((prevState) => {
      return {
        ...prevState,
        content: newContent,
      };
    });
  };

  const goUser = () => {
    history.push("/app/CMSPages");
  };

  return (
    <div className="animated fadeIn">
      <h1 className="main_text_h1 mb-4">
        <div className="custom-breadcrumb">
          <span className="cus_ppo">Edit CMS Page</span>{" "}
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
                      Page Title<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      // style={{ height: "200px" }}
                      type="text"
                      placeholder={`Enter Page Title`}
                      value={title}
                      name="title"
                      id="title"
                      onChange={handleChange}
                      // maxLength={50}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Page Content<em style={{ color: "red" }}>*</em>
                    </Label>
                    <CKEditor
                      activeclassName="p10"
                      content={content}
                      events={{
                        change: onChange,
                      }}
                    />
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

export default AddEditCmsPage;
