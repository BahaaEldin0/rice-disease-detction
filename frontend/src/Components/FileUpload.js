import React, { useState } from 'react';
import axios from 'axios';
import { Input, Grid, Image } from '@nextui-org/react';


function DragDropFile() {
    return (
      <form id="form-file-upload">
        <input type="file" id="input-file-upload" multiple={true} />
        <label id="label-file-upload" htmlFor="input-file-upload">
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button">Upload a file</button>
          </div> 
        </label>
      </form>
    );
  };


function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [url, setUrl] = useState(null);
  const [label, setLabel] = useState(null);
  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to hold the selected file
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Send a POST request to the upload route on our Node.js API server
    try {
      const response = await axios.post('http://localhost:8006/upload_classify', formData)
      .then(res => {
        // console.log(res);
        // console.log(res.data.data.publicUrl);
        // setUrl(res.data.data.publicUrl);
        setIsUploaded(true);
        setLabel(res.data);
        console.log(res.data);
        })
    
    //   console.log('File uploaded:', response.data);
      setIsUploaded(true);
      setUrl(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileInputChange} />
        <button type="submit" disabled={!selectedFile}>Upload</button>
      </form>
      <p>Predicted Class is {label}</p>
      {isUploaded && <Image src={selectedFile} width={700} height={700} />}
    </div>

  );
}

export default FileUpload;