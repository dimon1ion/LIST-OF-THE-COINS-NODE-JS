const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./database");

const CoinsService = require("./services/coins.service");
const coins = require("./services/coins.controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/coins", coins);



async function main(){
    const connection = await connectToDatabase();
  
    CoinsService.initConnection(connection);
  
    app.listen(3001, () => console.log("App listening port 3001!"));
}
  
main();