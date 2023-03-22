import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiCall } from "../../util/common";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(null);

  const history = useHistory();
  
  useEffect(() => {
    // getTotalUsers();
  }, [totalUsers]);

  const getTotalUsers = async () => {
    let data = await apiCall("POST", "getDashboardTotal");
    if (data.code == 1) {
      setTotalUsers(data.data.total);
    }
  };

  const handleRedirect = () => {
    history.push({ pathname: "/app/users" });
  };

  return (
    <div className="user-management">
      <h1 className="main_text_h1 mb-4">Dashboard</h1>
      <>
        <div className="row">
          <div
            className="col-sm-2 text-center"
            onClick={() => handleRedirect()}
            style={{ cursor: "pointer" }}
          >
            <div className="shadow p-3 mb-5 rounded box_shadow box_fo_siz">
              <div>{totalUsers !== null ? <span>{totalUsers}</span> : "0"}</div>
              <div>Users</div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
