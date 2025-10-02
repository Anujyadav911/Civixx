import express from "express";
import {
  createPetition,
  getPetitions,
  signPetition,
  getPetitionById,
  updatePetition,
  deletePetition,
} from "../controllers/petitionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPetitions);
router.route("/create").post(protect, createPetition);

router
  .route("/:id")
  .get(protect, getPetitionById)
  .put(protect, updatePetition)
  .delete(protect, deletePetition);

router.route("/:id/sign").post(protect, signPetition);

export default router;
