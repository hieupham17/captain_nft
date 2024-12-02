import React, { useState, useEffect } from 'react';

const TheMarketplace = () => {
  const [nftsForSale, setNftsForSale] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); 
  const [buyerId, setBuyerId] = useState(''); 
  const [isWalletConnected, setIsWalletConnected] = useState(false); 
  const xKey = process.env.REACT_APP_API_KEY;

  const checkPhantomWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect(); 
        setBuyerId(response.publicKey.toString()); 
        setIsWalletConnected(true); 
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
        console.log("Dữ liệu trả về từ API:", json);
  
        if (json && json.data && Array.isArray(json.data)) {
          const filteredNfts = json.data
            .filter(item => 
              item.type === 'UniqueAsset' && 
              item.item.forSale === true &&  // Đã được ký bán
              item.item.price?.naturalAmount && // Có giá
              parseFloat(item.item.price.naturalAmount) > 0 // Giá trị > 0
            )
            .map(item => ({
              id: item.item.id,
              name: item.item.name,
              description: item.item.description,
              imageUrl: item.item.imageUrl,
              price: parseFloat(item.item.price.naturalAmount), // Chuyển đổi giá trị sang số
            }));
  
          console.log("NFTs đã lọc:", filteredNfts);
  
          if (filteredNfts.length > 0) {
            setNftsForSale(filteredNfts);
            setLoading(false);
          } else {
            setMessage("Không có NFTs nào được ký bán với giá.");
            setLoading(false);
          }
        } else {
          setMessage("Không tìm thấy dữ liệu.");
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Lỗi khi gọi API:", err);
        setMessage("Đã xảy ra lỗi khi lấy dữ liệu.");
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
        'x-api-key': xKey, 
        'content-type': 'application/json'
      },
      body: JSON.stringify({ buyerId: buyerId }) 
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log("Mua thành công:", json);
        if (json.transactionId && json.consentUrl) {
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

  // Hàm hủy liên kết NFT
  const handleCancelListing = (itemId) => {
    const url = `https://api.gameshift.dev/nx/unique-assets/${itemId}/cancel-listing`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-api-key': xKey
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log("Hủy thành công:", json);
        setMessage("Listing cancelled successfully.");
        // Cập nhật lại danh sách NFT sau khi hủy
        window.location.href = json.consentUrl;
        setNftsForSale(nftsForSale.filter(nft => nft.id !== itemId));
      })
      .catch(err => {
        console.error(err);
        setMessage("An error occurred while cancelling the listing.");
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
              <div style={styles.nftDetails}>
                <h3>{nft.name}</h3>
                <p>{nft.description}</p>
                <p>Price: {nft.price} USDC</p>
              </div>
              {/* Nút mua */}
              <button 
                onClick={() => handleBuyNFT(nft.id)} 
                style={styles.buyButton}
              >
                Buy
              </button>
              {/* Nút hủy liên kết */}
              <button 
                onClick={() => handleCancelListing(nft.id)} 
                style={styles.cancelButton}
              >
                Cancel Listing
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'auto', 
  },
  nftImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  nftDetails: {
    flex: '1', 
  },
  buyButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  connectButton: {
    padding: '10px 20px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  }
};

export default TheMarketplace;