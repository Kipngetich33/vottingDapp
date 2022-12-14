import React, { Component } from "react"
import styles from "./Navbar.module.css"


class Navbar extends React.Component {
    //create state for Component
    constructor(){
      super();

      this.state = {
      }

    }

    // render the DOM here
    render() {
        return (
            <div className = {styles.centerAlign} >
                <nav className = {styles.footerNav}>
                   <h1>Decentralized Voting System</h1>
                </nav>
            </div>
        )
    }
}

// now export the created Component
export default Navbar