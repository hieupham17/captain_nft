// import React, { useLocation, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const NFTUpdate = () => {
//     const location = useLocation(); // Get state passed from previous page
//     const { nft } = location.state || {}; // Destructure nft details from the state
//     const [updatedNft, setUpdatedNft] = useState(nft);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!nft) {
//             navigate('/wallet'); // If no NFT details are passed, redirect to the list
//         }
//     }, [nft, navigate]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatedNft({
//             ...updatedNft,
//             item: {
//                 ...updatedNft.item,
//                 [name]: value, // Update specific field in the nft details
//             },
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const url = `https://api.gameshift.dev/nx/unique-assets/${nft.item.id}`;
//         const options = {
//             method: 'PUT',
//             headers: {
//                 accept: 'application/json',
//                 'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyOTQxMDA4MC1kYWRhLTRlMDAtYTIyZC0xMTVmY2JhZWNjNjAiLCJzdWIiOiIzOTBjNDU2My02YzYzLTRiMjMtYTA0ZS05ZmE5YzcxZjUzNTkiLCJpYXQiOjE3MzE1Njg5NTF9.DB5_pKpEjuYv6T5v22cMy-ZKKUiCVXnZ3YLmhmO5Wrw',
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify({
//                 imageUrl: updatedNft.item.imageUrl,
//                 name: updatedNft.item.name,
//                 description: updatedNft.item.description,
//             }),
//         };

//         try {
//             const response = await fetch(url, options);
//             if (!response.ok) {
//                 throw new Error('Failed to update NFT');
//             }
//             const json = await response.json();
//             console.log('Updated NFT:', json);
//             navigate(`/detail/${nft.item.id}`); // Redirect to the detail page after update
//         } catch (error) {
//             console.error('Error updating NFT:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!updatedNft) return <p>Loading...</p>;

//     return (
//         <div className="nft-update-container">
//             <h3>Update NFT Details</h3>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Image URL</label>
//                     <input
//                         type="text"
//                         name="imageUrl"
//                         value={updatedNft.item.imageUrl}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={updatedNft.item.name}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Description</label>
//                     <textarea
//                         name="description"
//                         value={updatedNft.item.description}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Updating...' : 'Update NFT'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default NFTUpdate;
