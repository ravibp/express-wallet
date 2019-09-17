const Register = require("./model/register");
const Transactions = require("./model/transactions");
let url = require("url");
let excel = require("excel4node");
let messagearray = [];
let chatresponse = "";
let querystring = require("querystring");
let fs = require("fs");
let net = require("net");
let zlib = require("zlib");
let db_module = {};

db_module.adddetails = (
  user,
  pass,
  first,
  last,
  contact,
  dob,
  address,
  res
) => {
  const register = new Register({
    username: user,
    pass: pass,
    firstname: first,
    lastname: last,
    contact: contact,
    dob: dob,
    address: address,
    balance: 100
  });
  register.save().then(result => {
    console.log("user added");
    res.writeHead(302, {
      Location: "/loginPage"
    });
    res.end();
  });
};

//Authenticating user while login
db_module.authenticateuser = (user, pass, res) => {
  Register.findOne({ username: user, pass: pass }, (err, person) => {
    if (person === null) {
      console.log("invalid user");
    } else {
      name1 = person["username"];
      dob = person["dob"];
      res.writeHead(302, {
        "Set-Cookie": name1,
        Location: "user/loginhome"
      });
      res.end();
    }
  });
};

//Add money to the user's balance
db_module.addMoney = (username, amt, res) => {
  amtt = parseInt(amt);
  let today = new Date().toLocaleString();
  console.log("Money is getting added on" + today);

  Register.updateOne(
    { username: username },
    { $inc: { balance: amtt } },
    (err, WalletUsers) => {
      Transactions.insertMany(
        {
          username: username,
          amount: amtt,
          transactionType: "Money Added",
          Date: today
        },
        (err, Transactions) => {
          console.log(WalletUsers.nModified);
          if (
            err ||
            WalletUsers.nModified == 0 ||
            Transactions.nInserted == 0
          ) {
            console.log(
              "Error in Updating the Balance and also transaction table "
            );
            console.log(err);
          } else {
            console.log("Balance Updated in DB");
            res.writeHead(302, {
              Location: "/user/myTransactions"
            });

            res.end();
          }
        }
      );
      //Data added in Transactions table Query end
    }
  ); // Balance Updated For User in Add Money
};

//Get transaction details from the user
db_module.getTransactions = (username, res) => {
  Transactions.find(
    { username: username } || {
      transactionType: { $regex: ".*" + username + ".*" }
    },
    (err, Transactions) => {
      if (err || Transactions.length == 0) {
        console.log("Error getting the transactions ");
        res.write(JSON.stringify(Transactions));
        res.end();
      } else {
        console.log("Transactions retrieved");
        let list = Transactions; // printing an array in js
        let date1 = list[0]["Date"];
        let date2 = date1.toString();

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Sheet 1");

        let style = workbook.createStyle({
          font: {
            color: "blue",
            size: 12
          },
          numberFormat: "₹#,##0.00; (₹#,##0.00); -"
        });
        let style1 = workbook.createStyle({
          font: {
            color: "black",
            size: 12
          },
          numberFormat: "₹#,##0.00; (₹#,##0.00); -"
        });

        // Set value of cell A2 to 'string' styled with paramaters of style
        worksheet
          .cell(1, 1)
          .string("Amount")
          .style(style1);
        worksheet
          .cell(1, 2)
          .string("Transaction Type")
          .style(style1);
        worksheet
          .cell(1, 3)
          .string("Date")
          .style(style1);

        for (let i = 0; i < list.length; i++) {
          worksheet
            .cell(i + 2, 1)
            .number(list[i]["amount"])
            .style(style);
          worksheet
            .cell(i + 2, 2)
            .string(list[i]["transactionType"])
            .style(style);
          worksheet
            .cell(i + 2, 3)
            .string(date2)
            .style(style);
        }
        workbook.write("output/Transactions.xlsx");
        let gzip = zlib.createGzip();
        let read = fs.createReadStream("output/Transactions.xlsx");
        let write = fs.createWriteStream("output/Transactions.xlsx.gz");
        read.pipe(gzip).pipe(write);
        let transactfile = JSON.stringify(list);
        res.write(transactfile);
        res.end();
      }
    }
  ); // Transactions Query End
};

db_module.createChat = (request, response) => {
  let query = url.parse(request.url).query;
  let chatmessage = querystring.parse(query)["chatmessage"];
  messagearray.push(chatmessage);
  let client = net.connect({ port: 1234 }, () => {
    client.write(chatmessage);
    chatresponse = "";
    client.on("data", data => {
      let dataarray = data.toString().split(" ");
      for (i = 0; i < dataarray.length; i++) {
        if ("recharge" === dataarray[i]) {
          message1 =
            "Login with your credentials and go to the Pay Elsewhere tab to recharge your mobile";
          chatresponse =
            "<div style='margin: auto;width: 400px;overflow:hidden;padding: auto;background:green;border-radius: 10px;color:white;position:relative;top:1600px;left:425px;padding:10px;font-size:15px'>" +
            "<b>" +
            message1 +
            "<b>" +
            "</div>";
          dataarray = " ";
        }
        if ("add" === dataarray[i]) {
          message1 =
            "Login with your credentials and we will offer you service to add money to your wallet ";
          chatresponse =
            "<div style='margin: auto;width: 400px;overflow:hidden;padding: auto;background:green;border-radius: 10px;color:white;position:relative;top:1600px;left:425px;padding:10px;font-size:15px'>" +
            "<b>" +
            message1 +
            "<b>" +
            "</div>";
          dataarray = " ";
        }
        if ("send" === dataarray[i]) {
          message1 =
            "Login with your credentials and we will offer you service to send money to your beneficiary";
          chatresponse =
            "<div style='margin: auto;width: 400px;overflow:hidden;padding: auto;background:green;border-radius: 10px;color:white;position:relative;top:1600px;left:425px;padding:10px;font-size:15px'>" +
            "<b>" +
            message1 +
            "<b>" +
            "</div>";
          dataarray = " ";
        }
      }
      if (dataarray != " ") {
        message1 = "Hello user, Please Login or signup for our services";
        chatresponse =
          "<div style='margin: auto;width: 300px;overflow:hidden;padding: auto;background:green;border-radius: 10px;color:white;position:relative;top:1600px;left:375px;padding:10px;font-size:15px'>" +
          "<b>" +
          message1 +
          "<b>" +
          "</div>";
      }

      fs.readFile("./views/home.html", (err, html) => {
        if (err) {
          throw err;
        }

        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(chatresponse);
        response.write(html);
        response.end();
        client.end();
      });
    });

    client.on("end", () => {
      console.log("disconnected from server");
    });
  });
};
//check the  transactions
db_module.checkbalance = (username, amount, res) => {
  Register.findOne({ username: username }, (err, person) => {
    if (err) {
      console.log(err);
    } else {
      if (person["balance"] < amount) {
        res.writeHead(302, {
          Location: "/errormoney"
        });

        res.end();
      } else {
        let username = person["username"];
        let remainingamt = person["balance"] - amount;
        let today = new Date().toLocaleString();
        Register.updateOne(
          { username: username },
          { $set: { balance: remainingamt } },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              Transactions.insertMany(
                {
                  username: username,
                  amount: amount,
                  transactionType: "Money sent",
                  Date: today
                },
                (err, Transactions) => {
                  console.log(data.nModified);

                  if (
                    err ||
                    data.nModified == 0 ||
                    Transactions.nInserted == 0
                  ) {
                    console.log(
                      "Error in Updating the Balance and also transaction table "
                    );
                    res.write(err);
                    res.end();
                  } else {
                    console.log("Balance Updated in DB");
                    res.writeHead(302, {
                      Location: "/user/myTransactions"
                    });

                    res.end();
                  }
                }
              );
            }
          }
        );
      }
    }
  });
};
//booking tickets and update the transactions
db_module.bookmovie = (username, tktamount, res) => {
  Register.findOne({ username: username }, (err, person) => {
    if (err) {
      console.log(err);
    } else {
      if (person["balance"] < tktamount) {
        res.writeHead(302, {
          Location: "/errormoney"
        });

        res.end();
      } else {
        let username = person["username"];
        let remainingamt = person["balance"] - tktamount;
        let today = new Date().toLocaleString();
        Register.updateOne(
          { username: username },
          { $set: { balance: remainingamt } },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log(data);

              Transactions.insertMany(
                {
                  username: username,
                  amount: tktamount,
                  transactionType: "Movie Booking",
                  Date: today
                },
                (err, Transactions) => {
                  console.log(data.nModified);

                  if (
                    err ||
                    data.nModified == 0 ||
                    Transactions.nInserted == 0
                  ) {
                    console.log(
                      "Error in Updating the Balance and also transaction table "
                    );
                    res.write(err);
                    res.end();
                  } else {
                    console.log("Balance Updated in DB");
                    res.writeHead(302, {
                      Location: "/user/myTransactions"
                    });

                    res.end();
                  }
                }
              );
            }
          }
        );
      }
    }
  });
};
//Recharge the mobile number and update the balance
db_module.rechargedone = (username, rechargeamt, mobnum, res) => {
  Register.findOne({ username: username }, (err, person) => {
    if (err) {
      console.log(err);
    } else {
      if (person["balance"] < rechargeamt) {
        res.writeHead(302, {
          Location: "/errormoney"
        });

        res.end();
      } else {
        let username = person["username"];
        let remainingamt = person["balance"] - rechargeamt;
        let today = new Date().toLocaleString();
        Register.updateOne(
          { username: username },
          { $set: { balance: remainingamt } },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              Transactions.insertMany(
                {
                  username: username,
                  amount: rechargeamt,
                  transactionType: "Recharge done for " + mobnum,
                  Date: today
                },
                (err, Transactions) => {
                  console.log(data.nModified);

                  if (
                    err ||
                    data.nModified == 0 ||
                    Transactions.nInserted == 0
                  ) {
                    console.log(
                      "Error in Updating the Balance and also transaction table "
                    );
                    res.write(err);
                    res.end();
                  } else {
                    console.log("Balance Updated in DB");
                    res.writeHead(302, {
                      Location: "/user/myTransactions"
                    });

                    res.end();
                  }
                }
              );
            }
          }
        );
      }
    }
  });
};

//purchase giftvoucher
db_module.purchasegift = (username, giftamt, res) => {
  Register.findOne({ username: username }, (err, person) => {
    if (err) {
      console.log(err);
    } else {
      if (person["balance"] < giftamt) {
        res.writeHead(302, {
          Location: "/errormoney"
        });

        res.end();
      } else {
        let username = person["username"];
        let remainingamt = person["balance"] - giftamt;
        let today = new Date().toLocaleString();
        Register.updateOne(
          { username: username },
          { $set: { balance: remainingamt } },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              Transactions.insertMany(
                {
                  username: username,
                  amount: giftamt,
                  transactionType: "Gift Voucher",
                  Date: today
                },
                (err, Transactions) => {
                  console.log(data.nModified);
                  if (
                    err ||
                    data.nModified == 0 ||
                    Transactions.nInserted == 0
                  ) {
                    console.log(
                      "Error in Updating the Balance and also transaction table "
                    );
                    res.write(err);
                    res.end();
                  } else {
                    console.log("Balance Updated in DB");
                    res.writeHead(302, {
                      Location: "/user/myTransactions"
                    });

                    res.end();
                  }
                }
              );
            }
          }
        );
      }
    }
  });
};

//Getprofiledata for viewProfile
db_module.getdata = (username, res) => {
  Register.findOne({ username: username }, (err, person) => {
    if (err || person === null) {
      console.log(err);
    } else {
      let list = person; // printing an array in js
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(list));
      res.end();
    }
  });
};

//get username by cookies
db_module.parsecookies = request => {
  rc = request.headers.cookie;
  return rc;
};

module.exports = db_module;
