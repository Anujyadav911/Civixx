import Petition from "../models/Petition.js";
import Poll from "../models/Poll.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const myPetitionsCount = await Petition.countDocuments({ owner: userId });
    const pollsCreatedCount = await Poll.countDocuments({ owner: userId });

    // Placeholder for now
    const successfulPetitionsCount = await Petition.countDocuments({
      owner: userId,
      status: "Approved",
    });

    res.json({
      myPetitions: myPetitionsCount,
      successfulPetitions: successfulPetitionsCount,
      pollsCreated: pollsCreatedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
