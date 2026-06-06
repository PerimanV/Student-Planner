import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import Calendar from './pages/Calendar';

const router = createBrowserRouter([
  {path:"/", element: <Dashboard />},
  {path: "/tasks", element: <Tasks />},
  {path: "*", element: <NotFound />},
  {path: "/calendar", element: <Calendar />}
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;