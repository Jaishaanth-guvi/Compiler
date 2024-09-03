import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import TaskManager from "./component/Taskmanager";
import CreatePage from "./component/Create";
import NewTaskPage from "./component/Newtask";
import EditPage from "./component/Edit";
import TestPage from "./component/Test";

export default function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<TaskManager />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/new-task" element={<NewTaskPage />} />
            <Route path="/TestPage/:id" element={<TestPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
