import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import path from "path";
import fs from "fs";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.filename : null; // Yüklenen dosyanın adını al

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    // Tüm gönderileri getir ve tarihe göre sırala
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (err) {
    console.error("Gönderi oluşturma hatası:", err);
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* GET USER LIKED POSTS */
export const getUserLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ [`likes.${userId}`]: true });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* GET USER COMMENTED POSTS */
export const getUserCommentedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // Önce kullanıcının yorum yaptığı benzersiz post ID'lerini bulalım
    const comments = await Comment.find({ userId });
    const uniquePostIds = [...new Set(comments.map(comment => comment.postId))];
    
    // Şimdi bu post ID'lerine sahip gönderileri getirelim
    const posts = await Post.find({ _id: { $in: uniquePostIds } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log("Silme isteği:", { id, userId });

    const post = await Post.findById(id);
    if (!post) {
      console.log("Gönderi bulunamadı");
      return res.status(404).json({ message: "Gönderi bulunamadı" });
    }

    console.log("Gönderi bulundu:", {
      postUserId: post.userId.toString(),
      requestUserId: userId
    });

    // Sadece gönderinin sahibi silebilir
    if (post.userId.toString() !== userId) {
      console.log("Yetki hatası: Kullanıcı gönderiyi silme yetkisine sahip değil");
      return res.status(403).json({ message: "Bu gönderiyi silme yetkiniz yok" });
    }

    // Eğer gönderi bir dosya içeriyorsa, dosyayı da sil
    if (post.picturePath) {
      try {
        const filePath = path.join(process.cwd(), 'public/assets', post.picturePath);
        console.log("Dosya yolu:", filePath);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Dosya başarıyla silindi:", filePath);
        } else {
          console.log("Dosya bulunamadı:", filePath);
        }
      } catch (fileError) {
        console.error("Dosya silme hatası:", fileError);
        // Dosya silme hatası olsa bile gönderiyi silmeye devam et
      }
    }

    await Post.findByIdAndDelete(id);
    console.log("Gönderi başarıyla silindi");
    
    res.status(200).json({ message: "Gönderi başarıyla silindi" });
  } catch (err) {
    console.error("Silme işlemi hatası:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
};
