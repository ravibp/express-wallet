const fs = require("fs");
const url = require("url");
const mongoose = require("mongoose");
const querystring = require("querystring");
const connection = mongoose.connect("mongodb://localhost:27017/users");
const db_module = require("../public/javascripts/db_module");
let amt;

//Reading the file and sending html as response
const renderHTML = (path, response, request) => {
  fs.readFile(path, null, (err, data) => {
    if (err) {
      response.writeHead(404);
      response.write("file not found");
    } else {
      console.log(path);

      response.write(data);
    }
    response.end();
  });
};

const routehandlers = (req, res) => {
  const path = url.parse(req.url).pathname; // we will get pathname

  console.log(path);

  if (path == "/images/Car1.png") {
    res.writeHead(200, { "Content-type": "image/png" });
    let img = fs.readFileSync("public/images/Car1.png", "binary");
    res.write(img, "binary");
  }
  if (path == "/images/Car2.png") {
    res.writeHead(200, { "Content-type": "image/png" });
    let img = fs.readFileSync("public/images/Car2.png", "binary");

    res.write(img, "binary");
  }

  if (path == "/images/Car3.png") {
    res.writeHead(200, { "Content-type": "image/png" });
    let img = fs.readFileSync("public/images/Car3.png", "binary");
    res.write(img, "binary");
  }
  if (path == "/images/Picture4.png") {
    res.writeHead(200, { "Content-type": "image/png" });
    res.write(
      fs.readFileSync("public/images/Picture4.png", "binary"),
      "binary"
    );
  }
  if (path == "/images/p1.jpg") {
    res.writeHead(200, { "Content-type": "image/jpg" });
    let img = fs.readFileSync("public/images/p1.jpg", "binary");
    res.write(img, "binary");
  }
  if (path == "/images/Picture1.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/Picture1.png", "binary"),
      "binary"
    );
  }
  if (path == "/images/bg4.jpg") {
    res.writeHead(200, { "Content-Type": "image/jpg" });
    res.write(fs.readFileSync("public/images/bg4.jpg", "binary"), "binary");
  }
  if (path == "/images/movie1.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(fs.readFileSync("public/images/movie1.png", "binary"), "binary");
  }
  if (path == "/images/lalaland.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/lalaland.png", "binary"),
      "binary"
    );
  }
  if (path == "/images/GiftCard_500.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/GiftCard_500.PNG", "binary"),
      "binary"
    );
  }
  if (path == "/images/GiftCard_2000.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/GiftCard_2000.PNG", "binary"),
      "binary"
    );
  }
  if (path == "/images/GiftCard_terms.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/GiftCard_terms.PNG", "binary"),
      "binary"
    );
  }
  if (path == "/images/Picture2.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(
      fs.readFileSync("public/images/Picture2.PNG", "binary"),
      "binary"
    );
  }
  if (path == "/stylesheets/businesscasual.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    let fileContents = fs.readFileSync(
      "public/stylesheets/businesscasual.css",
      "utf8"
    );
    res.write(fileContents);
  }
  if (path == "/stylesheets/newStyle.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    let fileContents = fs.readFileSync(
      "public/stylesheets/newStyle.css",
      "utf8"
    );
    res.write(fileContents);
  }

  switch (path) {
    case "/": {
      renderHTML("./views/home.html", res, req);
      break;
    }
    case "/loginPage":
      renderHTML("./views/login.html", res, req);
      break;
    case "/save":
      console.log("Request For Save Received");
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        qs = querystring.parse(data1);
        user = qs["name"];
        pass = qs["pass"];
        first = qs["firstname"];
        last = qs["lastname"];
        contact = qs["phoneNumber"];
        dob = qs["DOB"];
        address = qs["address"];
        db_module.adddetails(
          user,
          pass,
          first,
          last,
          contact,
          dob,
          address,
          res
        );
      });

      break;
    case "/register":
      connection.then(result => {
        console.log("connected");
      });
      renderHTML("./views/signup.html", res, req);
      break;

    case "/login": {
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        qs = querystring.parse(data1);
        user = qs["username"];
        pass = qs["pass"];
        db_module.authenticateuser(user, pass, res);
      });
      break;
    }
    case "/user/loginhome": {
      renderHTML("./views/loginhome.html", res, req);
      break;
    }

    case "/chat": {
      db_module.createChat(req, res);
      break;
    }

    case "/home": {
      username = db_module.parsecookies(req);
      renderHTML("./views/profile.html", res, req);
      break;
    }
    case "/addMoney": {
      renderHTML("./views/addMoney.html", res, req);
      break;
    }
    case "/payElse": {
      renderHTML("./views/payElse.html", res, req);
      break;
    }
    case "/Movies": {
      renderHTML("./views/movies.html", res, req);
      break;
    }
    case "/getMovieList": {
      console.log("JSON FILE Request Received");
      let rawdata = fs.readFileSync("data/moviesNew.json");
      let movies = JSON.parse(rawdata);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(movies));
      break;
    }

    case "/user/myTransactions": {
      renderHTML("./views/myTransactions.html", res, req);
      break;
    }
    case "/getMyTransactions": {
      userName = db_module.parsecookies(req);
      db_module.getTransactions(userName, res);
      break;
    }
    case "/GiftVoucher": {
      renderHTML("./views/giftvoucher.html", res, req);
      break;
    }
    case "/sendMoney": {
      renderHTML("./views/sendmoney.html", res, req);
      break;
    }
    case "/Recharge": {
      renderHTML("./views/recharge.html", res, req);
      break;
    }

    case "/validCard": {
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        console.log("Request For checking Card validity is received");
        qs = querystring.parse(data1);
        month = qs["validTill"];
        amount = qs["amount"];
        userName = db_module.parsecookies(req);
        db_module.addMoney(userName, amount, res);
      });
      break;
    }
    case "/logout": {
      res.writeHead(302, {
        Location: "/"
      });
      res.end();
      break;
    }
    case "/validUser": {
      console.log("hello valid user");
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        console.log("Request For checking Card validity is received");
        qs = querystring.parse(data1);
        username = qs["user"];
        amt = qs["amount"];
        if (username === db_module.parsecookies(req)) {
          renderHTML("./views/validsender.html", res, req);
        } else {
          let user = db_module.parsecookies(req);
          db_module.checkbalance(user, amt, res);
        }
      });

      break;
    }
    case "/errormoney": {
      renderHTML("./views/errormoney.html", res, req);
      break;
    }

    case "/bookMovie": {
      let qs = querystring.parse(url.parse(req.url).query);
      username = db_module.parsecookies(req);
      movie = qs["movie_name"];
      tickets = qs["ticket_count"];
      tktamt = parseInt(tickets) * 100;

      db_module.bookmovie(username, tktamt, res);
      break;
    }

    case "/sendGift": {
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        qs = querystring.parse(data1);
        if (parseInt(data1.split("=")[1]) === 1) {
          giftamt = 500;
        } else {
          giftamt = 2000;
        }
        let user = db_module.parsecookies(req);
        db_module.purchasegift(user, giftamt, res);
      });
      break;
    }

    case "/rechargeSuccess": {
      let data1 = "";
      req.on("data", chunk => {
        data1 += chunk;
      });
      req.on("end", () => {
        console.log("Recharge done");
        qs = querystring.parse(data1);
        mobnum = parseInt(qs["phoneNumber"]);
        rechargeamt = parseInt(qs["amount"]);
        let user = db_module.parsecookies(req);
        db_module.rechargedone(user, rechargeamt, mobnum, res);
      });
      break;
    }

    case "/getdata": {
      let user = db_module.parsecookies(req);
      db_module.getdata(user, res);
      break;
    }

    case "/download": {
      const query = url.parse(req.url, true).query;
      if (typeof query.file === "undefined") {
        //specify Content will be an attachment
        res.setHeader(
          "Content-disposition",
          "attachment; filename=theDocument.txt"
        );
        res.setHeader("Content-type", "text/plain");
        res.end("Hello, here is a file for you!");
      } else {
        //read the image using fs and send the image content back in the response
        fs.readFile("../Express_wallet/" + query.file, (err, content) => {
          if (err) {
            res.writeHead(400, { "Content-type": "text/html" });
            console.log(err);
            res.end("No such file");
          } else {
            //specify Content will be an attachment
            res.setHeader(
              "Content-disposition",
              "attachment; filename=" + query.file
            );
            res.end(content);
          }
        });
      }
      break;
    }

    default:
      res.write("routes not defined");
      res.end();
  }
};

module.exports = routehandlers;
