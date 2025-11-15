// controllers/product.js
const mongoose = require('mongoose');
const Product = require('../model/product');
const Category = require('../model/category');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    // Lọc theo category nếu có
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const products = await Product.find(query).lean();
    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      brand,
      brand_id,
      category,
      category_id,
      img_url,
      description,
      variants
    } = req.body;

    // Validate các trường bắt buộc
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên sản phẩm không được để trống' 
      });
    }

    // Parse price sang số
    const priceNumber = parseFloat(price);
    if (!price || isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Giá sản phẩm không hợp lệ' 
      });
    }

    if (!category_id || !category_id.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Category ID không được để trống' 
      });
    }

    // Validate category_id hợp lệ
    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Category ID không hợp lệ' 
      });
    }

    // Kiểm tra category có tồn tại không
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Category không tồn tại' 
      });
    }

    // Kiểm tra tên sản phẩm đã tồn tại chưa (case-insensitive)
    const existingProduct = await Product.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i')
    });
    if (existingProduct) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên sản phẩm đã tồn tại' 
      });
    }

    // Lấy đường dẫn ảnh từ file upload hoặc dùng img_url
    let imageUrl = img_url || '';
    if (req.file) {
      imageUrl = '/images/' + req.file.filename;
    }

    // Parse variants nếu là chuỗi JSON
    let parsedVariants = [];
    if (variants) {
      if (typeof variants === 'string') {
        try {
          parsedVariants = JSON.parse(variants);
        } catch (e) {
          console.error('Error parsing variants:', e);
        }
      } else if (Array.isArray(variants)) {
        parsedVariants = variants;
      }
    }

    // Tạo sản phẩm mới
    const newProduct = await Product.create({
      name: name.trim(),
      price: priceNumber,
      brand: brand || '',
      brand_id: brand_id || '',
      category: category || '',
      category_id: category_id.trim(),
      img_url: imageUrl,
      description: description || '',
      variants: parsedVariants
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      price,
      brand,
      brand_id,
      category,
      category_id,
      img_url,
      description,
      variants
    } = req.body;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    // Validate các trường bắt buộc
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên sản phẩm không được để trống' 
      });
    }

    // Parse price sang số
    const priceNumber = parseFloat(price);
    if (!price || isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Giá sản phẩm không hợp lệ' 
      });
    }

    if (!category_id || !category_id.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Category ID không được để trống' 
      });
    }

    // Validate category_id hợp lệ
    if (!mongoose.isValidObjectId(category_id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Category ID không hợp lệ' 
      });
    }

    // Kiểm tra category có tồn tại không
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Category không tồn tại' 
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }

    // Kiểm tra tên sản phẩm trùng với sản phẩm khác (loại trừ chính nó)
    const duplicateProduct = await Product.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      _id: { $ne: id }
    });
    if (duplicateProduct) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên sản phẩm đã tồn tại' 
      });
    }

    // Lấy đường dẫn ảnh: nếu có file upload thì dùng file mới, không thì giữ ảnh cũ
    let imageUrl = currentProduct.img_url; // Giữ ảnh cũ
    if (req.file) {
      imageUrl = '/images/' + req.file.filename; // Cập nhật ảnh mới
    } else if (img_url) {
      imageUrl = img_url; // Nếu có img_url trong body
    }

    // Parse variants nếu là chuỗi JSON
    let parsedVariants = currentProduct.variants || [];
    if (variants) {
      if (typeof variants === 'string') {
        try {
          parsedVariants = JSON.parse(variants);
        } catch (e) {
          console.error('Error parsing variants:', e);
        }
      } else if (Array.isArray(variants)) {
        parsedVariants = variants;
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price: priceNumber,
        brand: brand || '',
        brand_id: brand_id || '',
        category: category || '',
        category_id: category_id.trim(),
        img_url: imageUrl,
        description: description || '',
        variants: parsedVariants
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }

    // Xóa sản phẩm
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: err.message 
    });
  }
};

// Seed nhiều sản phẩm cùng lúc
const seedProducts = async (req, res) => {
  try {
    const products = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu phải là mảng sản phẩm'
      });
    }

    const result = await Product.insertMany(products);
    
    return res.status(201).json({
      success: true,
      message: `Đã thêm ${result.length} sản phẩm thành công`,
      data: result
    });
  } catch (err) {
    console.error('seedProducts error:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi seed dữ liệu',
      error: err.message
    });
  }
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts 
};
