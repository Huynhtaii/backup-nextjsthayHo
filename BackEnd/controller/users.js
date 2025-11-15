const { create } = require('../model/user');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authen = require('../services/authen');






// ==================== CÁC HÀM CONTROLLER ====================

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const list = await User.find();

    const users = list.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      address: u.address,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách user:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy user theo ID
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    const user = {
      id: data._id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Lỗi lấy user theo ID:", err);
    res.status(500).json({ message: err.message });
  }
};

// Đăng ký user mới 
const createUser = async (req, res) => {
  try {
    let { username, email, password, fullName, phone, address, role } = req.body;

    // ✅ Kiểm tra các trường bắt buộc
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email và mật khẩu là bắt buộc' });
    }

    // ✅ Kiểm tra username đã tồn tại chưa
    let existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ message: 'Username đã được sử dụng' });
    }

    // ✅ Kiểm tra email đã tồn tại chưa
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // ✅ Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Gán giá trị mặc định cho các trường không bắt buộc
    if (!fullName) fullName = '';
    if (!phone) phone = '';
    if (!address) address = '';
    if (!role) role = 'customer';

    // ✅ Tạo mới user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      role
    });

    await newUser.save();

    // ✅ Trả kết quả về client
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
address: newUser.address,
      role: newUser.role
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo user:", err);
    res.status(500).json({ message: err.message });
  }
};

// updateUser
const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let { username, email, password, fullName, phone, address, role } = req.body;
    
    // Tìm user cần update
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Kiểm tra email tồn tại
    if (email && email !== user.email) {
      let existEmail = await User.findOne({ email });
      if (existEmail) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
      user.email = email;
    }

    // Kiểm tra username tồn tại
    if (username && username !== user.username) {
      let existUsername = await User.findOne({ username });
      if (existUsername) {
        return res.status(400).json({ message: 'Username đã được sử dụng' });
      }
      user.username = username;
    }

    // Cập nhật password (nếu có)
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Cập nhật các trường không unique
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role && ['customer', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    // Trả về thông tin đã cập nhật
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      role: user.role,
      updatedAt: user.updatedAt
    });
  } catch(err) {
    console.error("❌ Lỗi khi cập nhật user:", err);
    res.status(500).json({ message: err.message });
  }
};

// deleteUser
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    let user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Xóa user thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa user:", err);
    res.status(500).json({ message: err.message });
  }
};
// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password, age, confirm_password } = req.body;
    if(password !== confirm_password) {
      throw new Error('Dữ liệu không chính xác');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = new User({ name, email, password: hash, age });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(414).json({ user: { name: null, email: null } });
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // kiểm tra password đã mã hóa
    if (user && bcrypt.compareSync(password, user.password)) {
      const access_token = jwt.sign({ user }, 'shhhhh', { expiresIn: 1 * 60 });
      const refresh_token = jwt.sign({ user }, 'shhhhh', { expiresIn: 90 * 24 * 60 * 60 });
      // access token là chuỗi ngẫu nhiên, dùng để xác thực người dùng
      // refresh token là chuỗi ngẫu nhiên, dùng để lấy lại access token
      res.status(200).json({ user, access_token, refresh_token });
    } else {
      res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    let { refresh_token } = req.body;
    const data = jwt.verify(refresh_token, 'shhhhh');
    const access_token = jwt.sign({ user: data.user }, 'shhhhh', { expiresIn: 1 * 60 });
    refresh_token = jwt.sign({ user: data.user }, 'shhhhh', { expiresIn: 90 * 24 * 60 * 60 });
    res.status(200).json({ user: data.user, access_token, refresh_token });
  } catch (error) {
    res.status(414).json({ error: error.message });
  }
};





// ==================== EXPORT ====================
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  refreshToken,
  login,
  register
};
