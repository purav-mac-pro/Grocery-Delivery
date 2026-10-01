import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const timestamp = Math.floor(Date.now() / 1000);
const folder = "grocery-del";
const signature = cloudinary.utils.api_sign_request(
  { folder, timestamp },
  process.env.CLOUDINARY_API_SECRET
);

const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const form = new FormData();
form.append("file", png);
form.append("api_key", process.env.CLOUDINARY_API_KEY);
form.append("timestamp", String(timestamp));
form.append("folder", folder);
form.append("signature", signature);

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
  { method: "POST", body: form }
);
console.log("STATUS:", res.status);
console.log("BODY:", (await res.text()).slice(0, 600));