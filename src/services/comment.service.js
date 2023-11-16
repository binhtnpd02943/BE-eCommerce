'use strict';

const { NotFoundError } = require('../core/error.response');
const commentModel = require('../models/comment.model');
const { findProduct } = require('../models/repositories/product.repository');

/* 
key features: Comment service
+ add comment [User, Shop]
+ get a list of comment [User, Shop]
+ delete a comment [User, Shop, Admin]
*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      //  reply comment
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('parent comment not found');
      rightValue = parentComment.comment_right;
      // update comments
      await commentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await commentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gte: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: productId,
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  // Get comments
  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('parent comment not found');

      const comments = await commentModel
        .find({
          comment_productId: productId,
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lte: parentComment.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await commentModel
      .find({
        comment_productId: productId,
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  // Delete comments
  static async deleteComments({ commentId, productId }) {
    // check the product exists in the database
    const foundProduct = await findProduct({
      product_id: productId,
    });
    if (!foundProduct) throw new NotFoundError('product not found');
    // 1. xác định giá trị left với right of commentId
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError('comment not found');

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. tính width
    const width = rightValue - leftValue + 1;
    // 3. Xoá tát cả commentId con
    await commentModel.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    // 4. cao nhất gia trị left và right còn lại
    await commentModel.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await commentModel.updateMany(
      {
        comment_productId: productId,
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    return true;
  }
}

module.exports = CommentService;
