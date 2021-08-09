// Imports
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const s3 = new AWS.S3();

createBucket("hamster-bucket-mpelekh").then((data) => console.log(data));

function createBucket(bucketName) {
  const params = {
    Bucket: bucketName,
    ACL: "public-read",
  };

  return s3.createBucket(params).promise();
}
