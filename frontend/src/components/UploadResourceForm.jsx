import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function UploadResourceForm() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('Title and file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('file', file); // 'file' must match backend (upload.single('file'))

    setMessage('Uploading...');
    try {
      const token = await currentUser.getIdToken();
      await axios.post('http://localhost:5001/api/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('File uploaded successfully!');
      setTitle('');
      setFile(null);
      e.target.reset(); // Clear file input
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. ' + error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload New Resource</h3>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="ppt">PPT</option>
          <option value="notes">Notes</option>
        </select>
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
}