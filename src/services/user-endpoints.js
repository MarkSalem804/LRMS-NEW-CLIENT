import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";
// const BASE_URL = "https://tripticket.depedimuscity.com:8050";

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

export default { authenticate };
