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

const defaulFormField = {
  name: "",
  content: "",
};

const AddEditNotification = (props) => {
  const [formField, setFormField] = useState(defaulFormField);
  const { name, content } = formField;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Id } = queryString.parse(props.location.search);

  useEffect(() => {
    if (Id) {
      getNotificationById();
    }
  }, []);

  const getNotificationById = async () => {
    let requestData = {
      notification_id: Id,
    };
    const { code, data } = await apiCall(
      "POST",
      "getNotificationById",
      requestData
    );
    const { name, content } = data;
    let images = [];
    setFormField((prevState) => ({
      ...prevState,
      name: name,
      content: content,
    }));
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    if (name == "" || !name.trim()) {
      displayLog(0, "Notification Title is required");
    } else if (content == "" || !content.trim()) {
      displayLog(0, "Notification Body is required");
    } else {
      let res;
      let requestData = {
        name: name,
        content: content,
      };
      if (Id) {
        requestData["notification_id"] = Id;
        res = await apiCall("POST", "updateNotificationById", requestData);
      } else {
        res = await apiCall("POST", "addNotification", requestData);
      }
      const { code, message } = res;
      if (code == 1) {
        displayLog(code, message);
        history.push({ pathname: "/app/Notification" });
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
            Notification Management
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
                <Col xs="12" md="6">
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      <em style={{ color: "red" }}>*</em>&nbsp;&nbsp;Shows
                      mandatory fields
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Notification Title<em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Enter Notification Title`}
                      value={name}
                      name="name"
                      id="name"
                      onChange={changeHandler}
                      maxLength={50}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="current_password" className="labelsss">
                      Notification Body
                      <em style={{ color: "red" }}>*</em>
                    </Label>
                    <Input
                      style={{ height: "200px" }}
                      type="textarea"
                      placeholder={`Enter Notification Body`}
                      value={content}
                      name="content"
                      id="content"
                      onChange={changeHandler}
                      maxLength={500}
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

export default AddEditNotification;
