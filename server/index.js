require("dotenv").config();
const express = require("express"),
  { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env,
  massive = require("massive"),
  session = require("express-session"),
  authCtrl = require("./controllers/authController"),
  app = express(),
  port = SERVER_PORT;
const treasureCtrl = require("./controllers/treasureController"),
  auth = require("./middleware/authMiddleware");

app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then(db => {
  app.listen(port, () => console.log(`Server is running on ${port}`));
  app.set("db", db);
  console.log("db connected");
});

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);

app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.userOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.userOnly, treasureCtrl.addUserTreasure);
app.get("/api/treasure/all", auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
