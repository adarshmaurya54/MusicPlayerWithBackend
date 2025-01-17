const { google } = require("googleapis");
const { Readable } = require("stream");

const SCOPE = ["https://www.googleapis.com/auth/drive"];
let jwtClient = null;

// Function to authorize the Google API
async function authorize() {
  if (!jwtClient) {
    console.time("JWT Client Initialization");
    jwtClient = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle multi-line keys
      SCOPE
    );
    await jwtClient.authorize();
    console.timeEnd("JWT Client Initialization");
  }
  return jwtClient;
}

// Function to get the Google Drive service
function getDriveService() {
  if (!jwtClient) {
    throw new Error("Google Drive not initialized. Call authorize() first.");
  }
  return google.drive({ version: "v3", auth: jwtClient });
}

// Function to upload a file to Google Drive (optimized for reuse)
async function uploadFileToDrive(fileBuffer, fileName, mimeType = "audio/mpeg") {
  try {
    // Ensure the client is authorized
    await authorize();
    const drive = getDriveService();

    const fileMetadata = {
      name: fileName,
      parents: [process.env.FOLDER_ID], // Ensure FOLDER_ID is set in env
    };

    const media = {
      mimeType,
      body: Readable.from(fileBuffer), // Stream file buffer
    };

    // Upload the file to Google Drive
    console.time("File Upload");
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name", // Retrieve file ID and name
    });
    console.timeEnd("File Upload");

    console.log("File uploaded successfully:", response.data);
    return response.data; // Return file data (e.g., file ID)
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
}

// Export functions
module.exports = {
  authorize,
  getDriveService,
  uploadFileToDrive,
};
