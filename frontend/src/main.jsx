import ReactDOM from 'react-dom/client'
import Layout from './component/Layout'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLogin from './component/auth/AdminLogin'
import NoSongFound from './component/NoSongFound'
import PageNotFount_404 from './component/PageNotFount_404'
import Register from './component/auth/Registration'
import Login from './component/auth/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <Register />,
  },
  {
    path: '/song',  // New route with songId
    element: <Layout />,
  },
  {
    path: '/song/:songId',  // New route with songId
    element: <Layout />,
  },
  {
    path: '/no-song-found',
    element: <NoSongFound /> // 404 page route outside of Layout
  },
  {
    path: '/*',
    element: <PageNotFount_404 /> // 404 page route outside of Layout
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
