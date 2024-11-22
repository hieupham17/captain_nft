import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ListAll = () => {
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mssg, setMssg] = useState("");
  const [sellingNft, setSellingNft] = useState(null); 
  const [price, setPrice] = useState(''); 
  const [selectedNft, setSelectedNft] = useState(null); 

  const [searchTerm, setSearchTerm] = useState(""); 

  const xKey = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();

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
            .filter(item => item.type === 'UniqueAsset')
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

  const handleViewDetail = (nft) => {
    navigate(`/nft-detail/${nft.id}`);
  };
  const handleUpdate = (nft) => {
    navigate(`/update/${nft.id}`, { state: { nft } }); // Điều hướng sang trang cập nhật với dữ liệu NFT
  };
  


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
          window.location.href = json.consentUrl;
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
  // Filter NFTs based on search term
  const filteredNfts = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>My NFTs</h3>

    {/* Search Bar */}
    <div style={styles.inputContainer}>
      <label style={styles.label}>Search</label>
      <input
        style={styles.input}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search NFTs by name and description"
      />
    </div>
      {/* Search Bar */}
      <div style={styles.inputContainer}>
        <label style={styles.label}>Search</label>
        <input
          style={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          placeholder="Search NFTs by name and description"
        />
      </div>

      {/* Loading and Error Messages */}
      {!loaded && <p>Loading...</p>}
      {mssg && <p style={styles.message}>{mssg}</p>}

      {/* NFT List */}
      <div style={styles.nftList}>
        {filteredNfts.length > 0 ? (
          filteredNfts.map((nft, index) => (
            <div key={index} style={styles.nftItem}>
              <img src={nft.imageUrl} alt={nft.name} style={styles.nftImage} />
              <h3 style={styles.nftName}>{nft.name}</h3>
              <p style={styles.nftDescription}>{nft.description}</p>

              {/* Detail Button */}
              <button
                style={styles.viewDetailButton}
                onClick={() => handleViewDetail(nft)}
              >
                Detail
              </button>
              {/* Update Button */}
              <button
                style={styles.updateButton} // Add styling for the Update button
                onClick={() => handleUpdate(nft)} // Call the update handler function
              >
                Update
              </button>

              {/* Sell Button and Form */}
              <button
                style={styles.sellButton}
                onClick={() => setSellingNft(nft.id)}
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
                  <button
                    onClick={() => handleSell(nft.id)}
                    style={styles.confirmButton}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setSellingNft(null)}
                    style={styles.cancelButton}
                  >
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

      {/* Modal for NFT Details */}
      {selectedNft && (
        <div
          className="modal fade show"
          id="nftModal"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          aria-labelledby="nftModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="nftModalLabel">
                  {selectedNft.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedNft(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedNft.imageUrl}
                  alt={selectedNft.name}
                  style={styles.nftImage}
                />
                <p>{selectedNft.description}</p>
                <p>
                  <strong>Price:</strong>{' '}
                  {selectedNft.price ? selectedNft.price : 'Not listed'}
                </p>
                <p>
                  <strong>Collection:</strong>{' '}
                  {selectedNft.collection ? selectedNft.collection.name : 'N/A'}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedNft(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};
const styles = {
  container: {
    width: '100%',
    maxWidth: '80%',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
    marginLeft: '270px'
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
  viewDetailButton: {
    padding: '10px 20px',
    // backgroundColor: 'none',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '10px',
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
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  input: {
    width: '250px',
    height: '40px',
    padding: '5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    marginLeft: '10px',
    marginTop: '-5px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  label: {
    fontSize: '18px',
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#33333'
  },
}
export default ListAll;
