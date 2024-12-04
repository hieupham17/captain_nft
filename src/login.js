import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); // Thêm trạng thái để lưu thông báo thành công
  const xKey = process.env.REACT_APP_API_KEY;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu email đã nhập
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    // Gửi yêu cầu API để lấy referenceId và externalWalletAddress
    const url = `https://api.gameshift.dev/nx/users`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": xKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,  // Chỉ gửi email từ form nhập
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.referenceId && data.externalWalletAddress) {
        // Nếu nhận được thông tin hợp lệ, hiển thị thông báo thành công
        setSuccess("Đăng nhập thành công!");
        setError(""); // Xóa thông báo lỗi nếu có
      } else {
        setError("Thông tin đăng nhập không đúng.");
        setSuccess(""); // Xóa thông báo thành công nếu có
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi đăng nhập.");
      setSuccess(""); // Xóa thông báo thành công nếu có
    }
  };

  return (
    <div>
      <div className="right-al-container mb-2">
        <div className="container-lg">
          <div className="row">
            <div className="col-12 col-md-8">
              <h2
                className="section-heading"
                style={{ marginTop: "60px", marginBottom: "20px" }}
              >
                Đăng Nhập
              </h2>
              <p
                className="p-para-light"
                style={{ marginTop: "30px", marginBottom: "50px", fontSize: "1.2em" }}
              >
                Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.
              </p>

              {/* Form đăng nhập */}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && <div className="error">{error}</div>} {/* Hiển thị lỗi nếu có */}
                {success && <div className="success">{success}</div>} {/* Hiển thị thông báo thành công nếu có */}

                <button type="submit" className="btn-solid-grad" style={{ marginTop: "20px" }}>
                  Đăng Nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
