import React, { useState, useEffect } from 'react';

const ListAll = () => {
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mssg, setMssg] = useState("");
  const [sellingNft, setSellingNft] = useState(null); // NFT đang được bán
  const [price, setPrice] = useState(''); // Giá nhập vào

  const xKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const url = 'https://api.gameshift.dev/nx/items';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': xKey
      }
    };
    console.log("Current NFTs state:", nfts);

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        if (json && json.data && Array.isArray(json.data)) {
          const filteredNfts = json.data
            .filter(item => item.type === 'UniqueAsset') // Lọc chỉ những tài sản UniqueAsset
            .map(item => ({
              id: item.item.id,
              name: item.item.name,
              description: item.item.description,
              imageUrl: item.item.imageUrl
            }));
          if (filteredNfts.length > 0) {
            setNfts(filteredNfts);
            setLoaded(true);
          } else {
            setMssg("No UniqueAssets found.");
            setLoaded(true);
          }
        } else {
          setMssg("No data found.");
          setLoaded(true);
        }
      })
      .catch(err => {
        console.error(err);
        setMssg("An error occurred while fetching data.");
        setLoaded(true);
      });
  }, []);
  

  // Hàm xử lý API bán NFT
  const handleSell = (nftId) => {
    const url = `https://api.gameshift.dev/nx/unique-assets/${nftId}/list-for-sale`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-api-key': xKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ price: { currencyId: 'USDC', naturalAmount: price } })
    };
  
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.consentUrl) {
          // Điều hướng đến consentUrl
          window.location.href = json.consentUrl;
          // Chỉ sau khi xác nhận thành công thì loại bỏ NFT khỏi danh sách
          setNfts(prevNfts => prevNfts.filter(nft => nft.id !== nftId));
        } else {
          alert("Asset is already listed for sale");
        }
        setSellingNft(null); 
        setPrice(''); 
      })
      .catch(err => {
        console.error(err);
        alert("Failed to list NFT for sale.");
      });
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>My NFTs</h3>
      {!loaded && <p>Loading...</p>}
      {mssg && <p style={styles.message}>{mssg}</p>}

      <div style={styles.nftList}>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} style={styles.nftItem}>
              <img src={nft.imageUrl} alt={nft.name} style={styles.nftImage} />
              <h3 style={styles.nftName}>{nft.name}</h3>
              <p style={styles.nftDescription}>{nft.description}</p>
              <button
                style={styles.sellButton}
                onClick={() => setSellingNft(nft.id)} // Mở form bán
              >
                Sell
              </button>
              {sellingNft === nft.id && (
                <div style={styles.sellForm}>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.priceInput}
                  />
                  <button onClick={() => handleSell(nft.id)} style={styles.confirmButton}>
                    Confirm
                  </button>
                  <button onClick={() => setSellingNft(null)} style={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No NFTs available</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  message: {
    color: 'red',
    fontSize: '1rem',
    marginTop: '10px',
  },
  nftList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  nftItem: {
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  nftImage: {
    width: '100%',   
    height: '250px', 
    objectFit: 'cover', 
    borderRadius: '8px',
    marginBottom: '15px',
  },
  nftName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  nftDescription: {
    fontSize: '1rem',
    color: '#777',
  },
  sellButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  sellForm: {
    marginTop: '10px',
  },
  priceInput: {
    padding: '5px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  confirmButton: {
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  title: {
    color: '#00FF00',
    fontSize: '3rem'
  },
};

export default ListAll;