import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [referenceId, setReferenceId] = useState(""); // Địa chỉ ví
  const [email, setEmail] = useState(""); // Email
  const [error, setError] = useState(""); // Lỗi (nếu có)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu địa chỉ ví và email đều đã nhập
    if (!referenceId || !email) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const url = `https://api.gameshift.dev/nx/users/${referenceId}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNjNkOTcyYS1mNTQ5LTRjNTUtYWExNi05N2NiNDhhODE2ZjUiLCJzdWIiOiI3YjIzNDE1My05YWU3LTRkN2QtYmI5NS1iZTJhMWYwNjU4ZDIiLCJpYXQiOjE3MzE1NzcyNjl9.UYliNjV9Wr18qLNOYwEgKlYWSTmP9RL3nHsnVLVHhXk",
      },
    };

    try {
      // Gửi yêu cầu GET tới API với referenceId
      const response = await fetch(url, options);
      const data = await response.json();

      // Kiểm tra nếu email trong phản hồi của API trùng với email người dùng nhập
      if (data.email && data.email === email) {
        // Nếu đúng, đăng nhập thành công và điều hướng đến trang dashboard
        navigate("/dashboard");
      } else {
        // Nếu không, thông báo lỗi
        setError("Thông tin đăng nhập không đúng.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi đăng nhập.");
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
                  <label htmlFor="referenceId">Địa chỉ ví</label>
                  <input
                    type="password"
                    id="referenceId"
                    className="form-control"
                    placeholder="Nhập địa chỉ ví"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                  />
                </div>

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
