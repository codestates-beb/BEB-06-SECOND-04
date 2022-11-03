import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

import { db, sequelize } from "../../models/index.js";
const {  User, Post, Comment, CommentLike } = db;

/* comment API */
router.get("/list", async (req, res, next) => {
  const postId = req.query.postId
  if (!postId) 
    return res.status(401).json({
      status: false,
      message: "input postId",
    })
  try {
   const comments = await Comment.findAll({ 
     attributes: [['id', 'commentId'], 'content', 'createdAt', 'updatedAt', 'commenter', 'postId'], 
     include: 
     [{ model: User, 
       attributes: ['email', 'nickname', 'profileurl']
     },  
     { model: CommentLike, 
      // attributes: [ [ sequelize.fn('COUNT', 'id'), 'commentLike' ]],
      include: [
        { model: User, 
        attributes: ['email', 'nickname', 'profileurl']}
      ],
      order: [['id', 'DESC']]

    }], 
     where: { postId },
     order: [['id', 'DESC']]
   })
   return res.status(200).json({
     status: true,
     message: "Success",
     comments,    //최신댓글목록
   });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/write", async (req, res, next) => {
  if (!req.cookies.loginData)
    return res.status(401).json("로그인되어 있지 않습니다.");
  try {
    const { id } = req.cookies.loginData;
    const { postId, content } = req.body;
    console.log("유저 댓글 업로드", id);
    const comment = await Comment.create({
      content: content,
      commenter: id,              //작성자
      postId: postId,             //게시글 위치 (삭제된 게시글이면 에러발생)
    });
    return res.status(200).json({
      status: true,
      message: "Success",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/edit", async (req, res, next) => {
  if (!req.cookies.loginData)
    return res.status(401).json("로그인되어 있지 않습니다.");
  try {
    const { id } = req.cookies.loginData;
    const { commentId, content } = req.body;
    const data = await Comment.findOne({ where: { id: commentId } });
    const commenter = data.toJSON().commenter
    console.log(commenter)
    if (commenter === id) {//수정은 작성자만 가능
      data.update({ //update 날짜는 자동으로 변경
        content: content,
      });
      return res.status(200).json({
        status: true,
        message: "edit success",
      })
    } else {
      return res.status(401).json({
        status: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/delete", async (req, res, next) => {
  if (!req.cookies.loginData)
    return res.status(401).json("로그인되어 있지 않습니다.");
  try {
    const { id } = req.cookies.loginData;
    const { commentId } = req.body;
    const data = await Comment.findOne({ where: { id: commentId } });
    const commenter = data.toJSON().commenter
    if (commenter === id) { //삭제는 작성자만 가능
      data.destroy();
      return res.status(200).json({
        status: true,
        message: "delete success",
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Not Authorized",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/like/:commentId", async (req, res, next) => {
  if (!req.cookies.loginData)
    return res.status(401).json("로그인되어 있지 않습니다.");
  try {
    const userId = req.cookies.loginData.id;
    const commentId = req.params.commentId; //작성되지않은 commentId일시 에러발생
    const isLiked = await CommentLike.findAll({ 
      where: { LikeUSerId: userId, LikeCommentId: commentId }
    })
    if (isLiked.length === 0) {
      const data = await CommentLike.create({
        LikeUserId: userId,
        LikeCommentId: commentId
      });
      const count = await CommentLike.findAll(({
        attributes: [[ sequelize.fn('COUNT', 'id'), 'commentLike' ]],
        where: { LikeCommentId: commentId }
      }))
    return res.status(200).json({
      status: true,
      message: "liked",
      count, //현재 코멘트 좋아요 갯수
    })
    } else {
      const cancel = await CommentLike.destroy({ 
        where: {LikeUSerId: userId, LikeCommentId: commentId}
      })
      const count = await CommentLike.findAll(({
        attributes: [[ sequelize.fn('COUNT', 'id'), 'commentLike' ]],
        where: { LikeCommentId: commentId }
      }))
      return res.status(200).json({
        status: true,
        message: "cancel liked",
        count, //현재 코멘트 좋아요 갯수
      })
    }
  } catch (error) {
    next(error);
  }
});


export default router;