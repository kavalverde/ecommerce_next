import mongoose from "mongoose";
import { env } from "process";
/**
 *0 - Disconnected
 *1 - Connected
 *2 - Connecting
 *3 - Disconnecting
 */

const mongooConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongooConnection.isConnected) {
    console.log("Already connected");
  }
  if (mongoose.connections.length > 0) {
    mongooConnection.isConnected = mongoose.connections[0].readyState;

    if (mongooConnection.isConnected === 1) {
      console.log("Using existing connection");
      return;
    }
    await mongoose.disconnect();
  }
  await mongoose.connect(process.env.MONGO_URL || "");
  mongooConnection.isConnected = 1;
  console.log("New connection", process.env.MONGO_URL);
};
export const disconnect = async () => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  if (!mongooConnection.isConnected) {
    return;
  }
  await mongoose.disconnect();
  console.log("Disconnected");
};
