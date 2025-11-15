// controllers/categories.js
const mongoose = require('mongoose');
const Category = require('../model/category');
const Product = require('../model/product');
const category = require('../model/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();     // lấy toàn bộ danh mục
    
    // Đếm số sản phẩm cho mỗi danh mục
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category_id: cat._id });
        return {
          ...cat,
          productCount
        };
      })
    );
    
    return res.status(200).json(categoriesWithCount);    // trả về mảng JSON với số lượng sản phẩm
  } catch (error) {
    console.error('getAllCategories error:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const data = await Category.findById(id).lean();
    if (!data) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    return res.status(200).json({
      id: data._id,
      name: data.name,
    });
  } catch (error) {
    console.error('getCategoryById error:', error);
    return res.status(500).json({ message: error.message });
  }
};
 
 // controllers/category.js


const createCategory = async (req, res) => {
  try {
    let {
      name,
      description,
      img_url,
      parentId
    } = req.body;

    // validate tên danh mục
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên danh mục không được để trống' 
      });
    }

    // chuẩn hoá mô tả
    description = description || '';

    // Xử lý ảnh: nếu có upload file thì dùng file, không thì dùng img_url từ body
    let imageUrl = img_url || '';
    if (req.file) {
      imageUrl = '/images/' + req.file.filename;
    }

    // parentId rỗng => null
    if (parentId === '' || parentId === undefined) parentId = null;

    // kiểm tra trùng tên (case-insensitive)
    const existed = await Category.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i')
    });
    if (existed) {
      return res.status(400).json({ 
        success: false,
        message: 'Danh mục đã tồn tại' 
      });
    }

    // tạo mới
    const newCategory = await Category.create({
      name: name.trim(),
      description,
      img_url: imageUrl,
      parentId
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: newCategory
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};

const updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, description, img_url, parentId } = req.body;  // ← THÊM img_url

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên danh mục không được để trống' 
      });
    }

    const currentCategory = await Category.findById(id);
    if (!currentCategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy danh mục' 
      });
    }

    // ← THÊM ĐOẠN NÀY: Xử lý ảnh khi update
    let imageUrl = currentCategory.img_url; // Giữ ảnh cũ
    if (req.file) {
      imageUrl = '/images/' + req.file.filename; // Ảnh mới
    } else if (img_url) {
      imageUrl = img_url;
    }

    description = description || '';
    if (parentId === '' || parentId === undefined) parentId = null;

    const duplicateCategory = await Category.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      _id: { $ne: id }
    });
    if (duplicateCategory) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên danh mục đã tồn tại' 
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description,
        img_url: imageUrl,    // ← THÊM DÒNG NÀY
        parentId
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    // kiểm tra danh mục có tồn tại không
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy danh mục' 
      });
    }

    // xóa danh mục
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};
// upload image
const uploadImage = async (req, res) => {
  try {
      const {
          file
      } = req;
      if (!file) {
          return res.json({
              status: 0,
              link: ""
          });
      } else {
          const url = `/images/${file.filename}`; //url muốn lưu trong csdl
          return res.json({
              status: 1,
              url: url
          });
      }
  } catch (error) {
      console.log('Upload image error: ', error);
      return res.json({
          status: 0,
          link: ""
      });
  }
};
module.exports = { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategories,
  deleteCategory,
  uploadImage
};