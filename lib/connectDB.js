import mongoose from "mongoose";

const MONGOBD_URL = process.env.MONGOBD_URL;

if (!MONGOBD_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("first");
    return cached.conn;
    
  }

  if (!cached.promise) {
    console.log("second");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGOBD_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  console.log("third");
  return cached.conn;
}

export default connectDB;
// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.MONGODB_URI;
// if (!uri) throw new Error("Please add MONGODB_URI to your .env.local");

// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === "development") {
//   // In dev, store the client in a global variable so hot-reloads don't create new connections
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In production, always create a new connection
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;
