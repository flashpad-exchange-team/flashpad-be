const express = require("express");
require("dotenv").config();

const { startCronJobs } = require("./pairCreated-event-job");

const app = express();
const PORT = process.env.PORT || 4000;

startCronJobs();

// Start the express server and listen on the specified port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
