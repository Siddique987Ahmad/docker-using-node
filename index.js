const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
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
redisClient.connect().catch(console.error);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
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
//Test Route for Debugging Sessions
app.get("/test-session", (req, res) => {
  console.log("Session before setting:", req.session); // Log session before setting
  req.session.test = "This is a test session value";
  console.log("Session after setting:", req.session); // Log session after setting
  res.json({ session: req.session });
  res.end();
});
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});