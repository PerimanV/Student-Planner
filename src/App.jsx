import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import Calendar from './pages/Calendar';
import Courses from './pages/Courses';
import Notes from './pages/Notes';

const router = createBrowserRouter([
  {path:"/", element: <Dashboard />},
  {path: "*", element: <NotFound />},
  {path: "/tasks", element: <Tasks />},
  {path: "/calendar", element: <Calendar />},
  {path: "/courses", element: <Courses />},
  {path: "/notes", element: <Notes />}
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;