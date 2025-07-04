import axios from "axios";

const customError = new Error("Network error or no response");
// const BASE_URL = "http://localhost:5001";
const BASE_URL = "https://ilearn-beta.depedimuscity.com:5001";

function authenticate(account) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/login`, account, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.error("[user-endpoints] Error response:", err.response);
          reject(err);
        }
        console.error("[user-endpoints] Network or unknown error:", err);
        reject(customError);
      });
  });
}

function getAllUsers() {
  return axios.get(`${BASE_URL}/users/getAllUsers`).then((res) => res.data);
}

function registerUser(userData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/register`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

function deleteUser(id) {
  return axios
    .delete(`${BASE_URL}/users/deleteUser/${id}`)
    .then((res) => res.data);
}

function getUserProfile(id) {
  return axios
    .get(`${BASE_URL}/users/getUserProfile/${id}`)
    .then((res) => res.data);
}

function updateUser(id, userData) {
  return axios
    .put(`${BASE_URL}/users/updateUser/${id}`, userData)
    .then((res) => res.data);
}

function updateProfile(userId, profileData) {
  return axios
    .put(`${BASE_URL}/users/updateProfile/${userId}`, profileData)
    .then((res) => res.data);
}

function changePassword(userId, profileData) {
  return axios
    .patch(`${BASE_URL}/users/changePassword/${userId}`, profileData)
    .then((res) => res.data);
}

function resetPassword(email, newPassword) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/users/resetPassword`,
        { email, newPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

export default {
  authenticate,
  getUserProfile,
  getAllUsers,
  registerUser,
  deleteUser,
  updateUser,
  updateProfile,
  changePassword,
  resetPassword,
};
