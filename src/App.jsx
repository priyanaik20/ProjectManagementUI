import MainLayout from "./layouts/MainLayout";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NewProject from "./pages/project/NewProject";
import EditProject from "./pages/project/EditProject";
import ViewProject from "./pages/project/ViewProject";
import ViewTask from "./pages/tasks/ViewTask";
import { Routes, Route } from "react-router-dom";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-projects" element={<ViewProject />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/edit-project/:id" element={<EditProject />} />
        <Route path="/view-tasks" element={<ViewTask />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
      </Route>
    </Routes>
  );
}

export default App;
