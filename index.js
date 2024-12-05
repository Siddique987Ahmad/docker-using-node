// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();
// //mongodb
// const {
//   MONGO_USER,
//   MONGO_PASSWORD,
//   MONGO_IP,
//   MONGO_PORT,
//   SESSION_SECRET,
//   REDIS_URL,
//   REDIS_PORT,
// } = require("./config/config");
// const connectWithRetry = () => {
//   mongoose
//     .connect(
//       `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
//     )
//     .then(() => console.log("mongodb connected"))
//     .catch((e) => {
//       console.log(e);
//       setTimeout(connectWithRetry, 5000);
//     });
// };
// connectWithRetry();
// //Redis
// const session = require("express-session");
// const redis = require("redis");
// //let RedisStore = require("connect-redis").default;
// let RedisStore=require('connect-redis')(session)
// let redisClient = redis.createClient({
//   // host: REDIS_URL,
//   // port: REDIS_PORT,
//   url: `redis://${REDIS_URL}:${REDIS_PORT}`, // Ensure REDIS_URL and REDIS_PORT are defined
// });
// console.log(`redis://${REDIS_URL}:${REDIS_PORT}`)
// redisClient.on("error", (err) => console.error("Redis Client Error", err));
// (async () => {
//   await redisClient.connect(); // Explicitly connect the Redis client
//   console.log("Redis connected successfully");
// })();
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60,
//     },
//   })
// );


// //middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get("/", (req, res) => {
//   res.send("<h1>Hello !! <h1>");
// });
// //routes
// const postRoute = require("./routes/postRoutes");
// const userRoute = require("./routes/userRoutes");
// app.use("/api/v1/post", postRoute);
// app.use("/api/v1/user", userRoute);
// //port
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

const app = express();

// MongoDB connection
const connectWithRetry = () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error(err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Redis connection
const redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` });
redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");

    const RedisStore = require("connect-redis")(session);
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        },
      })
    );
  } catch (err) {
    console.error("Error connecting Redis:", err);
  }
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
