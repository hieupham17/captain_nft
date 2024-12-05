import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { connectTheWallet } from "./utility/common";  // Sử dụng hàm connect ví Phantom

const RegisterAccount = () => {
    const [email, setEmail] = useState("");
    const [externalWalletAddress, setExternalWalletAddress] = useState("");
    const navigate = useNavigate();

    // Kết nối ví Phantom
    const solanaConnect = async () => {
        const resp = await connectTheWallet();  // Kết nối ví Phantom
        setExternalWalletAddress(resp.addr);   // Lưu địa chỉ ví Phantom vào state
        ReactSession.set("connected_wallet", resp.addr);  // Lưu địa chỉ ví vào ReactSession
    };

    // Xử lý đăng ký tài khoản
    const handleRegister = async () => {
        if (email && externalWalletAddress) {
            // Gửi yêu cầu đăng ký tài khoản
            const registerData = {
                email: email,
                externalWalletAddress: externalWalletAddress,
                referenceId: externalWalletAddress,
            };

            try {
                // Thực hiện gọi API đăng ký tài khoản (có thể sử dụng axios hoặc fetch)
                // Giả sử API đăng ký tài khoản của bạn là '/api/register'
                const response = await fetch('https://api.gameshift.dev/nx/users', {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNjNkOTcyYS1mNTQ5LTRjNTUtYWExNi05N2NiNDhhODE2ZjUiLCJzdWIiOiI3YjIzNDE1My05YWU3LTRkN2QtYmI5NS1iZTJhMWYwNjU4ZDIiLCJpYXQiOjE3MzE1NzcyNjl9.UYliNjV9Wr18qLNOYwEgKlYWSTmP9RL3nHsnVLVHhXk',
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(registerData),
                });

                const data = await response.json();
                if (response.ok) {
                    // Sau khi đăng ký thành công, điều hướng đến trang đăng nhập
                    navigate('/login');
                } else {
                    alert('Đăng ký thất bại: ' + data.message);
                }
            } catch (error) {
                alert('Lỗi khi đăng ký: ' + error.message);
            }
        } else {
            alert('Vui lòng nhập đầy đủ thông tin');
        }
    };

    return (
        <div>
            <div className="right-al-container mb-2">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <h2 className="section-heading" style={{ marginTop: "60px", marginBottom: "20px" }}>
                                Đăng Ký Tài Khoản
                            </h2>
                            <p className="p-para-light" style={{ marginTop: "30px", marginBottom: "50px", fontSize: "1.2em" }}>
                                Vui lòng nhập thông tin để đăng ký tài khoản của bạn.
                            </p>
                            
                            {/* Form đăng ký */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="walletAddress">Địa chỉ Ví Phantom</label>
                                <input
                                    type="password"
                                    id="walletAddress"
                                    className="form-control"
                                    placeholder="Địa chỉ ví Phantom sẽ được tự động điền"
                                    value={externalWalletAddress}
                                    readOnly
                                />
                            </div>
                            
                            {/* Nút kết nối ví Phantom */}
                            <button className="btn-solid-grad" onClick={solanaConnect}>
                                Kết Nối Ví Phantom
                            </button>
                            
                            {/* Nút đăng ký tài khoản */}
                            <button className="btn-solid-grad" onClick={handleRegister} style={{ marginTop: "20px" }}>
                                Đăng Ký Tài Khoản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
// // Định nghĩa mô hình người dùng
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// const User = mongoose.model('User', userSchema);

// // Endpoint đăng ký
// app.post('/register', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Kiểm tra thông tin
//         if (!name || !email || !password) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Kiểm tra email đã tồn tại
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email da duoc su dung' });
//         }

//         // Mã hóa mật khẩu
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Tạo người dùng mới
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword
//         });
//         await newUser.save();

//         res.status(201).json({ message: 'User registered successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
    );
};

export default RegisterAccount;
