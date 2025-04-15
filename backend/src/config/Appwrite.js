import { Client, Storage, ID } from 'node-appwrite';
import fs from 'fs';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import FormData from 'form-data';
import { config } from 'dotenv';

config();

async function uploadToAppWrite(file) {
    const form = new FormData();
    form.append('fileId', 'unique()');
    form.append('file', fs.createReadStream(file.path));
  
    try {
      const response = await fetch(
        'https://cloud.appwrite.io/v1/storage/buckets/67f638890021fd48c3ff/files',
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': '67f6371c0015995b3e0f',
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY, // truncated here for safety
            ...form.getHeaders(),
          },
          body: form,
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
  
      fs.unlinkSync(file.path); // cleanup
  
      const fileId = result.$id;
  
      return `https://cloud.appwrite.io/v1/storage/buckets/67f638890021fd48c3ff/files/${fileId}/view?project=67f6371c0015995b3e0f`;
  
    } catch (err) {
      console.error("❌ Upload Error:", err.message);
      return null;
    }
  }

export { uploadToAppWrite };