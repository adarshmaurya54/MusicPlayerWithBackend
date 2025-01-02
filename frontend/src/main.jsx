import ReactDOM from 'react-dom/client'
import Layout from './component/Layout'
import NotFoundPage from './component/NotFoundPage'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SongList from './component/SongList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '*',
    element: <NotFoundPage /> // 404 page route outside of Layout
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
