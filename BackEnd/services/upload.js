// upload.js
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu ảnh vào thư mục FrontEnd/public/images để frontend có thể truy cập
    cb(null, path.join(__dirname, '../../FrontEnd/public/images'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);              
    const base = path.basename(file.originalname, ext)        
                  .replace(/\s+/g, '_');                       
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);                       
  }
});

module.exports = multer({ storage });
