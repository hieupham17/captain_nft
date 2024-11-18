import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './resources/css/detail.css';

const NFTDetail = () => {
    const { nftId } = useParams(); // Extract nftId from the URL
    const [nft, setNft] = useState(null);
    const [ownerEmail, setOwnerEmail] = useState(null);  // New state for owner's email
    const [loading, setLoading] = useState(true);
    const xKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyOTQxMDA4MC1kYWRhLTRlMDAtYTIyZC0xMTVmY2JhZWNjNjAiLCJzdWIiOiIzOTBjNDU2My02YzYzLTRiMjMtYTA0ZS05ZmE5YzcxZjUzNTkiLCJpYXQiOjE3MzE1Njg5NTF9.DB5_pKpEjuYv6T5v22cMy-ZKKUiCVXnZ3YLmhmO5Wrw';

    const navigate = useNavigate(); // Initialize the navigate function

    // Fetch NFT details and owner email
    useEffect(() => {
        const fetchNftDetail = async () => {
            try {
                const nftResponse = await fetch(`https://api.gameshift.dev/nx/items/${nftId}`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'x-api-key': xKey,
                    },
                });

                if (!nftResponse.ok) throw new Error('Failed to fetch NFT details');
                const nftData = await nftResponse.json();
                setNft(nftData);

                // Fetch owner email based on address
                const ownerAddress = nftData.item.owner?.address;
                if (ownerAddress) {
                    const ownerResponse = await fetch(`https://api.gameshift.dev/nx/users/${ownerAddress}`, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'x-api-key': xKey,
                        },
                    });

                    if (!ownerResponse.ok) throw new Error('Failed to fetch owner email');
                    const ownerData = await ownerResponse.json();
                    setOwnerEmail(ownerData.email);  // Set owner's email
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNftDetail();
    }, [nftId]);
    // id vi
    const idWallet ='5UpHhzCqZmfiJp8zjnz1qy22BjYmfRu5PbyPupqCVigh';
    const handleBack = () => {
        navigate('/wallet/' + idWallet); 
    };
    const handleUpdate = () => {
        navigate(`/update/${nftId}`, { state: { nft } });
    };
    

    if (loading) return <p>Loading NFT details...</p>;
    if (!nft) return <p>Failed to load NFT details.</p>;

    return (
        <div className="nft-detail-container">
            <h3>Name NFT: {nft.item.name}</h3>
            <img src={nft.item.imageUrl} alt={nft.item.name} className="nft-detail-image" />
            <p><strong>Description:</strong> {nft.item.description}</p>
            <p>
                <strong>Price:</strong>
                {nft.item.price?.naturalAmount
                    ? `${nft.item.price.naturalAmount} ${nft.item.price.currencyId}`
                    : 'Not listed yet'}
            </p>

            <p><strong>Collection:</strong> {nft.item.collection?.name}</p>

            {/* Display Owner Information */}
            {nft.item.owner && (
                <div className="owner-info">
                    {ownerEmail ? (
                        <p><strong>Owner :</strong> {ownerEmail}</p>
                    ) : (
                        <p><strong>Owner :</strong> Not available</p>
                    )}
                    <p><strong>Status:</strong> {nft.item.status || 'Status not available'}</p>

                    {/* Buttons */}
                    <div className="button-container">
                        <button 
                            onClick={handleBack} 
                            className="btn btn-back">
                            Back
                        </button>
                        <button 
                            // onClick={handleUpdate}
                            className="btn btn-update">
                            Update
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTDetail;
