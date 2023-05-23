const tf = require('@tensorflow/tfjs-node');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const sharp = require('sharp');
global.fetch = require('node-fetch');
const fs = require('fs');

const SUPABASE_URL = 'https://qiregxmulzfbgvzyzhby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmVneG11bHpmYmd2enl6aGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDYxODMzMCwiZXhwIjoyMDAwMTk0MzMwfQ._8jVAqs-kDDpOVRHJjYAWv1vOj5EQ6-59BGE71RQ_EY';
const bucketName = 'ais';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



async function uploadFileToSupabaseStorage(file) {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop();
  const fileId = uuidv4();
  let newFileName = `${fileId}.${fileExtension}`;
  
  // Check if the file already exists in storage
  const { data: existingFiles, error } = await supabase
    .storage
    .from('your-storage-bucket-name')
    .list('');
  
  if (existingFiles) {
    const existingFile = existingFiles.find(f => f.name === fileName);
    if (existingFile) {
      // Rename the file
      const existingFileId = existingFile.name.split('.').shift();
      newFileName = `${existingFileId}_${fileId}.${fileExtension}`;
    }
  }
  
  // Upload the file to storage
  const {data: uploadedFile, error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(newFileName, file.data,{
        contentDisposition: 'inline',
        contentType: 'image/png',});

  if (uploadError) {
    console.error(uploadError);
    return null;
  }
  console.log(supabase.storage.from(bucketName).getPublicUrl(newFileName).data.publicUrl);
  // Return the URL of the uploaded file
  return supabase
    .storage
    .from(bucketName)
    .getPublicUrl(newFileName);
}


async function classifyImageFromUrl(imageUrl) {
    // Load the model and labels
    //const model = await tf.loadLayersModel('file://I:/Plant Disease Detection/backend/modelBin/model.json');
    

    //const image = sharp(imageUrl);
    //const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
// Remove the alpha channel and convert to RGB
    // const buffer = await image
    // .flatten({ background: { r: 255, g: 255, b: 255 } })
    // .jpeg()
    // .toBuffer();
    //const imageTensor = tf.node.decodeImage(new Uint8Array(image.data), 3);
    // Preprocess the image
    // const buffer = await fetch(imageUrl).then(response => response.arrayBuffer());
    // const imageTensor = tf.node.decodeImage(new Uint8Array(buffer));
    //const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    //const normalizedImage = resizedImage.div(255);
    
    //const output = model.predict(normalizedImage);
    const model = await tf.loadLayersModel('file://I:/Plant Disease Detection/backend/modelBin/model.json');
    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageTensor = tf.node.decodeImage(new Uint8Array(image.data), 3);
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const expandedImage = resizedImage.expandDims(0); // Add a new dimension to the tensor
    const normalizedImage = expandedImage.div(255);
    const output = model.predict(normalizedImage);
    const labelMapping = {
        0: 'blast',
        1: 'brown',
        2: 'healthy'
      };
      
    const predictedClassIndex = output.argMax(axis=1).dataSync()[0];
    const predictedLabel = labelMapping[predictedClassIndex];
    console.log(`Predicted label: ${predictedLabel}`);
    const probabilities = output.dataSync();
    for (let i = 0; i < probabilities.length; i++) {
        const label = labelMapping[i];
        const probability = probabilities[i];
        console.log(`${label}: ${probability}`);
    }
    // Classify the image
    // const predictions = model.predict(normalizedImage.reshape([1, 224, 224, 3]));
    // const predictionValues = predictions.arraySync()[0];
    // const maxPredictionIndex = predictionValues.indexOf(Math.max(...predictionValues));
    // const predictionLabel = labels[maxPredictionIndex];
  
    // Return the prediction label
    return predictedLabel;
  }
  


// async function classifyImageFromUrl(imageUrl) {
//     // Load the model and labels
//     const modelPath = 'I:/Plant Disease Detection/backend/modelBin';
//     if (fs.existsSync(modelPath)) {
//         // Load the model
//           const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
//           console.log('Model loaded successfully');
//         } else {
//           console.log(`Error: Model not found at ${modelPath}`);
//         }
//   }
  



  async function uploadAndClassifyImage(file) {
    try {
      // Upload the file and get its public URL
      let label = null;
      const url = await uploadFileToSupabaseStorage(file)
      .then(async function(res){
        console.log(res);
        label = await classifyImageFromUrl(res.data.publicUrl).then(function(label){
            console.log(label);
            return label;
        });
        
        });

        console.log("hello");
      
      // Classify the image from the URL
      //const label = await classifyImageFromUrl(url);
  
      // Return the predicted label
      return label;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


module.exports = { uploadFileToSupabaseStorage, classifyImageFromUrl, uploadAndClassifyImage};

