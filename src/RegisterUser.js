import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
      const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const xKey = process.env.REACT_APP_API_KEY;


    const registerUser = async (externalWalletAddress, referenceId, email) => {
        const url = 'https://api.gameshift.dev/nx/users';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'x-api-key': xKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                referenceId: referenceId,
                externalWalletAddress: externalWalletAddress,
                email: email
            })
        };

        try {
            setIsLoading(true);
            const response = await fetch(url, options);
            const data = await response.json();

            if (data) {
                console.log(data);
                // Điều hướng hoặc xử lý thêm sau khi đăng ký thành công
                navigate("/marketplace")
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đăng ký:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lấy địa chỉ ví từ session hoặc state
        const externalWalletAddress = localStorage.getItem("connected_wallet");
        const referenceId = externalWalletAddress; 
        if (externalWalletAddress && referenceId && email) {
            registerUser(externalWalletAddress, referenceId, email);
            alert('đăng ký thành công');
        } else {
            console.error('Thông tin không đầy đủ');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Đăng ký người dùng</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.5em',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '1em',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1em',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default RegisterUser;
