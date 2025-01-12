# 🎵 Music Player Website 🎶

A modern music player website with seamless audio playback, Google Drive integration for audio file storage, and a clean, user-friendly interface.

## 🚀 Features

- **Audio Playback**: Play music with essential controls (play, pause, skip, etc.).
- **Google Drive Integration**: Upload audio files to Google Drive and fetch them for playback.
- **Dynamic Song Management**: Add, update, and delete songs with metadata (name, artist, lyrics).
- **Responsive UI**: Optimized for desktop and mobile devices.
- **MERN Stack**: Backend powered by Node.js and Express.js with MongoDB for data storage.

---

## 🛠️ Technologies Used

### Frontend:
- **React.js**: For building the dynamic user interface.
- **HTML5 & CSS3**: For layout and styling.
- **Bootstrap/Tailwind CSS**: (Optional: Replace based on your choice for styling components).

### Backend:
- **Node.js**: Runtime for backend logic.
- **Express.js**: Framework for creating API routes.
- **MongoDB**: Database to store song details and metadata.

### Additional Services:
- **Google Drive API**: To store and fetch audio files directly from Google Drive.
- **Multer**: For handling file uploads.
- **JWT Authentication**: For secure access control.

---

## ⚙️ Installation & Setup

### Prerequisites:
- [Node.js](https://nodejs.org/) and npm installed.
- MongoDB instance running locally or on a cloud service (e.g., MongoDB Atlas).
- Google API credentials (Client Email and Private Key) with access to the Drive API.

### Steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/music-player-website.git
   cd music-player-website
Backend Setup:

Navigate to the backend folder.

Install dependencies:

bash
Copy code
npm install
Create a .env file with the following variables:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_EMAIL=your_google_client_email
PRIVATE_KEY=your_google_private_key
FOLDER_ID=your_google_drive_folder_id
JWT_SECRET=your_jwt_secret
Start the backend server:

bash
Copy code
npm start
Frontend Setup:

Navigate to the frontend folder.
Install dependencies:
bash
Copy code
npm install
Start the React development server:
bash
Copy code
npm start
Run the App:

Open your browser and visit:
arduino
Copy code
http://localhost:3000
📂 Project Structure
bash
Copy code
MusicPlayerWebsite/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── server.js
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── README.md
└── ...
🎨 Screenshots
1. Homepage:

2. Music Player UI:

3. File Upload Interface:

🛡️ Security Features
JWT Authentication: Ensures secure API access.
Google Drive File Upload: Protects uploaded files with limited access permissions.
Environment Variables: All sensitive data (API keys, DB URIs) stored securely.
🚀 Future Enhancements
Playlist Management: Allow users to create and manage playlists.
Search Functionality: Add real-time search for songs by name or artist.
AI Recommendations: Suggest songs based on user preferences.
Live Streaming: Add support for live audio streaming.
🧑‍💻 Contributing
Contributions are welcome! Feel free to fork the project and submit pull requests.

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature/your-feature-name
Commit your changes:
bash
Copy code
git commit -m "Add your message"
Push to the branch:
bash
Copy code
git push origin feature/your-feature-name
Open a pull request.
📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

✨ Acknowledgments
Google APIs for providing robust cloud solutions.
MERN Stack for powering the project.
Inspiration and support from the open-source community.
