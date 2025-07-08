const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotEnv = require("dotenv");
const samvyo = require("samvyo-nodejs-sdk/dest/samvyo-nodejs-sdk.js");

dotEnv.config();
app.use(cors());
app.use(express.json());

const serverUrl = "https://api.samvyo.com";
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

app.post("/api/file-processing", async (req, res) => {

  //outputQualities,bucket,region will be taken by deafult from the dashboard settings
  //If not configured in the dashboard, then they should be passed in the request body along with inputFiles
  //inputFiles should be an array of objects with the following structure:
  // inputFiles: [{
  //     type: "mp4",
  //     url: "https://your-bucket.region.digitaloceanspaces.com/videos/input.mp4",
  //     key: "videos/folder1/folder2" // optional
  //   }],
  //   outputQualities: ["360p", "720p", "1080p"], // optional
  //   bucket: "your-bucket", // optional
  //   region: "your-region" // optional

  const { inputFiles, outputQualities, bucket, region } = req.body;
  console.log("inside file-processing");
  try {
    const dummyRoomId = "dummy-room-id-4";
    const response = await axios.post(
      `${serverUrl}/api/siteSetting/sessionToken`,
      {
        accessKey,
        secretAccessKey,
        roomId: dummyRoomId,
      }
    );
 
    // Uncomment the following line to see the response data
    // This will help you debug and see the session token and other details
    // console.log("response", response.data);

    if (response.data.success) {
      const sessionToken = response.data.sessionToken;

      const sdkInstance = await samvyo.NodeJsSdk.init({
        sessionToken,
        roomId: dummyRoomId,
        peerName: "dummy-peer-name",
      });

      // Uncomment the following line to see the sdkInstance object
      // This will help you debug and see the methods available on the sdkInstance
      // console.log("sdkInstance", sdkInstance);

      sdkInstance.on("initSuccess", async () => {
        console.log("SDK initialized successfully");
        const result = await sdkInstance.startProcessing({
          inputFiles,
        });
        console.log("result", result);
      });

      sdkInstance.on("initError", (error) => {
        console.error("Error initializing SDK:", error);
      });

      sdkInstance.on("processingStarted", (data) => {
        console.log("Processing started:", data);
      });

      sdkInstance.on("processingError", (error) => {
        console.error("Error during file processing:", error);
      });

      sdkInstance.on("processingCompleted", (details) => {
        console.log("Processing completed successfully:", details);
      });

      return res.status(200).send({
        success: true,
        message: "File processing initiated successfully",
      });
    }

    return res.status(400).send({
      success: false,
      message: "Failed to fetch session token for file processing",
    });
  } catch (error) {
    console.error("Error in file processing:", error);
    console.log("Error message", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });
  }
});

const port = process.env.PORT || 3600;

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.listen(port, () => {
  console.log(`Secure server running on port ${port}`);
});
