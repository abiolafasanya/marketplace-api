import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import cors from "cors";
import routeHandler from "./routes";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./commons/middleware/logger";
import {
  AppErrorHandler,
  NotFoundException,
} from "./commons/middleware/errors";
import connectDB from "./commons/database/connection";
import { SECRETS } from "./commons/constant";
import deepSanitize from "./commons/utils/sanitze";


const app = express();

const apiRouter = express.Router();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
// Allow larger payloads
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser()); // 👈 REQUIRED before your authenticate middleware

// const allowedOrigins = ["http://localhost:3000"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or Postman)
//       if (!origin) return callback(null, true);

//       // Check if the origin is in the allowed list
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g., http://localhost:3000
    credentials: true, // 🔑 allow cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded());

// Set security HTTP headers
app.use(helmet());
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        try {
          const logObj = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info("RESPONSE", JSON.stringify(logObj));
        } catch (error) {
          console.error("Failed to parse log message:");
          console.log("error", JSON.stringify(error));
        }
      },
    },
  })
);

const port = Number(process.env.PORT || 4000);

// Routes
app.use((req, res, next) => {
  deepSanitize(req.body);
  deepSanitize(req.query); // only mutate, don't reassign
  deepSanitize(req.params);
  next();
});

//Data sanitization against NoSQL query injection
routeHandler(apiRouter);
app.use("/api/v1", apiRouter);

app.use((req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  logger.warn(`404 - ${message}`);
  next(new NotFoundException(message));
});

const MONGO_URI: string = SECRETS.mongo_uri;

const start = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is missing");
    await connectDB(MONGO_URI);
    app.listen(port, () => {
      logger.info(`Server running on port ${port}...`);
    });
  } catch (error) {
    console.error("Error starting the server:", JSON.stringify(error));
    process.exit(1); // Exit process with failure
  }
};

try {
  app.use(AppErrorHandler);
} catch (error) {
  console.error("Failed to attach AppErrorHandler", error);
}

start().then((data) => data);
