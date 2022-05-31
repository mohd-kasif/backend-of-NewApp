const express = require("express");
const app = express();
const fast2sms = require("fast-two-sms");

const PORT = 3002;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("body-parser");
const accountSid = "ACa6213af064b0f9bbac3f4bed7c38ad85";
const authToken = "b5e1f89ed92c7c5cb78d223f81c47f41";
const client = require("twilio")(accountSid, authToken);

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "newdab",
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.get("/", (req, res) => {
//   const myquery = "INSERT INTO phone (ph_num,otp) VALUES (9897296421,9087)";
//   db.query(myquery, (err, result) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     res.send("Successfully added a user");
//     console.log(result);
//   });
//   //   res.send("Hello World");
// });
// app.post("/insert", (req, res) => {
//   const phone_num = req.body.phone_num;
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   const postQuery = "INSERT INTO phone (ph_num,otp) VALUES (?,?)";
//   const check = `SELECT * FROM phone WHERE (ph_num=${phone_num})`;
//   const check_num = db.query(check, (err, result) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(result);
//   });
// });

app.post("/insert", (req, res) => {
  const phone_num = req.body.phone_num;
  const check_q = `SELECT * FROM phone WHERE (ph_num=${phone_num})`;
  db.query(check_q, async (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result.length == 0) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      // var options = {
      //   authorization:
      //     "1IPwxan0rG6tMkLNXO8sBQqoil9p4z5vAgRuUVyTJ32hHdFWZKfJP6hkmo51nAVIXF7H4O0wUpTtBG9N",
      //   message: `Your OTP for Login is:-${otp}`,
      //   numbers: [phone_num],
      // };
      // try {
      //   const response = await fetch("https://api.quotable.io/random");
      //   const data = await response.json();
      // } catch (e) {
      //   console.log(e);
      // }
      // const response = await fast2sms.sendMessage(options);
      // const data =await response.json();
      // console.log(response);
      // res.send(result);
      // console.log(data);
      // console.log("response", response);
      const postQuery = "INSERT INTO phone (ph_num,otp) VALUES (?,?)";
      db.query(postQuery, [phone_num, otp], (e, r) => {
        if (e) {
          console.log(e);
          return;
        }
        res.send(r);
        console.log(r);
      });
    } else {
      const new_otp = Math.floor(1000 + Math.random() * 9000);
      try {
        console.log("in try block");
        // var options = {
        //   authorization:
        //     "NlR4jwyZPfyGGhP71nBNIJlIpsqYvXnohUkizsNRVwniyUESxky2CE7eLQnt",
        //   message: `YOur OTP is:-${new_otp}`,
        //   numbers: [phone_num],
        // };
        const response = await client.messages.create({
          body: `Your OTP for sign in kuants app is:-${new_otp}`,
          from: "+18598006707",
          to: `+91${phone_num}`,
        });
        console.log("brlow try block");
        console.log(response);
        console.log("below response");
      } catch (e) {
        console.log(e);
      }
      // res.send(response);
      // try {
      //   const response = await fetch("https://api.quotable.io/random");
      //   const data = await response.json();
      //   console.log(data);
      // } catch (e) {
      //   console.log(e);
      // }
      const update = `UPDATE phone SET otp=${new_otp} WHERE (ph_num=${phone_num})`;
      db.query(update, new_otp, (e, r) => {
        if (e) {
          console.log(e);
          return;
        }
        res.send(r);
        console.log("result", r);
      });
    }
  });
});

app.get("/get", (req, res) => {
  const getQuery = "SELECT * from phone";
  db.query(getQuery, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(result);
    console.log(result);
  });
});

// app.get("/get/phone", (req, res) => {
//   // const phone_num = req.body.phone_num;
//   const query = "SELECT * from phone";
//   db.query(query, (err, result) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     res.send(result);
//   });
//   // const getQuery=
// });
app.post("/getPhone", (req, res) => {
  const phone_num = req.body.phone_num;
  const query = `SELECT * FROM phone WHERE (ph_num=${phone_num})`;
  db.query(query, (err, result) => {
    if (err) {
      console.log("error", err);
      return;
    }
    res.send(result);
    console.log(result);
  });
});
db.getConnection((err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("db successfully connected");
});
app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
