import express from "express"
import { fetch, create, update, deleteUser } from "../controller/userController.js"
import { upload } from "../middleware/multerConfig.js";

const route = express.Router();
route.post("/create",upload.single("image"), create)
route.get("/getAllUsers", fetch)
route.put("/update/:id",upload.single("image"), update)
route.delete("/delete/:id", deleteUser)
export default route
