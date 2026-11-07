import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

console.log("pub:", process.env.IMAGEKIT_PUBLIC_KEY?.slice(0, 12));
console.log("priv:", process.env.IMAGEKIT_PRIVATE_KEY?.slice(0, 8));
console.log("priv length:", process.env.IMAGEKIT_PRIVATE_KEY?.length);