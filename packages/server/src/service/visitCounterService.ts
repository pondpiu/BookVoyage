import * as AWS from "aws-sdk";
import appConfig from "../config";

AWS.config.update({
  accessKeyId: appConfig.accessKeyId,
  secretAccessKey: appConfig.secretAccessKey,
  sessionToken: appConfig.sessionToken,
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

const bucketName = "book-voyage-s3";
const objectKey = "site-data.json";

const jsonData = {
  visitorCount: 0,
};

async function createS3bucket() {
  try {
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
}

// Upload the JSON data to S3
async function uploadJsonToS3(jsonData: Object) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(jsonData), // Convert JSON to string
    ContentType: "application/json", // Set content type
  };

  try {
    await s3.putObject(params).promise();
  } catch (err) {
    console.error("Error uploading JSON file:", err);
  }
}

// Retrieve the object from S3
async function getObjectFromS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.getObject(params).promise();
    // Parse JSON content
    const parsedData = JSON.parse(data.Body.toString("utf-8"));
    return parsedData;
  } catch (err) {
    console.error("Error:", err);
  }
}

export const getSiteVisitCount = async () => {
  const jsonData = {
    visitorCount: 1,
  };

  const data = await getObjectFromS3();
  if (!data) {
    await createS3bucket();
  } else {
    jsonData.visitorCount = data.visitorCount + 1;
  }
  await uploadJsonToS3(jsonData);
  return jsonData.visitorCount;
};
