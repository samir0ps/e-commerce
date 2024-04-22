import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import path from "path";
import { userRouter } from "../src/routes/userRoutes";
import { productRoute } from "./routes/productRoutes";
import WebSocket from "ws"; 
import {orderRouter} from './routes/orderRoutes'

const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(bodyParser.json({limit:"10mb"}));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.SessionKey) {
    app.use(
        expressSession({
            secret: process.env.SessionKey,
            resave: true,
            saveUninitialized: true,
        })
    );
}
app.use("/api/user", userRouter);
app.use(
    "/images/server_images/user_images",
    express.static(path.join(__dirname, "../server_images/user_images"))
);
app.use(
    "/server_images/categories_images",
    express.static(path.join(__dirname, "../server_images/categories_images"))
);
app.use(
    "/product-images/product_images",
    express.static(path.join(__dirname, "../product_images"))
);
app.use("/api/product", productRoute);
app.use('/api' ,orderRouter );



const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on("error", (err) => {
    console.error(`Error starting server: ${err.message}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");

    ws.on("close", () => {
        console.log("WebSocket client disconnected");
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});
