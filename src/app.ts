import express, { Express } from 'express';
import compression from 'compression';
import helmet from "helmet";
import cors from 'cors';
import fileUpload from "express-fileupload";
import http from 'http';
import dotenv from "dotenv";
import path from "path";
import routes from "./routes"
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001; // default port to listen

app.enable('trust proxy'); // if you are under reverse proxy

// Configure Express to use EJS
app.set("view engine", "ejs");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(compression({ level: 6, threshold: 0 }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(fileUpload());// for file uploads

// Use helmet middleware for security headers
app.use(helmet());

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

// all routes
app.use('/', routes);

app.use('*', async (req, res) => {
    res.json({ st: true, msg: "invalid request *" })
});

const server = http.createServer(app);

server.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});