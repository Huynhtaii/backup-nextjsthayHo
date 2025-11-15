const mongoose = require('mongoose');
const Product = require('./model/product');
const Category = require('./model/category');
const Brand = require('./model/brand');
const seedData = require('./seed-data.json');

// Kết nối đến MongoDB database thayHoFramework2
mongoose.connect("mongodb://localhost:27017/thayHoFramework2")
.then(async () => {
    console.log("✓ Kết nối đến MongoDB thành công (thayHoFramework2)");
    
    try {
        // Xóa dữ liệu cũ (nếu muốn)
        // await Product.deleteMany({});
        // await Category.deleteMany({});
        // await Brand.deleteMany({});
        // console.log("✓ Đã xóa dữ liệu cũ");
        
        // Tạo Categories
        const categories = [
            { name: 'Áo', description: 'Các loại áo thời trang' },
            { name: 'Quần', description: 'Các loại quần thời trang' },
            { name: 'Áo khoác', description: 'Các loại áo khoác' },
            { name: 'Váy', description: 'Các loại váy' }
        ];
        
        const createdCategories = await Category.insertMany(categories);
        console.log(`✓ Đã tạo ${createdCategories.length} danh mục`);
        
        // Tạo Brands
        const brands = [
            { name: 'Uniqlo', description: 'Thương hiệu thời trang Nhật Bản' },
            { name: 'Zara', description: 'Thương hiệu thời trang Tây Ban Nha' },
            { name: 'H&M', description: 'Thương hiệu thời trang Thụy Điển' }
        ];
        
        const createdBrands = await Brand.insertMany(brands);
        console.log(`✓ Đã tạo ${createdBrands.length} thương hiệu`);
        
        // Tạo mapping category name to ObjectId
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });
        
        // Tạo mapping brand name to ObjectId
        const brandMap = {};
        createdBrands.forEach(brand => {
            brandMap[brand.name] = brand._id;
        });
        
        // Thêm category_id vào seedData
        const productsWithCategory = seedData.map(product => {
            const categoryId = categoryMap[product.category];
            if (!categoryId) {
                console.warn(`⚠ Cảnh báo: Không tìm thấy category "${product.category}" cho sản phẩm "${product.name}"`);
            }
            return {
                ...product,
                category_id: categoryId || createdCategories[0]._id // Fallback to first category
            };
        });
        
        // Thêm dữ liệu sản phẩm
        const result = await Product.insertMany(productsWithCategory);
        console.log(`✓ Đã thêm ${result.length} sản phẩm thành công`);
        
        // Hiển thị danh sách sản phẩm đã thêm
        result.forEach(product => {
            console.log(`  - ${product.name} (${product.brand}) - ${product.price.toLocaleString('vi-VN')}đ`);
        });
        
        console.log("\n✓ Hoàn tất seed data cho database thayHoFramework2!");
        process.exit(0);
    } catch (error) {
        console.error("✗ Lỗi khi thêm dữ liệu:", error.message);
        console.error(error);
        process.exit(1);
    }
})
.catch((err) => {
    console.error("✗ Lỗi kết nối đến MongoDB:", err);
    process.exit(1);
});

