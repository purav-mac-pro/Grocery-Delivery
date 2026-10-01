import express from "express";
import auth from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

uploadRouter.post(
    "/",
    auth,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No image file provided",
                });
            }

            const b64 = req.file.buffer.toString("base64");

            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "grocery-del",
                resource_type: "auto",
            });

            return res.status(200).json({
                url: result.secure_url,
            });
        } catch (error: any) {
            console.error("Cloudinary upload failed:", error);

            return res.status(500).json({
                message:
                    error?.message ||
                    "Cloudinary image upload failed",
            });
        }
    }
);

export default uploadRouter;