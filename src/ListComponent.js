import React, { useState, useEffect } from 'react';

const ListAll = () => {
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mssg, setMssg] = useState("");

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

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log(json); // Log json data to check structure

        // Lọc các tài sản có type là "UniqueAsset"
        if (json && json.data && Array.isArray(json.data)) {
          const filteredNfts = json.data
            .filter(item => item.type === 'UniqueAsset') // Lọc chỉ những tài sản UniqueAsset
            .map(item => ({
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
  }, []); // Empty dependency array to run this effect only once

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>My NFts</h3>
      {!loaded && <p>Loading...</p>} {/* Show loading message until data is fetched */}
      {mssg && <p style={styles.message}>{mssg}</p>} {/* Show message if there's an error or no data */}

      <div style={styles.nftList}>
        {console.log(nfts)} {/* Log nfts data for debugging */}
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} style={styles.nftItem}>
              <img src={nft.imageUrl} alt={nft.name} style={styles.nftImage} />
              <h3 style={styles.nftName}>{nft.name}</h3>
              <p style={styles.nftDescription}>{nft.description}</p>
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
    height: 'auto',
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
  title: {
    color: '#00FF00',
    fontSize: '3rem'
  }
};

export default ListAll;
