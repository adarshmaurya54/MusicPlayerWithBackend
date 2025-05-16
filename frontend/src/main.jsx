import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NoSongFound from './component/NoSongFound'
import PageNotFount_404 from './component/PageNotFount_404'
import Register from './pages/AuthPages/Registration'
import Login from './pages/AuthPages/Login'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/store'
import HomePage from './pages/HomePage'
import Layout from './component/Layout'
import Library from './pages/UserPages/Library'
import Playlists from './pages/UserPages/Playlists'
import PlaylistDetails from './component/UserComponents/PlaylistDetails'
import LikedSongs from './pages/UserPages/LikedSongs'
import PublicPlaylist from './component/UserComponents/PublicPlaylist'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout wraps all child routes
    children: [
      { path: '', element: <HomePage /> }, // Default route inside Layout
      { path: 'song', element: <HomePage /> },
      { path: 'users', element: <HomePage /> },
      {
        path: 'library',
        element: <Library />,
        children: [
          { path: '', element: <LikedSongs /> }, // Corrected path
          { path: 'playlists', element: <Playlists /> }, // Corrected path
          { path: 'playlists/:id', element: <PlaylistDetails /> }, // Corrected path
        ],
      },
      { path: 'playlist/:id', element: <PublicPlaylist /> },
      { path: 'song/:songId', element: <HomePage /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'sign-up', element: <Register /> },
  { path: '/no-song-found', element: <NoSongFound /> }, // Outside Layout
  { path: '/*', element: <PageNotFount_404 /> }, // Catch-all route
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster />
  </Provider>
)
