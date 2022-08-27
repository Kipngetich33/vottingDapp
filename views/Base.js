import React, { Component } from "react"
import { Route, Switch, Link, useRouteMatch } from "react-router-dom"
import Results from "./Results.js"
import * as backend from '../build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);

// import child components
// import Header from "./Header.js"

// import styles
// import styles from "./Base.module.css"


class Base extends React.Component {
    // render the root div
    state = {
    }

    async componentDidMount() {
      const acc = await reach.getDefaultAccount();
      console.log(acc)
      console.log("Base Component mounted successfully!")

    }

    render() {
        return (
          <div >
            <div>
              <h1>Header Section</h1>
            </div>
            <Switch>
                <Route exact path="/">
                    <Results />
                </Route>
            </Switch> 
            <div>
              <h1>Footer Section</h1>
            </div>
          </div>
        )
    }
}

// now export the created Component
export default Base