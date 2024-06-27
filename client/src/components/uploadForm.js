import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [files, setFiles] = useState({ file1: null, file2: null });
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles((prevFiles) => ({
            ...prevFiles,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('videos', files.file1);
        formData.append('videos', files.file2);

        try {
            const response = await axios.post('http://localhost:4000/merge', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'  // This is important for handling the video download
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
        } catch (error) {
            console.error('Error merging videos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Merge Videos</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Video 1:</label>
                    <input type="file" name="file1" accept="video/*" onChange={handleFileChange} required />
                </div>
                <div>
                    <label>Video 2:</label>
                    <input type="file" name="file2" accept="video/*" onChange={handleFileChange} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Merging...' : 'Merge Videos'}
                </button>
            </form>
            {downloadUrl && (
                <div>
                    <h2>Merged Video</h2>
                    <a href={downloadUrl} download="merged_video.mp4">Download</a>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
