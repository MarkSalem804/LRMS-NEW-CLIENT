import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";
// const BASE_URL = "https://sdoic-ilearn.depedimuscity.com:5005";

function authenticate(account) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/login`, account, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        // If 2FA is required, resolve with that info
        if (res.data?.data?.requires2FA) {
          resolve({
            success: true,
            requires2FA: true,
            email: res.data.data.email,
          });
        } else {
          resolve(res.data);
        }
      })
      .catch((err) => {
        if (err.response) {
          reject(err);
        }
        reject(customError);
      });
  });
}

function verifyOtp(email, otpCode) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/users/verify-otp`,
        { email, otpCode },
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

function registerUserWithPicture(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

function deleteUser(id, adminUserId) {
  const url = adminUserId
    ? `${BASE_URL}/users/deleteUser/${id}?adminUserId=${adminUserId}`
    : `${BASE_URL}/users/deleteUser/${id}`;
  return axios.delete(url).then((res) => res.data);
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

function updateProfileWithPicture(userId, formData) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${BASE_URL}/users/updateProfile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

function resendOtp(email) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/users/resend-otp`,
        { email },
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

function getTwoFactorStatus(userId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/users/two-factor-status/${userId}`, {
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

function toggleTwoFactor(userId, enabled) {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        `${BASE_URL}/users/toggle-two-factor/${userId}`,
        { enabled },
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

function getOnlineUsers() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/users/online-users`, {
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

function selfRegister(email) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/users/self-register`,
        { email },
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
  verifyOtp,
  getUserProfile,
  getAllUsers,
  registerUser,
  registerUserWithPicture,
  deleteUser,
  updateUser,
  updateProfile,
  updateProfileWithPicture,
  changePassword,
  resetPassword,
  resendOtp,
  getTwoFactorStatus,
  toggleTwoFactor,
  getOnlineUsers,
  selfRegister,
};
