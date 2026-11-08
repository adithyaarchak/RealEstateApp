import express from "express";
import { createListing ,deleteListing,updateListing} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken ,createListing);

// Delete functionality for profile
router.delete('/delete/:id', verifyToken,deleteListing);

//edit user lisitng functionality
router.post('/update/:id',verifyToken,updateListing);

export default router;