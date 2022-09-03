import React, { Component } from "react"
import { Route, Switch, Link, useRouteMatch } from "react-router-dom"
import Results from "./Results.js"
import * as backend from '../build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import MyAlgoConnect from '@randlabs/myalgo-connect';

// import components
import Navbar from "./Navbar.js"
import Footer from "./Footer.js"


const stdlib = loadStdlib(process.env);

// stdlib.setWalletFallback(stdlib.walletFallback({
//   providerEnv: 'TestNet', MyAlgoConnect })); 

let ctc = null;
const userParts = {
    'VoteCordinator':backend.VoteCordinator,
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
          votingReady:false,
          attachContractDetails:null,
          railaVotes:0,
          rutoVotes:0,
          winner:"",
          railaTotalVotes:0,
          rutoTotalVotes:0,
          roleDiv:"showClass",
          voteCordinatorDiv:"hideClass",
          voterDiv:"hideClass",
          resultsDiv:"hideClass",
          interact: { ...stdlib.hasConsoleLogger,
            votingReady: () => {
              alert("Voting launched successfully!")
              this.setState({
                votingReady:true
              })
            },
            donationAmt:0,
            projectVote:0,

            voteStatus : (vote) => {
              const latestVote = parseInt(vote._hex, 16);
              if(latestVote == 1){
                this.setState({
                  railaTotalVotes: this.state.railaTotalVotes + 1
                })
              }else if(latestVote == 2){
                this.setState({
                  rutoTotalVotes: this.state.rutoTotalVotes += 1
                })
              }
            },

            finalVote : (firstContestant,secondContestant) => {
              if(firstContestant == secondContestant){
                this.setState({
                  winner:"Draw"
                })
                alert("No winner was found election ended in a Draw.")
              }else if (firstContestant > secondContestant){
                this.setState({
                  winner:"Raila Odinga"
                })
                alert("Your winner is: Raila Odinga")
              }else if (firstContestant > secondContestant){
                this.setState({
                  winner:"William Ruto"
                })
                alert("Your winner is: William Ruto")
              }
            },

            getContestants : () => {
              return {}
            },

            sendLogs: (step) => {
              console.log("Current Step:",step)
            }
          }

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
        let userAccount = await stdlib.newTestAccount(stdlib.parseCurrency(1000))
        this.setState({userAccount:userAccount})
        this.setState({userAccountaddr : userAccount.networkAccount.addr})    
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

        let userBackend = userParts["VoteCordinator"]

        //pass contract and interact to current user's backend
        userBackend(ctc, this.state.interact)

        //show the contract details
        ctc.getInfo().then((contractDetails) => {
            console.log(contractDetails._hex)
            let contractString = JSON.stringify(contractDetails).substring(1, contractDetails.length - 1);
            this.setState({contractDetailsJson:contractDetails._hex});
        })
    }

    attachToContract = async () => {
      // attach to the contract in the backend
      ctc = await this.state.userAccount.contract(backend,this.state.attachContractDetails);
      // call the voters API
      try{
        // now increment the vote here
        const [ currentVote ] = await ctc.apis.Voter.vote(1);
      }catch (e) {
        console.log(`Failed to Vote`)
      } 
    }

    voteRaila = (selectedCandidate) => {
      if(this.state.rutoVotes == 1){
        alert("You can only vote for one canidate.Please unselect the other ")
      }
      this.setState({railaVotes:this.state.railaVotes? 0:1})
    }

    voteRuto = (selectedCandidate) => {
      this.setState({rutoVotes:this.state.rutoVotes? 0:1})
    }

    submitVote = async () => {
      // attach to the contract in the backend
      if(this.state.railaVotes == 0 && this.state.rutoVotes == 0){
        alert('You have not voted for any candidate.')
      }
      else if(this.state.railaVotes == 1 && this.state.rutoVotes == 1){
        alert("You Can only vote for one candidate")
      }else{
        let userVote = this.state.railaVotes == 1 ? 1:2
        ctc = await this.state.userAccount.contract(backend,this.state.attachContractDetails);
        // call the voters API
        try{
          // now increment the vote here
          const [ currentVote ] = await ctc.apis.Voter.vote(userVote);
          if(currentVote == 1){
            alert("You successfully voted for Raila Odinga")
          }else{
            alert("You successfully voted for William Ruto")
          }
        }catch (e) {
          alert("Sorry the voting period has elapsed!")
        }
      }
    }

    completeTransaction = (projectVoteValue) => {
        
    }

    voteCordinatorRole = () => {
      this.setState({
        voteCordinatorDiv:"showClass",
        roleDiv:"hideClass",
        resultsDiv:"showClass",
      })
    }

    voterRole = () => {
      this.setState({
        voterDiv:"showClass",
        roleDiv:"hideClass",
      })
    }

    // render the DOM here
    render() {
        return (
          <div >
            <Navbar/>
            <div className={this.state.roleDiv} >
              <h3>Select a role</h3>
              <button  onClick={this.voteCordinatorRole} type="button" className="btn btn-primary">
                  Vote Cordinator
              </button><br/><br/>

              <button onClick={this.voterRole} type="button" className="btn btn-primary">
                  Voter
              </button><br/><br/>
            </div>
            <div className="mainDiv">
              <div className={this.state.voteCordinatorDiv}>
                <h3>Vote Cordinator Section</h3>
                <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
                  Connect Account    
                </button>
                &nbsp;&nbsp;&nbsp;
                <input
                  type='text'
                  value={this.state.userAccountaddr}
                /><br/><br/>
              
                <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                    Fund Account
                </button>
                &nbsp;&nbsp;&nbsp;
                <input
                  type='text'
                  value={this.state.initialAccountBalance}
                />
                <br/><br/>

                <button id="initiateNewContract" onClick={this.initiateNewContract} type="button" className="btn btn-primary">
                    Deploy Contract
                </button>
                &nbsp;&nbsp;&nbsp;
                <input
                  type='text'
                  value={this.state.contractDetailsJson}
                /><br/><br/>
              </div>
              
              <div className={this.state.voterDiv}>
                <h3>Voter Section</h3>
                <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
                  Connect Account  
                </button>
                &nbsp;&nbsp;&nbsp;
                <input
                  type='text'
                  value={this.state.userAccountaddr}
                /><br/><br/>

                <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                    Fund Account
                </button>
                &nbsp;&nbsp;&nbsp;
                <input
                  type='text'
                  value={this.state.initialAccountBalance}
                />
                <br/><br/>

                <h4>Select your preffered President </h4>
                <label > Vote for Raila Odinga</label>
                <input type="checkbox" name="raila" onClick={this.voteRaila}/><br/><br/>
                <label > Vote for William Ruto</label>
                <input type="checkbox" name="ruto" onClick={this.voteRuto}/><br/><br/>

                <input
                  type='text'
                  placeholder='Enter contract'
                  onChange={(e) => this.setState({attachContractDetails: e.currentTarget.value})}
                /> &nbsp;&nbsp;&nbsp;
                <button id="submitVote" onClick={this.submitVote} type="button" className="btn btn-primary">
                    Submit Vote
                </button><br></br>
              </div>

              
              <div className={this.state.resultsDiv}>
                <hr/>
                <h3>Results Section </h3>
                <label > Raila Odinga Total Votes</label>
                <input type="text" value={this.state.railaTotalVotes}/><br/><br/>
                <label > William Ruto Total Votes</label>
                <input type="text" value={this.state.rutoTotalVotes}/><br/><br/>
                <label > Winner</label>
                <input type="text" value={this.state.winner} /><br/><br/>
              </div>
            </div>
            <Footer/>

          </div>
        )
    }
}

// now export the created Component
export default Base