import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "./Context/WalletContext";
import CreateLoader from "./Loaders/CreateLoader";
import { signAndConfirmTransaction } from "./utility/common";
import SuccessLoader from "./Loaders/SuccessLoader";

import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from './WalletContext'; // Update the import path as needed
import CreateLoader from './CreateLoader'; // Update the import path as needed
import SuccessLoader from './SuccessLoader'; // Update the import path as needed

const Create = () => {
  const navigate = useNavigate();
  const xKey = process.env.REACT_APP_API_KEY;
  const endPoint = process.env.REACT_APP_URL_EP;
  const { walletId } = useContext(WalletContext);
  console.log("walletId: ", walletId);

  // Redirect to connect wallet if walletId is not available
  useEffect(() => {
    if (!walletId) navigate('/connect-wallet');
  }, [walletId, navigate]);

  const [isLoading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [network, setNetwork] = useState("devnet");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [desc, setDesc] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [maxSupply, setMaxSupply] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [file, setFile] = useState(null);
  const [dispFile, setDispFile] = useState(null);

  // Error states
  const [nameErr, setNameErr] = useState("");
  const [symErr, setSymErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [errMaxSup, setErrMaxSup] = useState("");
  const [errRoy, setErrRoy] = useState("");
  const [mainErr, setMainErr] = useState("");
  const [attribErr, setAttribErr] = useState("");
  
  const [attribs, setAttribs] = useState([{ id: "5", trait_type: "", value: "" }]);
  const [minted, setMinted] = useState(null);
  const [compleMint, setComMinted] = useState(false);

  // Callback for transaction confirmation
  const callback = (signature, result) => {
    console.log("Signature ", signature);
    console.log("result ", result);

    if (signature.err === null) {
      setComMinted(true);
    } else {
      setMainErr("Signature Failed");
      setSuccessful(false);
    }
  };

  // Redirect after successful mint
  useEffect(() => {
    if (compleMint) navigate(`/get-details?token_address=${minted}&network=${network}&refresh`);
  }, [compleMint, minted, network, navigate]);

  const handleUpload = (e) => {
    e.preventDefault();
    // Reset errors
    setAttribErr("");
    setMainErr("");

    // Error flags
    const errors = {
      name: !name,
      symbol: !symbol,
      description: !desc,
      file: !file,
      royalty: royalty < 0 || royalty > 100,
      maxSupply: maxSupply <= 0,
      attrib: attribs.some(element => !element.trait_type || !element.value),
    };

    // Setting specific error messages
    setNameErr(errors.name ? "This field cannot be empty" : "");
    setSymErr(errors.symbol ? "This field cannot be empty" : "");
    setDescErr(errors.description ? "This field cannot be empty" : "");
    setFileErr(errors.file ? "Please select a file" : "");
    setErrRoy(errors.royalty ? "Value should be between 0 to 100" : "");
    setErrMaxSup(errors.maxSupply ? "Should be a number greater than 0" : "");
    setAttribErr(errors.attrib ? "Attributes cannot be empty" : "");

    // If there are errors, stop execution
    if (Object.values(errors).some(error => error)) {
      setMainErr("Please fill all the required fields correctly.");
      return;
    }

    setLoading(true);

    // Prepare attributes for sending
    const attributesToSend = attribs.map(attr => ({
      trait_type: attr.trait_type,
      value: attr.value,
    }));

    const formData = new FormData();
    formData.append("network", network);
    formData.append("wallet", walletId);
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", desc);
    formData.append("attributes", JSON.stringify(attributesToSend));
    formData.append("external_url", externalUrl);
    formData.append("max_supply", maxSupply);
    formData.append("royalty", royalty);
    formData.append("file", file);

    // Log values to the console
    console.log({
      network,
      walletId,
      name,
      symbol,
      desc,
      attributes: attributesToSend,
      externalUrl,
      maxSupply,
      royalty,
      file,
    });

    // Sending request
    axios.post(`${endPoint}nft/create_detach`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": xKey,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(async (res) => {
      console.log(res);
      if (res.data.success) {
        const transaction = res.data.result.encoded_transaction;
        setMinted(res.data.result.mint);
        const ret_result = await signAndConfirmTransaction(network, transaction, callback);
        console.log(ret_result);
        setSuccessful(true);
      } else {
        setMainErr(res.data.message);
      }
    })
    .catch((err) => {
      console.warn(err);
      setMainErr(err.message || "An unexpected error occurred.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const remField = (index) => {
    const list = [...attribs];
    list.splice(index, 1);
    setAttribs(list);
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
                      <img className="img-fluid" src={dispFile} alt="Preview" />
                    </div>
                  </div>
                  <div className="button-container">
                    <input
                      type="file"
                      id="testFile"
                      className="custom-file-input-1"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        setFile(selectedFile);
                        setFileErr("");
                        setDispFile(URL.createObjectURL(selectedFile));
                      }}
                    />
                  </div>
                  <div className="text-center" style={{ width: "90%" }}>
                    <small className="error-msg">{fileErr}</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 col-md-7">
                <div className="form-section">
                  <div className="form-elements-container">
                    <div className="white-form-group">
                      <label htmlFor="network" className="form-label">Network*</label>
                      <select
                        name="network"
                        className="form-control form-select"
                        onChange={(e) => setNetwork(e.target.value)}
                      >
                        <option value="devnet">Devnet</option>
                        <option value="testnet">Testnet</option>
                        <option value="mainnet-beta">Mainnet</option>
                      </select>
                    </div>
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="name">Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        maxLength={32}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameErr(e.target.value ? "" : "This field cannot be empty");
                        }}
                        className="form-control"
                        placeholder="Enter NFT Name"
                        required
                      />
                      <small className="error-msg">{nameErr}</small>
                    </div>
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="symbol">Symbol*</label>
                      <input
                        type="text"
                        name="symbol"
                        value={symbol}
                        maxLength={10}
                        onChange={(e) => {
                          setSymbol(e.target.value);
                          setSymErr(e.target.value ? "" : "This field cannot be empty");
                        }}
                        className="form-control"
                        placeholder="Enter NFT Symbol"
                        required
                      />
                      <small className="error-msg">{symErr}</small>
                    </div>
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="description">Description*</label>
                      <textarea
                        rows="4"
                        name="description"
                        value={desc}
                        onChange={(e) => {
                          setDesc(e.target.value);
                          setDescErr(e.target.value ? "" : "This field cannot be empty");
                        }}
                        className="form-control"
                        placeholder="Enter Description"
                        required
                      />
                      <small className="error-msg">{descErr}</small>
                    </div>

                    <div className="white-form-group">
                      <label className="form-label" htmlFor="external_url">External URL</label>
                      <input
                        type="text"
                        name="external_url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        className="form-control"
                        placeholder="External URL"
                      />
                    </div>
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="max_supply">Max Supply*</label>
                      <input
                        type="number"
                        name="max_supply"
                        value={maxSupply}
                        onChange={(e) => {
                          setMaxSupply(e.target.value);
                          setErrMaxSup(e.target.value <= 0 ? "Should be a number greater than 0" : "");
                        }}
                        className="form-control"
                        placeholder="Enter Max Supply"
                        required
                      />
                      <small className="error-msg">{errMaxSup}</small>
                    </div>
                    <div className="white-form-group">
                      <label className="form-label" htmlFor="royalty">Royalty %*</label>
                      <input
                        type="number"
                        name="royalty"
                        value={royalty}
                        onChange={(e) => {
                          setRoyalty(e.target.value);
                          setErrRoy(e.target.value < 0 || e.target.value > 100 ? "Value should be between 0 to 100" : "");
                        }}
                        className="form-control"
                        placeholder="Enter Royalty Percentage"
                        required
                      />
                      <small className="error-msg">{errRoy}</small>
                    </div>
                  </div>

                  <div className="attrib-container">
                    <h5 className="mb-3">Attributes</h5>
                    {attribs.map((attr, index) => (
                      <div key={index} className="attrib-element mb-2">
                        <input
                          type="text"
                          placeholder="Trait Type"
                          value={attr.trait_type}
                          onChange={(e) => {
                            const updatedAttribs = [...attribs];
                            updatedAttribs[index].trait_type = e.target.value;
                            setAttribs(updatedAttribs);
                          }}
                          className="form-control"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={attr.value}
                          onChange={(e) => {
                            const updatedAttribs = [...attribs];
                            updatedAttribs[index].value = e.target.value;
                            setAttribs(updatedAttribs);
                          }}
                          className="form-control"
                        />
                        <button type="button" onClick={() => remField(index)} className="btn btn-danger">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setAttribs([...attribs, { trait_type: "", value: "" }])} className="btn btn-secondary">Add Attribute</button>
                    <small className="error-msg">{attribErr}</small>
                  </div>

                  <div className="error-msg text-center">{mainErr}</div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary mt-3">Create NFT</button>
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
