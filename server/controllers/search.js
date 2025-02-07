import User from "../models/User.js";
import Post from "../models/Post.js";

/* SEARCH */
export const searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Arama sorgusu gerekli" });
    }

    const regex = new RegExp(query, "i");

    // Kullanıcıları ara
    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { location: regex },
        { occupation: regex },
      ],
    }).select("-password");

    // Gönderileri ara
    const posts = await Post.find({
      $or: [
        { description: regex },
        { firstName: regex },
        { lastName: regex },
        { location: regex },
      ],
    });

    res.status(200).json({
      users,
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 