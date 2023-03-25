import React, { useState, useEffect } from "react";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { Row, Col, CardBody, CardFooter, Label, FormGroup } from "reactstrap";
import CKEditor from "react-ckeditor-component";
import { apiCall, displayLog } from "../../util/common";

function ContactUs() {
  const [data, setData] = useState("");

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let req_data = {
      id: 4,
    };
    const res = await apiCall("POST", "getPageContactUs", req_data);
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
      id: 4,
      page_description: data,
    };
    res = await apiCall("POST", "editPageContactUs", reqData);
    if (res.code == 1) {
      displayLog(1, "Contact us saved successfully");
      getPageData();
    }
  };

  return (
    <div className="animated fadeIn">
      <h2 className="mb-3 mt-3 ml-3 pages_23">Contact Us</h2>
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

export default ContactUs;
