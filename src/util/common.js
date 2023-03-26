import config from "./config";
import history from "./history";
import axios from "axios";
import { toast, cssTransition } from "react-toastify";
import store from "./store";
import Swal from "sweetalert2";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});

export const customApiCall = async (method, url, reqData, params, header) => {
  return new Promise((resolve, reject) => {
    let headers;
    if (header) {
      headers = header;
    } else {
      headers = {
        language: config.LANGUAGE,
        authorization: config.AUTH_TOKEN,
        device_id: config.DEVICE_ID,
        device_type: 0,
        os: config.OS,
        web_app_version: config.VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      };
    }
    if (localStorage.getItem("AUTH_TOKEN") !== null) {
      headers.authorization = localStorage.getItem("AUTH_TOKEN");
    }
    return axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      headers: headers,
      params: params,
    })
      .then(async (response) => {
        let data = response.data;
        if (data.code == 401) {
          await refreshToken();
        } else if (data.code == 0) {
          history.goBack();
          displayLog(0, data.message);
        } else {
          resolve(data);
        }
      })
      .catch(async (error) => {
        if (error && error.response.data.code == 401) {
          await refreshToken();
        } else if (error && error.response) {
          history.goBack();
          displayLog(0, "Something went wrong, please try again !");
        } else {
          displayLog(0, "Network error!");
        }
        return error;
      });
  });
};

export const apiCall = async (method, url, reqData, params, header) => {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: "START_LOADER",
    });
    let headers;
    if (header) {
      headers = header;
    } else {
      headers = {
        language: config.LANGUAGE,
        authorization: config.AUTH_TOKEN,
        device_id: config.DEVICE_ID,
        device_type: 0,
        os: config.OS,
        web_app_version: config.VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      };
    }
    if (localStorage.getItem("AUTH_TOKEN") !== null) {
      headers.authorization = localStorage.getItem("AUTH_TOKEN");
    }
    return axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      headers: headers,
      params: params,
    })
      .then(async (response) => {
        store.dispatch({
          type: "STOP_LOADER",
        });

        let data = response.data;
        if (data.code == 401) {
          await refreshToken();
        } else if (data.code == 0) {
          displayLog(0, data.message);
        } else {
          resolve(data);
        }
      })
      .catch(async (error) => {
        store.dispatch({
          type: "STOP_LOADER",
        });
        if (error && error.response.data.code == 401) {
          await refreshToken();
        } else if (error && error.response.data.code == 400) {
          displayLog(0, error.response.data.message);
        } else if (error && error.response.data.code == 500) {
          displayLog(0, error.response.data.message);
        }else if (error && error.response) {
          displayLog(0, "Something went wrong, please try again !");
        } else {
          displayLog(0, "Network error!");
        }
        return error;
      });
  });
};

export const refreshToken = () => {
  let refreshTokenHeader = {
    auth_token: localStorage?.getItem("AUTH_TOKEN"),
    language: config.LANGUAGE,
    refresh_token: config.REFRESH_TOKEN_DEFAULT,
    device_id: config.DEVICE_ID,
    device_type: 0,
    os: config.OS,
    android_app_version: config.VERSION,
    ios_app_version: config.VERSION,
  };

  return axios({
    method: "GET",
    url: config.API_BASE_URL + "/refreshToken",
    headers: refreshTokenHeader,
  })
    .then(async (response) => {
      if (response.data.code == 1) {
        localStorage.setItem("AUTH_TOKEN", response.data.data.new_token);
        window.location.reload();
      } else {
        if (
          await confirmBoxRefreshToken(
            "User",
            "Session expired, please login again"
          )
        ) {
          localStorage.clear();
          history.push("/signin");
        } else {
        }
      }
    })
    .catch((error) => {});
};

export const apiCallwithoutHeader = async (method, url, reqData, params) => {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: "START_LOADER",
    });
    return axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      params: params,
    })
      .then((response) => {
        store.dispatch({
          type: "STOP_LOADER",
        });
        let data = response.data;
      })
      .catch(async (error) => {
        store.dispatch({
          type: "STOP_LOADER",
        });
        return error;
      });
  });
};

export const displayLog = (code, message) => {
  if (code == 500) {
    toast.error(message, {
      progress: undefined,
      transition: bounce,
    });
  } else if (code == 200) {
    toast.success(message, {
      progress: undefined,
      transition: bounce,
    });
  } else {
    toast.warning(message, {
      progress: undefined,
      transition: bounce,
    });
  }
};

export const capitalizeFirstLetter = (text) => {
  text = text.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1).trim();
};

export const tConvert = (time) => {
  time = time
    ?.toString()
    ?.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};

tConvert("18:00:00");

export const lowerCaseWithHypen = (text) => {
  return text.toLowerCase().replace(/ /g, "_");
};

export const popBox = (title, message, icon) => {
  return new Promise((resolve, reject) => {
    let obj = {
      title: title,
      text: message,
      showCancelButton: false,
      cancelButtonText: "Cancel",
      confirmButtonText: `OK`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    if (title) obj.title = title;
    if (icon) obj.icon = icon;
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

export const confirmBoxRefreshToken = (title, message) => {
  return new Promise((resolve, reject) => {
    let obj = {
      // title: message,
      text: message,
      showCancelButton: false,
      cancelButtonText: "Cancel",
      confirmButtonText: `Ok`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    if (title) obj.title = title;
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

export const confirmBox = (title, message) => {
  return new Promise((resolve, reject) => {
    let obj = {
      // title: title ? title: null,
      text: title !== undefined ? message.concat(" ", title, " ?") : message,
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: `Yes`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    // if (title) {obj.title = title};
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

export const getCurrentTimeStamp = () => {
  const date = new Date();
  return Math.floor(date.getTime() / 1000);
};

export const timeStampToDate = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  let formatedDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formatedDate;
};
