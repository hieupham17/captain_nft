import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resources/css/update.css';
import SuccessLoader from './Loaders/SuccessLoader'; // Import SuccessLoader

const NFTUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const nft = location.state?.nft || {};
    const nftId = nft.id || '';

    // State quản lý dữ liệu và hiển thị loader
    const [imageUrl, setImageUrl] = useState(nft.imageUrl || '');
    const [name, setName] = useState(nft.name || '');
    const [description, setDescription] = useState(nft.description || '');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loader

    const xKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyOTQxMDA4MC1kYWRhLTRlMDAtYTIyZC0xMTVmY2JhZWNjNjAiLCJzdWIiOiIzOTBjNDU2My02YzYzLTRiMjMtYTA0ZS05ZmE5YzcxZjUzNTkiLCJpYXQiOjE3MzE1Njg5NTF9.DB5_pKpEjuYv6T5v22cMy-ZKKUiCVXnZ3YLmhmO5Wrw';

    const handleUpdate = async () => {
        setIsLoading(true); // Hiển thị loader
        try {
            const response = await fetch(`https://api.gameshift.dev/nx/unique-assets/${nftId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': xKey,
                },
                body: JSON.stringify({
                    imageUrl,
                    name,
                    description,
                }),
            });

            if (!response.ok) throw new Error('Failed to update NFT');

            // Thêm thời gian chờ để hiển thị loader
            setTimeout(() => {
                setIsLoading(false); // Ẩn loader
                navigate(-1); // Quay lại trang trước
            }, 2000);
        } catch (error) {
            console.error(error);
            setIsLoading(false); // Ẩn loader ngay nếu có lỗi
        }
    };

    if (isLoading) {
        return <SuccessLoader />; // Hiển thị loader nếu đang tải
    }

    return (
        <div className="form-update">
            <h2>Update NFT</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
                <br />
                <button onClick={handleUpdate}>Update</button>
            </form>
        </div>
    );
};

export default NFTUpdate;
