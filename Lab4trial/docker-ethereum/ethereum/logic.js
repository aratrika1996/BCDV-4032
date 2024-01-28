const fs = require("fs-extra");
const {web3} = require("./web3");
const compileContract = require("./build/Message.json");
const mongoose = require("mongoose");
const Message = require("../server/models/message")

// Contract object deployed on network (ganache-cli or testnet or mainnet)
// network can be selected in web3 file

// cont
const getContractObject = () => {
    
    const contractReceipt = require("./receipt-ganache.json");
    // create a contract object/instance 
    const contractObject = new web3.eth.Contract(
        JSON.parse(compileContract.interface),
        contractReceipt.address
    );

    return contractObject;
};

const setMessage = async (newMessage) => {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject();
    const receipt = await contractObject.methods
                    .setMessage(newMessage)
                    .send({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("Message successfully saved!");
    await saveMessageToMongoDB(newMessage);
    return receipt;
};

const getMessage = async () => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .getMessage()
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

async function saveMessageToMongoDB(message) {
    // Connect to MongoDB
    await mongoose.connect("mongodb://root:password@mongodb:27017/docker_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {username: 'root', password: 'password'},
      authSource: 'admin'
    });
  
    // Create a new Message document and save it to MongoDB
    const newMessage = new Message({
      content: message
    });
  
    try {
        const savedMessage = await newMessage.save();
        console.log('Message saved successfully:', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }

    // console.log("message saved to db")
  
    // Disconnect from MongoDB
    // await mongoose.disconnect();
  }


module.exports = {
    setMessage,
    getMessage
};