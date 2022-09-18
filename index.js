import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"
import './index.css';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import App from "./App.js"
import Base from "./views/Base.js"


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Base/>
        </Router>
    </React.StrictMode>,
  document.getElementById('root')
);