import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resources/css/update.css';
import SuccessLoader from './Loaders/SuccessLoader'; // Import SuccessLoader

const NFTUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const nft = location.state?.nft || {};
    const nftId = nft.id || '';
    const xKey = process.env.REACT_APP_API_KEY;


    // State quản lý dữ liệu và hiển thị loader
    const [imageUrl, setImageUrl] = useState(nft.imageUrl || '');
    const [name, setName] = useState(nft.name || '');
    const [description, setDescription] = useState(nft.description || '');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loader

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
    const idWallet = 'kRRjGmLeMUGBJbtW57wQ2gUy6GzyV4zNJwUAFtBUHfS';
    const handleBack = () => {
        navigate('/wallet/' + idWallet);
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
                <button onClick={handleUpdate} className="btn btn-update">Update</button>
                <button onClick={handleBack} className="btn btn-back">Back</button>

            </form>
        </div>
    );
};

export default NFTUpdate;
