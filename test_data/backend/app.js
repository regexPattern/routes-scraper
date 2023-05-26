const express = require("express");
const _ = require("lodash");
const mysql = require("mysql");
// const bodyParser = require('body-parser');
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require("util");
var myArgs = process.argv.slice(2);

const auth0 = require("./src/utils/auth0");

// module variables
const pjson = require("./package.json");
const config = require("./config/config.json");
const defaultConfig = config.local;
const environment = myArgs[0] || "local";
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// routes begin here ---------------------------------------------

const googleRoutes = require("./src/routes/googleRoutes");
const mailerRoutes = require("./src/routes/mailerRoutes");
const platformRoutes = require("./src/routes/platformRoutes");
const tagsRoutes = require("./src/routes/tagRoutes");
const keywordRoutes = require("./src/routes/keywordRoutes");
const forecastRoutes = require("./src/routes/forecastRoutes");
const geoRoutes = require("./src/routes/geoRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const analysisRoutes = require("./src/routes/analysisRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const skillRoutes = require("./src/routes/skillRoutes");
const resourcesRoutes = require("./src/routes/resourcesRoutes");
const userRoutes = require("./src/routes/userRoutes");
const causalRoutes = require("./src/routes/causalRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const jiraRoutes = require("./src/routes/jiraRoutes");
const feedbackRoutes = require("./src/routes/feedbackRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const contractRoutes = require("./src/routes/contractRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const scopeRoutes = require("./src/routes/scopeRoutes");
const reviewsRoutes = require("./src/routes/reviewsRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const ngramRoutes = require("./src/routes/ngramRoutes");
const hiringRoutes = require("./src/routes/hiringRoutes");
const financeRoutes = require("./src/routes/financeRoutes");
const fileUploadRoutes = require("./src/routes/fileUploadRoutes");
const authRoutes = require("./src/routes/authRoutes");
const googleAnalyticsRoutes = require("./src/routes/googleAnalyticsRoutes");
const otherRoutes = require("./src/routes/otherRoutes");

const startListener = require("./src/utils/startListener");

// Create the Express application
var app = express();

app.use(cors()); // allow cross origin requests

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// ----------------------------------------------------------------------------------------
// FUTURE: capture all version mismatch...  not sure how to tell the UI to handle this
// ----------------------------------------------------------------------------------------

app.use((req, res, next) => {
  if (req.headers.version === pjson.version) {
    next();
  } else {
    res
      .status(400)
      .end(
        "VERSION MISMATCH - server=" +
          pjson.version +
          " , client=" +
          req.headers.version +
          ".  Please refresh your browser and try again..."
      );
  }
});

var mysql_pool = mysql.createPool({
  host: finalConfig.db_host,
  user: finalConfig.db_user,
  password: finalConfig.db_password,
  database: finalConfig.db_name,
  connectionLimit: 10,
  multipleStatements: true,
});

var mysql_apipool = mysql.createPool({
  host: finalConfig.db_host,
  user: finalConfig.db_user,
  password: finalConfig.db_password,
  database: finalConfig.db_api_name,
  connectionLimit: 10,
  multipleStatements: true,
});

// node native promisify
const query = util.promisify(mysql_pool.query).bind(mysql_pool);

const apiquery = util.promisify(mysql_apipool.query).bind(mysql_apipool);

app.get("/", (_, res) => {
  res.send("this is an secure server");
});

app.get("/api/status/version", (_, res) => {
  res.send({ version: pjson.version });
});

app.use("/api/analysis", auth0, analysisRoutes({ query }));

app.use("", authRoutes({ query }));

app.use("/api/causal", causalRoutes({ query, auth0 }));

app.use("/api", clientRoutes({ query, auth0 }));

app.use("/api/content", contentRoutes({ query, auth0 }));

app.use("/api", contractRoutes({ query, auth0 }));

app.use("/api", departmentRoutes({ query, auth0 }));

app.use("/api", auth0, feedbackRoutes({ query }));

app.use("/api", fileUploadRoutes({ query, auth0 }));

app.use("/api/finance", financeRoutes({ query, auth0 }));

app.use("/api", auth0, forecastRoutes({ query }));

app.use("/api", geoRoutes({ query, auth0 }));

app.use("/api", goalRoutes({ query, auth0 }));

app.use("/api", auth0, googleAnalyticsRoutes({ query: apiquery }));

app.use("/google", auth0, googleRoutes({ query: apiquery }));

app.use("/api/hiring", hiringRoutes({ query, auth0 }));

app.use("/api", jiraRoutes({ query, auth0 }));

app.use("/api", auth0, keywordRoutes({ query }));

app.use("/api", mailerRoutes({ query }));

app.use("/api/ngram", ngramRoutes({ query, auth0 }));

app.use("/api", notificationRoutes({ query, auth0 }));

app.use("", otherRoutes({ query, auth0 }));

app.use("/api/platform", platformRoutes({ query, auth0 }));

app.use("/api", projectRoutes({ query, auth0 }));

app.use("/api/reports", reportRoutes({ query, auth0 }));

app.use("/api/resources", auth0, resourcesRoutes({ query }));

app.use("/api", reviewsRoutes({ query, auth0 }));

app.use("/api", auth0, roleRoutes({ query }));

app.use("/api", scopeRoutes({ query, auth0 }));

app.use("/api", auth0, skillRoutes({ query }));

app.use("/api", auth0, tagsRoutes({ query }));

app.use("/api", teamRoutes({ query, auth0 }));

app.use("/api", userRoutes({ query, auth0 }));

startListener({ finalConfig, app });
