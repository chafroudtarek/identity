
import { Kafka } from "kafkajs";



const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092", "localhost:9093"],
});

const producer = kafka.producer();

export const run = async (res) => {


  // Producing
  for (let i = 1; i < 3; i++) {
    await producer.connect();
    await producer.send({
      topic: `my-topic${i}`,
      messages: [{ value: JSON.stringify(res) }],


    });
    console.log("sent", res)

  }


};




