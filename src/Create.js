import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "./Context/WalletContext";
import file1 from "./resources/images/inner-box.png";
import CreateLoader from "./Loaders/CreateLoader";
import { signAndConfirmTransaction } from "./utility/common";
import SuccessLoader from "./Loaders/SuccessLoader";

const Create = () => {
  const navigate = useNavigate();
  const xKey = process.env.REACT_APP_API_KEY;
  const { walletId } = useContext(WalletContext);

  console.log("walletId:", walletId);

  useEffect(() => {
    if (!walletId) navigate("/connect-wallet");
  }, [walletId, navigate]);

  const [collectionId] = useState("9e42d403-aada-4ab0-aaaf-7f32d879fba2");// colletionId của bạn 
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 
  const [dispFile, setDispFile] = useState(file1);

  const [isLoading, setloading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [mainErr, setMainErr] = useState("");
  const [compleMint, setComMinted] = useState(false);
  const [minted, setMinted] = useState(null);

  const callback = (signature, result) => {
    console.log("Signature ", signature);
    console.log("result ", result);

    try {
      if (signature.err === null) {
        setComMinted(true);
      } else {
        setMainErr("Signature Failed");
        setSuccessful(false);
      }
    } catch (error) {
      setMainErr("Signature Failed, but check your wallet");
      setSuccessful(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMainErr(""); 

    // Kiểm tra các trường bắt buộc
    if (!name || !desc || !imageUrl) {
      setMainErr("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Kiểm tra URL hợp lệ
    if (!isValidUrl(imageUrl)) {
      setFileErr("Vui lòng nhập một URL hợp lệ.");
      return;
    }

    // Kiểm tra các trường nhập liệu khác
    if (name.trim() === "") {
      setNameErr("Tên không được để trống.");
      return;
    }
    if (desc.trim() === "") {
      setDescErr("Mô tả không được để trống.");
      return;
    }

    const jsonPayload = {
      details: {
        collectionId: collectionId,
        description: desc,
        imageUrl: imageUrl, 
        name: name,
      },
      destinationUserReferenceId: walletId,
    };

    // Cấu hình request
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": xKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    };

    setloading(true); // Bắt đầu loading

    try {
      const response = await fetch("https://api.gameshift.dev/nx/unique-assets", options);
      const json = await response.json();

      if (json.success) {
        const transaction = json.result.encoded_transaction;
        setMinted(json.result.mint);
        signAndConfirmTransaction(transaction, callback).then(
          (ret_result) => {
            setSuccessful(true);
            setloading(false);
          }
        );
      } else {
        setMainErr(json.message);
        setloading(false);
      }
    } catch (error) {
      console.warn(error);
      setMainErr("Đã có lỗi xảy ra, vui lòng thử lại.");
      setloading(false);
    }
  };

  // Hàm kiểm tra URL hợp lệ
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div>
      {isLoading && <CreateLoader />}
      {successful && <SuccessLoader />}
      <div className="right-al-container">
        <div className="container-lg mint-single">
          <div className="row page-heading-container">
            <div className="col-sm-12 col-md-8">
              <h2 className="section-heading">Create Master NFT</h2>
            </div>
          </div>
          <form onSubmit={handleUpload}>
            <div className="row">
              <div className="col-sm-12 col-md-5">
                <div className="image-section">
                  <div className="image-container">
                    <div className="inner">
                      <img className="img-fluid" src={imageUrl || dispFile} alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 col-md-7">
                <div className="form-section">
                  <div className="form-elements-container">
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="name">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        maxLength={32}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setNameErr("This field cannot be empty");
                          } else {
                            setNameErr("");
                          }
                          setName(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Enter NFT Name"
                        required
                      />
                      <small className="error-msg">{nameErr}</small>
                    </div>
                    <div className="white-form-group">
                      <label htmlFor="bio" className="form-label">
                        Description*
                      </label>
                      <br />
                      <label className="form-label sub-label" htmlFor="name">
                        The description will be included on the item's detail
                        page underneath its image.
                      </label>
                      <textarea
                        name="desc"
                        value={desc}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setDescErr("This field cannot be empty");
                          } else {
                            setDescErr("");
                          }
                          setDesc(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Type a small story"
                        rows="5"
                        required
                      ></textarea>
                      <small className="error-msg">{descErr}</small>
                    </div>

                    <div className="white-form-group">
                      <label htmlFor="imageUrl" className="form-label">
                        Image URL*
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setFileErr(""); // Reset lỗi nếu có
                        }}
                        className="form-control"
                        placeholder="Enter image URL"
                        required
                      />
                      <small className="error-msg">{fileErr}</small>
                    </div>

                    <div className="white-form-group">
                      <button
                        className="btn-solid-grad px-5"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                    <small className="mt-1 error-msg">{mainErr}</small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;

