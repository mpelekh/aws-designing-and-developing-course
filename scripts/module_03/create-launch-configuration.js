const AWS = require("aws-sdk");
const helpers = require("./helpers");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const autoScaling = new AWS.AutoScaling();

const lcName = "hamsterLC";
const roleName = "hamsterLCRole";
const sgName = "hamster_sg";
const keyName = "hamster_key";

helpers
  .createIamRole(roleName)
  .then((profileArn) => createLaunchConfiguration(lcName, profileArn))
  .then((data) => console.log(data));

function createLaunchConfiguration(lcName, profileArn) {
  const params = {
    IamInstanceProfile: profileArn,
    ImageId: "ami-0d70430f9c3cf8f2f",
    InstanceType: "t2.micro",
    LaunchConfigurationName: lcName,
    KeyName: keyName,
    SecurityGroups: [sgName],
    UserData:
      "IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQKY2QgaGJmbApzdWRvIG5wbSBpCnN1ZG8gbnBtIHJ1biBzdGFydA==",
  };

  return autoScaling.createLaunchConfiguration(params).promise();
}
