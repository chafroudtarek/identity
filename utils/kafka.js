
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092", "localhost:9092"],
});

const producer = kafka.producer();

export const run = async (res) => {
  // Producing

  await producer.connect();
  await producer.send({
    topic: "test",
    messages:[{ value: JSON.stringify(res)}] ,
  });
  // console.log(`Logged    ${type}`);
  //[{ value: type +" "+ res.toString()}]
};

//run().catch(console.error)
