import Petition from "../models/Petition.js";
import User from "../models/User.js";

export const createPetition = async (req, res) => {
  const { title, description, category, signatureGoal, location } = req.body;

  try {
    const newPetition = new Petition({
      title,
      description,
      category,
      location,
      goal: signatureGoal,
      owner: req.user.id,
    });

    const savedPetition = await newPetition.save();
    res.status(201).json(savedPetition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find({})
      .sort({ createdAt: -1 })
      .populate("owner", "name");
    res.json(petitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (petition) {
      if (petition.signatures.includes(req.user.id)) {
        return res
          .status(400)
          .json({ message: "You have already signed this petition" });
      }

      petition.signatures.push(req.user.id);
      const updatedPetition = await petition.save();
      res.json(updatedPetition);
    } else {
      res.status(404).json({ message: "Petition not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id).populate(
      "owner",
      "name"
    );
    if (petition) {
      res.json(petition);
    } else {
      res.status(404).json({ message: "Petition not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePetition = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    petition.title = title || petition.title;
    petition.description = description || petition.description;
    petition.category = category || petition.category;

    const updatedPetition = await petition.save();
    res.json(updatedPetition);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await petition.deleteOne();
    res.json({ message: "Petition removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
