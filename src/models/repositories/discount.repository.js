'use strict';

const { getUnSelectData, getSelectData } = require('../../utils');

const findAllDiscountCodesUnSelect = async ({
  filter,
  limit = 50,
  page = 1,
  sort = 'ctime',
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = (sort = 'ctime' ? { _id: -1 } : { _id: 1 });
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  filter,
  limit = 50,
  page = 1,
  sort = 'ctime',
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = (sort = 'ctime' ? { _id: -1 } : { _id: 1 });
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExist = async ({ filter, model }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExist,
};
