import MainLayout from "./layouts/MainLayout";
import Login from "./pages/login/Login";
import NewProject from "./pages/project/NewProject";
import EditProject from "./pages/project/EditProject";
import ViewProject from "./pages/project/ViewProject";
import TaskForm from "./pages/TaskForm";
import { Routes, Route } from "react-router-dom";

function App() {
  return(
    <Routes>
      <Route path ="/" element ={<Login/>}/>
      <Route path ="/login" element ={<Login/>}/>
      <Route element={<MainLayout/>}>
        <Route path= "/view-projects" element = {<ViewProject/>} />
        <Route path= "/new-project" element = {<NewProject/>} />
        <Route path= "/edit-project/:id" element = {<EditProject/>} />
        <Route path= "/create-task" element = {<TaskForm/>} />
      </Route>
    </Routes>
  )
}

export default App;