import React, { Component } from "react"
import { withRouter } from 'react-router-dom';

// import styles
// import styles from "./commonStyles.module.css"
// import urlDetailStyles from "./urlDetails.module.css"

import raila from '../assets/raila.jpg';
import ruto from '../assets/ruto.jpeg'


class Results extends React.Component {

    // define root component state here
    state = {}
    componentDidMount() {}

    // render the root div
    render() {
      return (
        <div>
            {/* add loader div */}
            <div className={this.props.deploying ? "showClass":"hideClass"}>
                <div className="loader"></div>
            </div>
            <div className={this.props.displayClass}>
            <h3>Results </h3>
            {/* <div className="input-group mb-3 inputLenght">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Contract</span>
                </div>
                <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                value = {this.props.contractDetailsJson}/>
            </div> */}
            <div className="row">
                {/* <div className="col-md-6">

                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Raila Odinga</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.railaTotalVotes}/>
                </div>

                </div> */}


                <div className="col-md-3">
                <img src={raila} alt="Raila" width="300" height="200"/>
                </div>
                <div className="col-md-3">
                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Candidate</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = "William Ruto"/>
                </div>

                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Votes</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.railaTotalVotes}/>
                </div>

                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Percentage %</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {(this.props.railaTotalVotes/this.props.totalVotes * 100).toFixed(2)}/>
                </div>
                </div>

                <div className="col-md-3">
                <img src={ruto} alt="Nature" width="300" height="200"/>
                </div>
                <div className="col-md-3">
                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Candidate</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = "William Ruto"/>
                </div>

                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Votes</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.rutoTotalVotes}/>
                </div>

                <div className="input-group mb-3 inputLenght">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Percentage %</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {(this.props.rutoTotalVotes/this.props.totalVotes * 100).toFixed(2)}/>
                </div>

                </div>


            </div>
            <br/>
            
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Voting Contract</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.contractDetailsJson}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Total Votes</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.totalVotes}/>
                </div>
            
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Winner</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    value = {this.props.winner}/>
                </div>
                </div>
                <div className="col-md-2"></div>
            </div>
            </div>
        </div>
      )
    }
}

// now export the created Component
export default withRouter(Results)