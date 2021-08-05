// Imports
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const ec2 = new AWS.EC2();

function listInstances() {
  return new Promise((resolve, reject) => {
    ec2.describeInstances({}, (err, data) => {
      if (err) reject(err);
      else
        resolve(data.Reservations.reduce((i, r) => i.concat(r.Instances), []));
    });
  });
}

function terminateInstance(instanceId) {
  const params = {
    InstanceIds: [instanceId],
  };

  return new Promise((resolve, reject) => {
    ec2.terminateInstances(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// listInstances().then((data) => console.log(data));
terminateInstance("i-0be865a1fa01c1e56").then((data) => console.log(data));
