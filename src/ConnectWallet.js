import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { connectTheWallet } from "./utility/common";
import { WalletContext } from "./Context/WalletContext";
import { ReactSession } from "react-client-session";

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { setWalletId } = useContext(WalletContext);
  const xKey = process.env.REACT_APP_API_KEY;

  const solanaConnect = async () => {
    try {
      console.log("Đã nhấn kết nối Solana");

      // Kết nối ví
      const resp = await connectTheWallet();
      if (!resp || !resp.addr) {
        console.error(
          "Kết nối ví không thành công hoặc địa chỉ không xác định"
        );
        return;
      }

      console.log("Địa chỉ ví:", resp.addr);

      // Lưu thông tin ví vào session
      ReactSession.set("connected_wallet", resp.addr);
      setWalletId(resp.addr);
      localStorage.setItem("connected_wallet", resp.addr); // Lưu vào localStorage

      // Kiểm tra ví thông qua API
      const url = `https://api.gameshift.dev/nx/users/${resp.addr}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": xKey,
        },
      };

      // Gửi yêu cầu API để kiểm tra ví
      const apiResponse = await fetch(url, options);
      const apiData = await apiResponse.json();

      // In kết quả nhận được từ API
      console.log("Kết quả từ API:", apiData);

      // Kiểm tra giá trị ví từ ReactSession
      const sessionWallet = ReactSession.get("connected_wallet");
      console.log("Ví từ ReactSession:", sessionWallet);

      // Kiểm tra giá trị ví từ localStorage
      const localWallet = localStorage.getItem("connected_wallet");
      console.log("Ví từ localStorage:", localWallet);

      if (apiData.message === "User not found") {
        navigate("/register");
      }else{
        navigate("/marketplace")
      }
    } catch (error) {
      console.error("Lỗi khi kết nối Solana:", error);
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
                Khám phá, tạo và cập nhật NFTs của bạn
              </h2>
              <p
                className="p-para-light"
                style={{
                  marginTop: "30px",
                  marginBottom: "50px",
                  fontSize: "1.2em",
                }}
              >
                Kết nối, chia sẻ liên kết và khoe bộ sưu tập của bạn.
              </p>
              <button className="btn-solid-grad" onClick={solanaConnect}>
                Kết nối Ví
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
