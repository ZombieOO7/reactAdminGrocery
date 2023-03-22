import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  displayLog,
  apiCall,
  capitalizeFirstLetter,
  confirmBox,
} from "../../util/common";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import { Col, Row, CardBody } from "reactstrap";
import CKEditor from "react-ckeditor-component";

const CmsPageListing = () => {
  const [list, setList] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getCmsPageListing();
  }, []);

  const getCmsPageListing = async () => {
    let { code, data } = await apiCall("POST", "cms/list", null);
    if (code == 1) {
      setList(data);
      setLoading(false);
    } else {
      setList([]);
      setLoading(false);
    }
  };

  // const opnAddNewUserModal = () => {
  //   history.push("/app/Consultant/AddEditConsultant");
  // };

  // const handleDelete = async (item) => {
  //   const { name, consultant_id } = item;
  //   if (
  //     await confirmBox(
  //       capitalizeFirstLetter(name === null ? "" : name),
  //       `Are you sure you want to delete`
  //     )
  //   ) {
  //     let reqData = {
  //       consultant_id: consultant_id,
  //     };
  //     let { code } = await apiCall("POST", "deleteConsultantById", reqData);
  //     if (code == 1) {
  //       getCmsPageListing();
  //       displayLog(code, "Consultant has been successfully deleted");
  //     } else {
  //       setLoading(false);
  //     }
  //   } else {
  //   }
  // };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Pages Management</h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                {/* <Col
                  sm="6"
                  md="3"
                  className="mb-3 mb-xl-0"
                  style={{ position: "relative", right: "0" }}
                >
                  <div className="ml-2">
                    <button
                      className="exportbutton"
                      onClick={handleRedirection}
                      style={{ width: "225px" }}
                    >
                      <i class="zmdi zmdi-plus-circle zmdi-hc-lg"></i>
                      Add New Category
                    </button>
                  </div>
                </Col> */}
              </Row>
            </CardBody>
          </Col>
        </Row>
        <div className="table-responsive">
          <div className="table-responsive">
            <div className="unseen">
              <table className="table table-middle table-hover mb-0">
                <thead>
                  <tr>
                    <th className="table__header">Sr.No.</th>
                    <th className="table__header">Title </th>
                    {/* <th className="table__header">Content</th> */}
                    <th className="table__header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true ? null : (
                    <>
                      {list?.length > 0 ? (
                        list.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1 + (page_no - 1) * limit}</td>
                            <td>
                              {item.title
                                ? capitalizeFirstLetter(item.title)
                                : "--"}
                            </td>

                            {/* <td>
                              {item.content
                                ? capitalizeFirstLetter(item.content)
                                : "--"}
                            </td> */}
                            <td className="list-action">
                              <Tooltip title="Edit CMS Page">
                                <Link
                                  to={{
                                    pathname: "CMSPages/AddEditCmsPage",
                                    search: `?Id=${item.cms_id}`,
                                  }}
                                >
                                  <i class="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              {/* <Tooltip
                                id="tooltip-fab"
                                title="Delete Consultant Account"
                              >
                                <button
                                  type="button"
                                  className="rct-link-btn"
                                  onClick={() => handleDelete(item)}
                                >
                                  <i class="delete_new zmdi zmdi-delete"></i>
                                </button>
                              </Tooltip> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={11} style={{ textTransform: "none" }}>
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RctCollapsibleCard>
    </div>
  );
};

export default CmsPageListing;
