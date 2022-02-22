
import { Kafka } from "kafkajs";



const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092", "localhost:9092"],
});

const producer = kafka.producer();

export const run = async (res) => {

  const topicMessages = [
    {
      topic: 'my-topic',
      messages:[{ value: JSON.stringify(res)}],
    },
    {
      topic: 'test1',
      messages:[{ value: JSON.stringify(res)}],
    },
  ]
  // Producing

  await producer.connect();
  await producer.sendBatch({ topicMessages })
  // await producer.send({
  //   topic: 'my-topic',
  //   messages:[{ value: JSON.stringify(res)}] ,
  // });
  // await producer.connect();
  // await producer.send({
  //   topic: 'test1',
  //   messages:[{ value: JSON.stringify(res)}] ,
  // });
  console.log("sent")
  // logger.info(`Logged    ${type}`);
  //[{ value: type +" "+ res.toString()}]
};



//run().catch(console.error)
