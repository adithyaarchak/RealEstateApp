import express from "express";
import { createListing ,deleteListing,updateListing,getListings} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken ,createListing);

// Delete functionality for profile
router.delete('/delete/:id', verifyToken,deleteListing);

//edit button user lisitng functionality
router.post('/update/:id',verifyToken,updateListing);

//this route is used to make sure that when user clicks in the edit profile and the information should be alrready present to edit 
router.get(`/get/:id`,getListings);


export default router;