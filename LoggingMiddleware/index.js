const axios = require("axios");
let authToken = "";
async function Log(stack, level, pkg, message) {
  if (!authToken) {
    console.error("No auth token set for logger");
    return;
  }
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Log sent:", response.data.message);
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
}
function setAuthToken(token) {
  authToken = token;
}
module.exports = { Log, setAuthToken };
