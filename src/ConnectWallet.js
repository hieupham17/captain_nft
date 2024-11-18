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
            // Xóa session trước khi kết nối
            ReactSession.set("connected_wallet", '');
            console.log('clicked solana connect');

            // Kết nối ví
            const resp = await connectTheWallet();
            if (!resp || !resp.addr) {
                console.error('Failed to connect wallet or address is undefined');
                return;
            }

            // Lưu thông tin ví vào session
            ReactSession.set("connected_wallet", resp.addr);
            setWalletId(resp.addr);

            // Gọi API để lấy referenceId
            const url = `https://api.gameshift.dev/nx/users/${resp.addr}`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-api-key': xKey
                }
            };

            const apiResponse = await fetch(url, options);
            if (!apiResponse.ok) {
                console.error('Failed to fetch referenceId:', apiResponse.statusText);
                return;
            }

            const data = await apiResponse.json();
            console.log('API Response:', data);

            const referenceId = data.referenceId; 
            if (referenceId) {
                // Lưu referenceId vào session
                ReactSession.set("referenceId", referenceId);
                console.log('Reference ID:', referenceId);

                // Điều hướng tới trang ví cùng với referenceId
                navigate(`/wallet/${resp.addr}?ref=${referenceId}`);
            } else {
                console.error('No referenceId found in API response');
            }
        } catch (error) {
            console.error('Error during solanaConnect:', error);
        }
    };

    return (
        <div>
            <div className="right-al-container mb-2">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <h2 className="section-heading" style={{ marginTop: "60px", marginBottom: "20px" }}>Explore, Create and Update your Nfts</h2>
                            <p className="p-para-light" style={{ marginTop: "30px", marginBottom: "50px", fontSize: "1.2em" }}>Connect, share the link and flaunt your collection.</p>
                            <button className="btn-solid-grad" onClick={solanaConnect}>Connect Wallet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectWallet;
