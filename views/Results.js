import React, { Component } from "react"
import { withRouter } from 'react-router-dom';
// import axios from 'axios';

// import styles
// import styles from "./commonStyles.module.css"
// import urlDetailStyles from "./urlDetails.module.css"


class Results extends React.Component {

    // define root component state here
    state = {
      url:"N/A",
      short_url:"N/A",
      short_code:"N/A",
      url_details:"N/A"
    }

    componentDidMount() {
        console.log("Component mounted successfully!")
    }

    // render the root div
    render() {
      return (
          <div >
            <h1>Results Page</h1>
          </div>
      )
    }
}

// now export the created Component
export default withRouter(Results)