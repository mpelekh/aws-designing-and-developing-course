// Imports
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

// Declare local variables
const autoScaling = new AWS.AutoScaling();
const asgName = "hamsterASG";
const lcName = "hamsterLC";
const policyName = "hamsterPolicy";
const tgArn =
  "arn:aws:elasticloadbalancing:us-east-1:528816537240:targetgroup/hamsterTG/ec2f5d54b1e3d906";

createAutoScalingGroup(asgName, lcName)
  .then(() => createASGPolicy(asgName, policyName))
  .then((data) => console.log(data));

function createAutoScalingGroup(asgName, lcName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: ["us-east-1a", "us-east-1b"],
    TargetGroupARNs: [tgArn],
    LaunchConfigurationName: lcName,
    MaxSize: 2,
    MinSize: 1,
  };

  return autoScaling.createAutoScalingGroup(params).promise();
}

function createASGPolicy(asgName, policyName) {
  const params = {
    AdjustmentType: "ChangeInCapacity",
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: "TargetTrackingScaling",
    TargetTrackingConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification: {
        PredefinedMetricType: "ASGAverageCPUUtilization",
      },
    },
  };

  return autoScaling.putScalingPolicy(params).promise();
}
