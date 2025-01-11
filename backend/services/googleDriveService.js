const { google } = require("googleapis");
const { Readable } = require("stream");

const SCOPE = ["https://www.googleapis.com/auth/drive"];
let jwtClient;

// Function to authorize the Google API
async function authorize() {
  if (!jwtClient) {
    jwtClient = new google.auth.JWT(
      process.env.CLIENT_EMAIL, // Ensure this is set in your environment variables
      null,
      process.env.PRIVATE_KEY, // Ensure this is set in your environment variables
      SCOPE
    );
    await jwtClient.authorize();
  }
  return jwtClient;
}

// Function to get the Google Drive service
async function getDriveService() {
  if (!jwtClient) {
    throw new Error("Google Drive not initialized. Call authorize() first.");
  }
  return google.drive({ version: "v3", auth: jwtClient });
}

// Function to upload a file to Google Drive (modified to accept a file buffer)
async function uploadFileToDrive(
  fileBuffer,
  fileName,
  mimeType = "audio/mpeg"
) {
  // Default MIME type is set here
  try {
    // Authorize and get Google Drive service
    await authorize(); // Make sure we have authorized the client
    const drive = await getDriveService(); // Get the drive service

    const fileMetadata = {
      name: fileName, // File name on Google Drive
      parents: [process.env.FOLDER_ID], // Folder ID on Google Drive
      mimeType: mimeType, // MIME type (defaults to 'audio/mpeg')
    };

    // Convert the file buffer into a readable stream
    const bufferStream = Readable.from(fileBuffer);

    const media = {
      mimeType: mimeType,
      body: bufferStream, // Pass the buffer as a readable stream
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name", // The fields you need to retrieve from the response
    });

    console.log("File uploaded successfully:", response.data);
    return response.data; // Return the file data (e.g., file ID) for reference
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

module.exports = {
  authorize, // Export the authorize function
  getDriveService, // Export the getDriveService function
  uploadFileToDrive, // Export the upload function
};
