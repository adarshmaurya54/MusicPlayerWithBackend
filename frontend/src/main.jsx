import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NoSongFound from './component/NoSongFound'
import PageNotFount_404 from './component/PageNotFount_404'
import Register from './component/auth/Registration'
import Login from './component/auth/Login'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/store'
import HomePage from './component/HomePage'
import Layout from './component/Layout'
import Library from './component/UserComponents/Library'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  // Layout wraps all child routes
    children: [
      { path: '', element: <HomePage /> },  // Default route inside Layout
      { path: 'song', element: <HomePage /> },
      { path: 'library', element: <Library /> },
      { path: 'song/:songId', element: <HomePage /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'sign-up', element: <Register /> },
  { path: '/no-song-found', element: <NoSongFound /> },  // Outside Layout
  { path: '/*', element: <PageNotFount_404 /> },  // Outside Layout
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster />
  </Provider>
)
