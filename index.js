import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Api URL
const apiUrl = "https://secrets-api.appbrewery.com/";

//  Auth Values

import { apiKey } from "./apikey.js";
import { userName } from "./apikey.js";
import { password } from "./apikey.js";
import { token } from "./apikey.js";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Original Page For The server
app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Api response" });
});

// For No Authentication
app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(apiUrl + "random");
    let result = response.data;
    res.render("index.ejs", { content: result.secret });
    console.log(result);
  } catch (error) {
    res.render("index.ejs", {
      content: "Too Many Requests. Please try again 😢",
    });
  }
});

// For Basic Authentication

app.get("/basic", async (req, res) => {
  // Encode to base64
  // const encoded = Buffer.from(userName + ":" + password).toString("base64");

  //   Random numbers for API page
  let ran = Math.floor(Math.random() * 5);
  let dom = Math.floor(Math.random() * 10);
  //    API FETCH
  try {
    const response = await axios.get(apiUrl + `all?page=${ran}`, {
      auth: {
        username: userName,
        password: password,
      },
    });
    let result = response.data;

    res.render("index.ejs", { content: result[dom].secret });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: "Try again" });
  }
});

// for API key
app.get("/key", async (req, res) => {
  //   Random numbers for API page
  let ran = Math.floor(Math.random() * 7);

  //    API FETCH
  try {
    const response = await axios.get(apiUrl + `filter`, {
      params: {
        score: ran,
        apiKey: apiKey,
      },
    });
    let result = response.data;

    let dom = Math.floor(Math.random() * result.length);

    res.render("index.ejs", { content: result[dom].secret });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: error.message });
  }
});

// For Bearer Token
app.get("/token", async (req, res) => {
  //   Random numbers for API page
  let ran = Math.floor(Math.random() * 30);
  //    API FETCH
  try {
    const response = await axios.get(apiUrl + `secrets/${ran}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let result = response.data;

    res.render("index.ejs", { content: result.secret });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", {
      content: "Too Many Requests, Try again later 😪",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} 😎`);
});
