import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const TheMarketplace = () => {
  const [nftsForSale, setNftsForSale] = useState([]); // NFT đã được ký bán
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [message, setMessage] = useState(""); // Thông báo lỗi hoặc trạng thái
  const [buyerId, setBuyerId] = useState(''); // Giả sử bạn đã có buyerId từ ví Phantom
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Trạng thái ví kết nối
  const xKey = process.env.REACT_APP_API_KEY;

  // Kiểm tra kết nối ví Phantom và lấy địa chỉ ví
  const checkPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect(); // Kết nối ví Phantom
        setBuyerId(response.publicKey.toString()); // Lưu địa chỉ ví vào buyerId
        setIsWalletConnected(true); // Đánh dấu ví đã được kết nối
        setMessage("Wallet connected.");
      } catch (err) {
        setMessage("Please connect your Phantom wallet.");
      }
    } else {
      setMessage("Phantom wallet not detected.");
    }
  };

  // Fetch dữ liệu NFT đã ký bán từ API
  useEffect(() => {
    const url = 'https://api.gameshift.dev/nx/items';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': xKey
      }
    };
  
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log("Dữ liệu API trả về:", json); // Log toàn bộ dữ liệu API
        if (json && json.data && Array.isArray(json.data)) {
          const filteredNfts = json.data
            .filter(item => {
              console.log("Item data:", item); // Log từng item để kiểm tra
              return (
                item.type === 'UniqueAsset' && 
                item.item.escrow === true &&   // Kiểm tra escrow = true
                item.item.priceCents !== null && // Kiểm tra có priceCents hợp lệ
                item.item.priceCents > 0  // Kiểm tra có giá trị priceCents hợp lệ
              );
            })
            .map(item => ({
              id: item.item.id,
              name: item.item.name,
              description: item.item.description,
              imageUrl: item.item.imageUrl,
              price: item.item.priceCents / 100, // Chuyển priceCents từ cents sang USD
            }));
  
          console.log("NFT sau khi lọc:", filteredNfts); // Kiểm tra mảng sau khi lọc
  
          if (filteredNfts.length > 0) {
            setNftsForSale(filteredNfts);
            setLoading(false);
          } else {
            setMessage("No NFTs listed for sale with escrow and price.");
            setLoading(false);
          }
        } else {
          setMessage("No data found.");
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setMessage("An error occurred while fetching data.");
        setLoading(false);
      });
  }, []); 

  // Hàm mua NFT
  const handleBuyNFT = (itemId) => {
    if (!buyerId) {
      setMessage("Please connect your Phantom wallet first.");
      return;
    }

    const url = `https://api.gameshift.dev/nx/unique-assets/${itemId}/buy`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY, // Lấy từ env hoặc hardcode
        'content-type': 'application/json'
      },
      body: JSON.stringify({ buyerId: buyerId }) // Gửi buyerId từ ví người dùng
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log("Mua thành công:", json);
        if (json.transactionId && json.consentUrl) {
          // Chuyển hướng người dùng đến trang consentUrl để ký mua
          window.location.href = json.consentUrl;
        } else {
          setMessage("An error occurred while processing the purchase.");
        }
      })
      .catch(err => {
        console.error(err);
        setMessage("An error occurred while purchasing the NFT.");
      });
  };

  return (
    <div style={styles.container}>
      <h3>The Marketplace</h3>
      
      {loading && <p>Loading NFTs...</p>}
      {message && <p style={styles.errorMessage}>{message}</p>}

      {/* Hiển thị NFT đã ký bán */}
      <div style={styles.nftList}>
        {nftsForSale.length > 0 ? (
          nftsForSale.map(nft => (
            <div key={nft.id} style={styles.nftItem}>
              <img src={nft.imageUrl} alt={nft.name} style={styles.nftImage} />
              <h3>{nft.name}</h3>
              <p>{nft.description}</p>
              <p>Price: {nft.price} USDC</p>
              {/* <p><strong>ID:</strong> {nft.id}</p> */}
              {/* Nút mua */}
              <button 
                onClick={() => handleBuyNFT(nft.id)} 
                style={styles.buyButton}
              >
                Buy
              </button>
            </div>
          ))
        ) : (
          <p>No NFTs are listed for sale with escrow and price.</p>
        )}
      </div>

      {/* Nút kết nối ví Phantom */}
      <button onClick={checkPhantomWallet} style={styles.connectButton}>
        {isWalletConnected ? 'Wallet Connected' : 'Connect Phantom Wallet'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1rem',
    marginTop: '10px',
  },
  nftList: {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  nftItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  nftImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  buyButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  connectButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9b00',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default TheMarketplace;
