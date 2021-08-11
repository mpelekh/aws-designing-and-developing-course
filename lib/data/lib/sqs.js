const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const sqs = new AWS.SQS();

function push(queueName, msg) {
  const params = {
    QueueName: queueName,
  };

  return sqs
    .getQueueUrl(params)
    .promise()
    .then((data) => {
      const params = {
        MessageBody: JSON.stringify(msg),
        QueueUrl: data.QueueUrl,
      };

      return sqs.sendMessage(params).promise();
    });
}

module.exports = { push };
