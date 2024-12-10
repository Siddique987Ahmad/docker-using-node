const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
//const cors=require('cors')
const {RedisStore} = require("connect-redis");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");
// let redisClient = redis.createClient({
//   host: REDIS_URL,
//   port: REDIS_PORT,
// });

//Redis connection
const redisClient = redis.createClient({ 
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
  legacyMode: true, // Enable legacy mode for compatibility
});
redisClient.on("connect", () => console.log("Redis client connected"));

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().catch(console.error);

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
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
app.enable("trust proxy")
//app.use(cors({}))
// let redisStore = new RedisStore({
//   client: redisClient,
// });

//const redisStore = RedisStore(session); // Pass the session module to RedisStore
const redisStore =new RedisStore({ client: redisClient }); // Correct way to initialize RedisStore

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000000,
    },
  })
);
console.log("Session middleware initialized");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/v1',(req,res)=>{
  res.send("<h1>heloo</h1>")
  console.log("yes run")
})
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});