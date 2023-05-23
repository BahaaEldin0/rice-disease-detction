const express = require('express');
const fileUpload = require('express-fileupload');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const { uploadFileToSupabaseStorage, uploadAndClassifyImage, classifyImageFromUrl } = require('./functions.js');

// Replace the placeholders below with your actual Supabase credentials and bucket name
const supabaseUrl = 'https://qiregxmulzfbgvzyzhby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmVneG11bHpmYmd2enl6aGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDYxODMzMCwiZXhwIjoyMDAwMTk0MzMwfQ._8jVAqs-kDDpOVRHJjYAWv1vOj5EQ6-59BGE71RQ_EY';
const bucketName = 'ais';
const PORT = 8006;
// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create an Express app
const app = express();

// Enable parsing of JSON in the request body
app.use(express.json());

// Enable file uploads
app.use(fileUpload());

// Enable cors
app.use(cors());
// Define a route to handle file uploads
app.post('/upload2', async (req, res) => {
  // Check if a file was uploaded
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file was uploaded');
  }

  // Get the uploaded file
  const file = req.files.file;

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage.from(bucketName).upload(file.name, file.data)
  .then(res => {
    console.log(data);
    console.log(data);
    })


 // Handle any errors that occurred during the upload
  if (error) {
    console.error(error);
    return res.status(500).send('Error uploading file');
  }
  console.log(data);
  // Return the URL of the uploaded file
  return res.send(data.url);
});

app.post('/upload', async (req, res) => {
    // Check if a file was uploaded

    if (!req.files || !req.files.file) {
        return res.status(400).send('No file was uploaded');
    }
    const file = req.files.file;

    const fileUrl = await uploadFileToSupabaseStorage(file);
    console.log('File URL:', fileUrl);
    // Get the uploaded file
    return res.send(fileUrl);

});

app.post('/upload_classify', async (req, res) => {
    // Check if a file was uploaded
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file was uploaded');
    }
    const file = req.files.file;
    const label = await uploadAndClassifyImage(file);
    console.log('Label:', label);
    // Get the uploaded file
    return res.send(label);
});

// Start the server
app.listen(PORT, () => {
  console.log('Server started on port '+ PORT);
});
