// Imports
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const ec2 = new AWS.EC2();
const volumeId = "vol-0e362d7bb62d303a2";
const instanceId = "i-038fd686471713e6e";

detachVolume(volumeId)
  .then(() => attachVolume(instanceId, volumeId))
  .then(console.log)
  .catch((error) => console.error(error));

function detachVolume(volumeId) {
  const params = {
    VolumeId: volumeId,
  };

  return ec2.detachVolume(params).promise();
}

function attachVolume(instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: "/dev/sdf",
  };

  return ec2.attachVolume(params).promise();
}
