import SubCategory from "../models/subCategoryModel.js";
import factory from "../utils/handlerFactory.js";

export const setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// @desc Get list of subCategories that belong to specific category
// GET /api/categories/:categoryId/subcategories
// @access Public

// @desc Create subCategories that belong to specific category
// POST /api/categories/:categoryId/subcategories
// @access Private/Admin-Manager


// @desc Get list of subCategories
// @route GET /api/v1/subcategories
// @access Public
export const getSubCategories = factory.getAll(SubCategory);
// @desc Get specific subCategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
export const getSubCategory = factory.getOne(SubCategory);

// @desc Create subCategory
// @route POST /api/v1/subcategories
// @access Private/Admin-Manager
export const createSubCategory = factory.createOne(SubCategory);

// @desc Update specific subCategory
// @route PUT /api/v1/subcategories/:id
// @access Private/Admin-Manager
export const updateSubCategory = factory.updateOne(SubCategory);

// @desc Delete specific subCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private/Admin
export const deleteSubCategory = factory.deleteOne(SubCategory);

const subCategoryCtrl = {
  setCategoryIdToBody,
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
export default subCategoryCtrl;
