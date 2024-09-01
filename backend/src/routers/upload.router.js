import { Router } from "express";
import admin from "../middleware/admin.mid.js";
import multer from "multer";
import handler from "express-async-handler";
import { BAD_REQUEST } from "../constants/httpStatus.js";

const router = Router();
const upload = multer();

router.post(
  "/",
  admin,
  upload.single("image"),
  handler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(BAD_REQUEST).send();
      return;
    }

    const imageUrl = req.file?.buffer;
    res.send({ imageUrl });
  })
);

export default router;
