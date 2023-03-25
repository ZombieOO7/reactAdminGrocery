import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  displayLog,
  apiCall,
  capitalizeFirstLetter,
  confirmBox,
  customApiCall,
} from "../../util/common";
import Switch from "@material-ui/core/Switch";
import ReactPaginate from "react-paginate";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CardBody,
  Input,
} from "reactstrap";

const Users = () => {
  const [list, setList] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(2);
  const [sortBy, setSortBy] = useState("");
  const [sortType, setSortType] = useState("");
  const [searchByName, setSearchByname] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getUserListing();
  }, [searchByName, page_no, sortBy, sortType]);

  useEffect(() => {
    getUserListing();
  }, []);

  const getUserListing = async () => {
    let req_data = {
      page_no: page_no,
      limit: limit,
    };
    if (searchByName) {
      req_data["searchByName"] = searchByName;
    }
    if (sortBy) {
      req_data["sortBy"] = sortBy;
    }
    if (sortType) {
      req_data["sort"] = sortType;
    }
    let { code, data } = await apiCall("POST", "getUserDetails", req_data);
    const { Users, total } = data;
    if (code == 1) {
      let user_array = [...checkedItems];
      let data = Users.forEach((element, index) => {
        console.log("element", element);
        user_array[index] = element.status == 1 ? 1 : 0;
      });
      setCheckedItems(user_array);
      setList(Users);
      setTotal(total);
      setLoading(false);
    } else {
      setList([]);
      setTotal([]);
      setLoading(false);
    }
  };

  const opnAddNewUserModal = () => {
    history.push("/app/users/addeditusers");
  };

  const handleChange = async (e, index, user) => {
    console.log("event", e.target.value, e.target.name);
    let user_array = [...checkedItems];
    user_array[e.target.name] = +e.target.value;
    setCheckedItems(user_array);
    let reqData = {
      user_id: user.user_id,
      status: user.status == 1 ? 0 : 1,
    };
    let { code } = await customApiCall("POST", "activeDeactiveUser", reqData);
    if (code == 1) {
      getUserListing();
      user.status == 1
        ? displayLog(1, "Account deactivated")
        : displayLog(1, "Account activated");
      history.push({ path: "/app/users" });
    }
  };

  const handlePageClick = (e) => {
    setPageNo(e.selected + 1);
  };

  const handleNameChange = (e) => {
    setSearchByname(e.target.value);
    setPageNo(1);
  };

  const handleDelete = async (item) => {
    const { name, user_id } = item;
    if (
      await confirmBox(
        capitalizeFirstLetter(name === null ? "" : name),
        `Are you sure you want to delete`
      )
    ) {
      let reqData = {
        user_id: user_id,
      };
      let { code } = await apiCall("POST", "deleteUserDetails", reqData);
      if (code == 1) {
        getUserListing();
        displayLog(code, "Account has been successfully deleted");
      } else {
        setLoading(false);
      }
    } else {
    }
  };

  const sortingHandler = (sort_by) => {
    if (sortType === "ASC") {
      setSortType("DESC");
      setSortBy(sort_by);
    } else {
      setSortType("ASC");
      setSortBy(sort_by);
    }
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">User Management</h1>

      <RctCollapsibleCard fullBlock>
        <Row>
          <Col xl={12}>
            <CardBody>
              <Row className="align-items-right">
                <Col sm="12" md="4" className="mb-3 mb-xl-0">
                  <span className="has-wrapperss">
                    <span className="left_icon_1">
                      <i className="ti-search"></i>
                    </span>
                    <input
                      className="input_default_1"
                      placeholder="Search User by Name, Email"
                      type="text"
                      value={searchByName}
                      name="searchbyName"
                      onChange={(e) => handleNameChange(e)}
                    />
                  </span>
                </Col>
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
                    <th className="table__header">
                      Name{" "}
                      {/* <i
                        className="fa fa-sort cursor-pointer"
                        aria-hidden="true"
                        onClick={() => sortingHandler("first_name")}
                        title="Sort"
                      ></i> */}
                    </th>
                    <th className="table__header">
                      Email{" "}
                      {/* <i
                        className="fa fa-sort cursor-pointer"
                        aria-hidden="true"
                        onClick={() => sortingHandler("email")}
                        title="Sort"
                      ></i> */}
                    </th>
                    <th className="table__header">Profile Picture</th>
                    <th className="table__header">Login Type</th>
                    <th className="table__header">No. of baby </th>
                    <th className="table__header">
                      Account Status{" "}
                      {/* <i
                        className="fa fa-sort cursor-pointer"
                        aria-hidden="true"
                        onClick={() => sortingHandler("is_active")}
                        title="Sort"
                      ></i> */}
                    </th>
                    <th className="table__header">View Account</th>
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
                              {item.name
                                ? capitalizeFirstLetter(item.name)
                                : "--"}
                            </td>
                            <td style={{ textTransform: "lowercase" }}>
                              {item.email ? item.email : "--"}
                            </td>
                            <td>
                              {item.image == "" ? (
                                <div>
                                  <img
                                    src={require("../../assets/avatars/user-icons@3x.png")}
                                    alt="default iamge"
                                    className="listimages"
                                  />
                                </div>
                              ) : (
                                <img
                                  src={item.image}
                                  alt={`${item.name}`}
                                  className="listimages"
                                />
                              )}
                            </td>
                            <td>
                              {item.register_type === 1
                                ? "Email"
                                : item.register_type === 2
                                ? "Google"
                                : item.register_type === 3
                                ? "Facebook"
                                : "Apple"}
                            </td>
                            <td>{item.No_of_baby}</td>
                            <td
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <Switch
                                title={
                                  item.status == 1
                                    ? "Account is active"
                                    : "Account is deactive"
                                }
                                name={index}
                                value={checkedItems[index] == 1 ? 0 : 1}
                                checked={checkedItems[index] == 1 ? 1 : 0}
                                onChange={(e) => handleChange(e, index, item)}
                              />
                            </td>
                            <td
                              style={{
                                cursor: "pointer",
                                color: "#223263",
                                fontWeight: "500",
                              }}
                            >
                              <Tooltip
                                id="tooltip-fab"
                                title="View User Details"
                              >
                                <Link
                                  to={{
                                    pathname: "Details",
                                    search: `?Id=${item.user_id}`,
                                  }}
                                  style={{
                                    color: "#223263",
                                    fontSize: "25px",
                                  }}
                                >
                                  <i className="zmdi zmdi-eye"></i>
                                </Link>
                              </Tooltip>
                            </td>

                            <td className="list-action">
                              <Tooltip title="Edit User Account">
                                <Link
                                  to={{
                                    pathname: "users/addeditusers",
                                    search: `?Id=${item.user_id}`,
                                  }}
                                >
                                  <i className="delete_new zmdi zmdi-edit"></i>
                                </Link>
                              </Tooltip>
                              <Tooltip
                                id="tooltip-fab"
                                title="Delete User Account"
                              >
                                <button
                                  type="button"
                                  className="rct-link-btn"
                                  onClick={() => handleDelete(item)}
                                >
                                  <i className="delete_new zmdi zmdi-delete"></i>
                                </button>
                              </Tooltip>
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
                {list.length > 0 ? (
                  <tfoot className="border-top">
                    <tr>
                      <td colSpan="100%" className="Align">
                        <ReactPaginate
                          pageCount={Math.ceil(total / limit)}
                          onPageChange={handlePageClick}
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"page-item"}
                          breakLinkClassName={"page-link"}
                          containerClassName={"pagination newpagination"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                          activeClassName={"active"}
                          forcePage={page_no - 1}
                        />
                      </td>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>
          </div>
        </div>
      </RctCollapsibleCard>
    </div>
  );
};

export default Users;
