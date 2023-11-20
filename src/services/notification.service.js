'use strict';

const notificationModel = require('../models/notification.model');

const pushNotiToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let notification_content;

  if (type === 'SHOP-001') {
    notification_content = '@@@ vừa mới thêm một sản phẩm: @@@';
  } else if (type === 'PROMOTION-001') {
    notification_content = '@@@ vừa mới thêm một voucher: @@@';
  }

  const newNotification = await notificationModel.create({
    notification_type: type,
    notification_content,
    notification_senderId: senderId,
    notification_receivedId: receivedId,
    notification_options: options,
  });

  return newNotification;
};

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
  const match = { notification_receivedId: userId };
  if (type !== 'ALL') {
    match['notification_type'] = type;
  }

  return await notificationModel.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        notification_type: 1,
        notification_senderId: 1,
        notification_receivedId: 1,
        notification_content: {
          $concat: [
            {
              $substr: ['$notification_options.shop_name', 0, -1],
            },
            ' vừa mới thêm một sản phẩm mới: ',
            {
              $substr: ['$notification_options.product_name', 0, -1],
            },
          ],
        },
        notification_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
