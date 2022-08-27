import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"
import './index.css';

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