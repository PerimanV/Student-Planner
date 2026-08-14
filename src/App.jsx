import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import Calendar from './pages/Calendar';
import Courses from './pages/Courses';

const router = createBrowserRouter([
  {path:"/", element: <Dashboard />},
  {path: "/tasks", element: <Tasks />},
  {path: "*", element: <NotFound />},
  {path: "/calendar", element: <Calendar />},
  {path: "/courses", element: <Courses />}
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;