
import { Kafka } from "kafkajs";



const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092","localhost:9093"],
});

const producer = kafka.producer();

export const run = async (res) => {

  
  // Producing
  
  await producer.connect();
  await producer.sendBatch([ 
    {
      topic: 'test',
      messages:[{ value: JSON.stringify(res)}],
    },
    {
      topic: 'topic',
      messages:[{ value: JSON.stringify(res)}],
    }
  ])
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
