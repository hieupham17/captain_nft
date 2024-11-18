import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { connectTheWallet } from "../utility/common";
import { ReactSession } from "react-client-session";

import { DomainContext } from "../Context/DomainContext";
import { WalletContext } from "../Context/WalletContext";

import wallIcon from "../resources/images/sidebar/wallet-icon.svg";
import dashIcon from "../resources/images/sidebar/dashboard-icon.svg";
import createIcon from "../resources/images/sidebar/create-icon.svg";
import markerPlaceIcon from "../resources/images/sidebar/marketplace.svg";
import loginIncom from "../resources/images/sidebar/stats.svg";
import RegisterIcon from "../resources/images/sidebar/history.svg";

const SideNav = () => {
  const { walletId, setWalletId } = useContext(WalletContext);
  const { solDomainsApp, setSolDomainApp } = useContext(DomainContext);
  const location_get = useLocation();
<<<<<<< HEAD

  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);

=======
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);

    const xKey = process.env.REACT_APP_API_KEY;


>>>>>>> d9720906d03e3b1c5d7c7f4aa3677b553fdd185f
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    setOpen(false);
  };
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    setOpen(true);
  };

  const solanaConnect = async () => {
    console.log("clicked solana connect");
    ReactSession.set("connected_wallet", "");
    const resp = await connectTheWallet();
    console.log(resp);
    ReactSession.set("connected_wallet", resp.addr);
    setWalletId(resp.addr);
    navigate("/wallet/" + resp.addr);
  };


  useEffect(() => {
    const endPoint = process.env.REACT_APP_URL_EP;
    const xKey = process.env.REACT_APP_API_KEY;
    let reqUrl = `${endPoint}wallet/get_domains?network=mainnet-beta&wallet=${walletId}`;
    if (walletId) {
      axios({
        url: reqUrl,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": xKey,
        },
      })
        .then((res) => {
          if (res.data.result[0]) {
            setSolDomainApp(res.data.result[0].name);
          } else {
            setSolDomainApp(null);
          }
        })
        .catch((err) => {
          console.warn(err);
          setSolDomainApp(null);
        });
    }
  }, [walletId]);

  return (
    <div>
      <div className="w-100 text-end" style={{ height: "60px" }}>
        {!isOpen ? (
          <br />
        ) : (
          <button
            className="close-sidepanel"
            onClick={openNav}
            style={{ marginTop: "60px", zIndex: "9" }}
          >
            <div className="custom-hamburg">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        )}
      </div>
      <div id="mySidenav" className="sidenav">
        <div className="row sidemenu-wall ms-2">
          <div className="col-3 align-self-center">
            <img src={wallIcon} alt="dashboard" />
          </div>
          <div className="col-9 align-self-center wallet-text-side">
            {solDomainsApp ? (
              solDomainsApp
            ) : walletId ? (
              walletId.substring(0, 5) +
              "....." +
              walletId.substring(walletId.length - 5)
            ) : (
              <button onClick={solanaConnect}>Connect Wallet</button>
            )}
          </div>
        </div>

        <hr className="divider" />
        <a id="cls-button" className="closebtn" onClick={closeNav}>
          Dismiss
        </a>
        <Link
          className={
            location_get.pathname === `/wallet/${walletId}` ||
            location_get.pathname === `/`
              ? "active"
              : ""
          }
          to={walletId === null ? `/` : `/wallet/${walletId}`}
        >
          <div className="row sidemenu-anc">
            <div className="col-3">
              <img src={dashIcon} alt="dashboard" />
            </div>
            <div className="col-9">
              <p>My NFTs</p>
            </div>
          </div>
        </Link>
        <Link
          to={walletId === null ? `/connect-wallet` : `/create`}
          className={
            location_get.pathname === "/create" ||
            location_get.pathname === "/connect-wallet"
              ? "active"
              : ""
          }
        >
          <div className="row sidemenu-anc">
            <div className="col-3">
              <img src={createIcon} alt="Create" />
            </div>
            <div className="col-9">
              <p>Create NFT</p>
            </div>
          </div>
        </Link>
        <Link
          to="/marketplace"
          className={location_get.pathname === "/marketplace" ? "active" : ""}
        >
          <div className="row sidemenu-anc">
            <div className="col-3">
              <img src={markerPlaceIcon} alt="Create" />
            </div>
            <div className="col-9">
              <p>Marketplace</p>
            </div>
          </div>
        </Link>

        {/* Thêm phần đăng nhập và đăng ký */}
        <hr className="divider" />
        <Link
          to="/login"
          className={location_get.pathname === "/login" ? "active" : ""}
        >
          <div className="row sidemenu-anc">
            <div className="col-3">
              <img src={loginIncom} alt="Create" />
            </div>
            <div className="col-9">
              <p>Login</p>
            </div>
          </div>
        </Link>

        <Link
          to="/register"
          className={location_get.pathname === "/register" ? "active" : ""}
        >
          <div className="row sidemenu-anc">
            <div className="col-3">
              <img src={RegisterIcon} alt="Create" />
            </div>
            <div className="col-9">
              <p>Register</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
