import { Kafka } from 'kafkajs';
import User from "../models/User.js"
import mongoose from 'mongoose';


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'kafka9' })


export const run = async (req, res) => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'my-topic7', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {


      console.log("*********** arrived*****************",)
      const obj = JSON.parse(message.value);
      console.log(obj)

      try {

        const response = await User.findByIdAndUpdate(mongoose.Types.ObjectId(obj.userId), { email: obj.profile.proEmail })
        console.log("after updating", response)

        if (response) {
          console.log("Email updated  wihout problems...")
        }

      } catch (e) {
        console.log("catch : error " + e)
      }



    },
  })


}


