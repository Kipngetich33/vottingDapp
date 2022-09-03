import React, { Component } from "react"
import styles from "./Footer.module.css"


class Footer extends React.Component {
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
                    <p>Kipngetich Ngeno @2022</p>
                </nav>
            </div>
        )
    }
}

// now export the created Component
export default Footer