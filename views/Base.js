import React, { Component } from "react"
import { Route, Switch, Link, useRouteMatch } from "react-router-dom"
import Results from "./Results.js"
import * as backend from '../build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const stdlib = loadStdlib(process.env);

let ctc = null;
const interact = { ...stdlib.hasConsoleLogger }
const userParts = {
    'VoteCordinator':backend.VoteCordinator,
}

interact.votingReady = () => {
  console.log("Voting Ready")
}

interact.voteStatus = (vote) => {
  console.log("Last Vote",vote)
}

interact.finalVote = (firstContestant,secondContestant) => {

}

interact.getContestants = () => {
  return {}
}

interact.finalVote = (firstContestant,secondContestant) => {
  
}

interact.finalVote = (firstContestant,secondContestant) => {
  
}


class Base extends React.Component {
    //create state for Component
    constructor(){
      super();

      this.state = {
          userAccount:null,
          userAccountaddr:null,
          initialAccountBalance:0,
          ctc:null,
          contractDetailsJson:null,
          attachContractDetails:null,
          railaVotes:0,
          rutoVotes:0,
          winner:"",
          railaTotalVotes:0,
          rutoTotalVotes:0,

      }
    }

    // define helper functions
    currencyFormater = (x) => stdlib.formatCurrency(x,10) // format to 4 decimal places
    getBalance = async (userAccount) => this.currencyFormater(await stdlib.balanceOf(userAccount))
    finalBalance = async (userAccount) => {
        this.setState( {accountBalance:this.currencyFormater(await stdlib.balanceOf(userAccount))} )
    }
    parseAtomicToStandard = (atomicUnits) => atomicUnits/1000000 // function that converts atomice units to standard
    //function that get the balance of funds payed to the contract
    getBalanceContract = async (contractId) => currencyFormater(await stdlib.balanceOf(contractId))
    //function that gets address of the contract
    getContractAddress = async (contactObj) => { return contactObj.getContractAddress() }

    // create a new account
    createNewAccount = async () => {
        // let userAccount = await stdlib.getDefaultAccount();
        console.log("Added user Account",userAccount)
        let userAccount = await stdlib.newTestAccount(stdlib.parseCurrency(1000))
        this.setState({userAccount:userAccount})
        this.setState({userAccountaddr:userAccount.networkAccount.addr})    
        //now show the confirmation section
        this.setState({confirmAccount:true})
        //get user account balance
        let initialAccBal = this.parseAtomicToStandard(await userAccount.balanceOf())
        this.setState({initialAccountBalance:initialAccBal})
    }

    fundAccount = async () => {
        await stdlib.fundFromFaucet(this.state.userAccount, stdlib.parseCurrency(10));
        let newBalance = this.parseAtomicToStandard(await this.state.userAccount.balanceOf())
        this.setState({initialAccountBalance:newBalance})
    }

    initiateNewContract = async () => {
        //mark current user as contract initializer
        ctc = await this.state.userAccount.contract(backend)
        //now set state of contract as Pending
        this.setState({contractDetailsJson:"Pending"}) 
        this.setState({ctc:ctc})
    }

    attachToContract = async () => {
      // attach to the contract in the backend
      ctc = await this.state.userAccount.contract(backend,this.state.attachContractDetails);
      // call the voters API

      console.log("Ready to Vote")

      try{
        // now increment the vote here
        const [ currentVote ] = await ctc.apis.Voter.vote(1);
        console.log(`Your latest vote is ${currentVote}`)
      }catch (e) {
        console.log(`Failed to Vote`)
      } 
      //mark current user as contract initializer
      // ctc = await this.state.userAccount.contract(backend)
      // //now set state of contract as Pending
      // this.setState({contractDetailsJson:"Pending"}) 
      // this.setState({ctc:ctc})
    }

    voteRaila = (selectedCandidate) => {
      if(this.state.rutoVotes == 1){
        alert("You can only vote for one canidate.Please unselect the other ")
      }
      this.setState({railaVotes:this.state.railaVotes? 0:1})
    }

    voteRuto = (selectedCandidate) => {
      this.setState({rutoaVotes:this.state.rutoVotes? 0:1})
    }

    submitVote = async () => {
      console.log("Submitting Vote")
      // attach to the contract in the backend
      if(this.state.voteRaila == 1 && this.state.rutoVotes == 1){
        alert("You Can only vote for one candidate")
      }else{
        let userVote = this.state.voteRaila == 1 ? 1:2
        ctc = await this.state.userAccount.contract(backend,this.state.attachContractDetails);
        // call the voters API

        console.log("Ready to Vote")

        try{
          // now increment the vote here
          const [ currentVote ] = await ctc.apis.Voter.vote(userVote);
          console.log(`Your latest vote is ${currentVote}`)
        }catch (e) {
          console.log(`Failed to Vote`)
        }
      }
    }


    completeTransaction = (projectVoteValue) => {
        console.log('Complete Transaction')
        let userBackend = userParts["VoteCordinator"]
        interact.donationAmt = 10
        interact.projectVote = 1
        //pass contract and interact to current user's backend
        userBackend(ctc, interact)

        //show the contract details
        ctc.getInfo().then((contractDetails) => {
            console.log(JSON.stringify(contractDetails))
            this.setState({contractDetailsJson:contractDetails._hex});
        })
    }

    // render the DOM here
    render() {
        return (
          <div >
            <h1>Decentralized Voting System</h1>
            <hr/>
            <h3>Vote Cordinator Section</h3>
            <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
              Create New Account
            </button><br/><br/>

            <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                Fund Account
            </button><br/><br/>

            <button id="initiateNewContract" onClick={this.initiateNewContract} type="button" className="btn btn-primary">
                Initiate Contract
            </button><br/><br/>

            <button id="completeTransaction" onClick={this.completeTransaction} type="button" className="btn btn-primary">
                Show Contract Info
            </button><br/><br/>
            
            <hr/>
            <h3>Voter Section</h3>
            <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
              Create New Account
            </button> <br/><br/>

            <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                Fund Account
            </button><br/><br/>

            <input
              type='text'
              placeholder='Enter contract'
              onChange={(e) => this.setState({attachContractDetails: e.currentTarget.value})}
            /><br/><br/>

            {/* <button id="initiateNewContract" onClick={this.attachToContract} type="button" className="btn btn-primary">
                Attach to Contract
            </button><br/><br/> */}

            <label > Vote for Raila Odinga</label>
            <input type="checkbox" name="raila" onClick={this.voteRaila}/><br/><br/>
            <label > Vote for William Ruto</label>
            <input type="checkbox" name="ruto" onClick={this.voteRuto}/><br/><br/>

            <button id="submitVote" onClick={this.submitVote} type="button" className="btn btn-primary">
                Submit
            </button><br></br>

            <hr/>
            <h3>Results Section</h3>
            <label > Raila Odinga Total Votes</label>
            <input type="text" value={this.state.railaTotalVotes}/><br/><br/>
            <label > William Ruto Total Votes</label>
            <input type="text" value={this.state.rutoTotalVotes}/><br/><br/>
            <label > Winner</label>
            <input type="text" value={this.state.winner} /><br/><br/>

          </div>
        )
    }
}

// now export the created Component
export default Base