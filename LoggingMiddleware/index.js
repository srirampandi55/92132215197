const axios = require("axios");

let authToken = ""; // you will set this after authentication

async function Log(stack, level, pkg, message) {
  if (!authToken) {
    console.error("No auth token set for logger");
    return;
  }

  try {
    await axios.post(
      "http://20.244.56.144/eva1uation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Log error", error.message);
  }
}

function setAuthToken(token) {
  authToken = token;
}

module.exports = { Log, setAuthToken };
