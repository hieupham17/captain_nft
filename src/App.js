import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactSession } from "react-client-session";

import { DomainContext } from "./Context/DomainContext";
import { WalletContext } from "./Context/WalletContext";
import { NetworkContext } from "./Context/NetworkContext";

import './resources/css/Home.css';
import './resources/css/Home-responsive.css';

import ListAll from './ListComponent';
import SideNav from "./sidebarComponent/SideNav";
import ConnectWallet from './ConnectWallet';
import GetDetails from './DetailsComponent';
import Create from './Create';
import Update from './UpdateComponent';
import NavBarComponent from './headerComponent/NavBarComponent';
import Footer from './footerComponent/footer';
import ConnectWalletCreate from './ConnectWalletCreate';
import TheMarketplace from './TheMarketplace';
import TransactionsMaster from './TransactionsMaster';
import StatsMaster from './StatsMaster';
import MyListingsMaster from './MyListingsMaster';
import Statistics from './Statistics';
import TransferMaster from './TransferMaster';
import NFTDetail from './NFTDetail';
import NFTUpdate from './NFTUpdate';
import Login from './login';
import RegisterUser from './RegisterUser';

function App() {
    const [walletId, setWalletId] = useState(null);
    const [solDomainsApp, setSolDomainApp] = useState(null);
    const [network, setNetwork] = useState("mainnet-beta");
    ReactSession.setStoreType("sessionStorage");

    return (
      <div className="App">
        <div className='red-sphere-back'>
          <WalletContext.Provider value={{ walletId, setWalletId }}>
            <NetworkContext.Provider value={{ network, setNetwork }}>
              <Router>
                <NavBarComponent />
                <DomainContext.Provider value={{ solDomainsApp, setSolDomainApp }}>
                  <SideNav />
                </DomainContext.Provider>
                <Routes>
                  <Route exact path="/" element={<ConnectWallet />} />
                  <Route path="/wallet/:waddress" element={<ListAll />} />
                  <Route exact path="/connect-wallet" element={<ConnectWalletCreate heading="Create NFTs and make magic happen" subHeading="Connect your wallet to get superpowers." navigateTo="/create" />} />
                  <Route exact path="/get-details" element={<GetDetails />} />
                  <Route exact path="/create" element={<Create />} />
                  <Route exact path="/update" element={<Update />} />
                  <Route exact path="/marketplace" element={<TheMarketplace />} />
                  <Route exact path="/transactions" element={<TransactionsMaster />} />
                  <Route exact path="/my-listings" element={<MyListingsMaster />} />
                  <Route exact path="/statistics" element={<Statistics />} />
                  <Route exact path="/transfer" element={<TransferMaster />} />
                  <Route path="/nft-detail/:nftId" element={<NFTDetail />} />
                  <Route path="/update/:nftId" element={<NFTUpdate />} />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/register" element={<RegisterUser />} />
                  <Route exact path="*" element={<ConnectWallet />} />
                </Routes>
                <Footer />
              </Router>
            </NetworkContext.Provider>
          </WalletContext.Provider>
        </div>
      </div>
    );
}

export default App;
