import React, { useState, useEffect } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { Row, Col, CardBody, CardFooter, Label, FormGroup } from "reactstrap";
import CKEditor from "react-ckeditor-component";
import { apiCall, displayLog } from "../../util/common";

function PrivacyPolicy() {
  const [data, setData] = useState("");

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let req_data = {
      id: 1,
    };
    const res = await apiCall("POST", "getPagePrivacyPolicy", req_data);
    if (res.code == 1) {
      setTimeout(() => {
        setData(res.data.page_description);
      }, 1000);
    }
  };

  const onChange = (evt) => {
    let newContent = evt.editor.getData();
    setData(newContent);
  };

  const onSubmitHandler = async () => {
    let res;
    let reqData = {
      id: 1,
      page_description: data,
    };
    res = await apiCall("POST", "editPagePrivacyPolicy", reqData);
    if (res.code == 1) {
      displayLog(1, "Privacy policy saved successfully");
      getPageData();
    }
  };

  return (
    <div className="animated fadeIn">
      <h2 className="mb-3 mt-3 ml-3 pages_23">Privacy Policy</h2>
      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row>
                <FormGroup style={{ width: "100%" }}>
                  <CKEditor
                    activeclassName="p10"
                    content={data}
                    events={{
                      change: onChange,
                    }}
                  />
                </FormGroup>
              </Row>
            </CardBody>
            <CardFooter>
              <button
                variant="contained"
                className="addbuttons"
                onClick={() => onSubmitHandler()}
              >
                <i className="zmdi zmdi-floppy mr-2"></i> Submit
              </button>
            </CardFooter>
          </Col>
        </Row>
      </RctCollapsibleCard>
    </div>
  );
}

export default PrivacyPolicy;
