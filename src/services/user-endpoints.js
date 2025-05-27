import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";
// const BASE_URL = "https://ilearn-beta.depedimuscity.com:5001";

function authenticate(account) {
  console.log("[user-endpoints] authenticate called with:", account);
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/login`, account, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        console.log("[user-endpoints] Response received:", res.data);
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

export default {
  authenticate,
  getAllUsers,
  registerUser,
  deleteUser,
  updateUser,
  updateProfile,
};
