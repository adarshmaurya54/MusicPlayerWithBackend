import ReactDOM from 'react-dom/client'
import Layout from './component/Layout'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './component/Login'
import NoSongFound from './component/NoSongFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/:songId',  // New route with songId
    element: <Layout />,
  },
  {
    path: '/no-song-found',
    element: <NoSongFound /> // 404 page route outside of Layout
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
