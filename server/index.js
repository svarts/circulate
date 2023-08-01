import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath  } from "url";
import authRoutes from "./routes.auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import { register } from "/controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";

/* configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirmname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
//app.use(helmet.crossOriginEmbedderPolicy({ policy:"cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirmname, 'public/assests'))); //settig the directory of where we keep our assets in

/* file storage (this is how you can save your files)*/ 
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer ({ storage }); 

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"));

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* mongoose setup */

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
})
.catch((err) => console.log(`${err} did not connect`))