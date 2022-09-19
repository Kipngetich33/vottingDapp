import React, { Component } from "react"
import { Route, Switch, Link, useRouteMatch } from "react-router-dom"
import * as backend from '../build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import MyAlgoConnect from '@randlabs/myalgo-connect';

// import components
import Navbar from "./Navbar.js"
import Footer from "./Footer.js"
import Results from "./Results.js"

// import images
import raila from '../assets/raila.jpg';
import ruto from '../assets/ruto.jpeg'
import ballot from '../assets/background.jpg'


const stdlib = loadStdlib(process.env);

stdlib.setWalletFallback(stdlib.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect })); 

let ctc = null;
const userParts = {
    'VoteCordinator':backend.VoteCordinator,
}

class Base extends React.Component {
    //create state for Component
    // add comment here
    constructor(){
      super();

      this.state = {
          userAccount:null,
          userAccountaddr:null,
          initialAccountBalance:0,
          ctc:null,
          contractDetailsJson:null,
          votingReady:false,
          deploying:false,
          voting:false,
          attachContractDetails:null,
          railaVotes:0,
          rutoVotes:0,
          winner:"",
          railaTotalVotes:0,
          rutoTotalVotes:0,
          userRole:null,
          roleDiv:"showClass",
          voteCordinatorDiv:"hideClass",
          voterDiv:"hideClass",
          resultsDiv:"hideClass",
          loading:false,
          interact: { ...stdlib.hasConsoleLogger,
            votingReady: () => {
              alert("Voting launched successfully!")
              this.setState({
                votingReady:true,
                deploying:false
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
    // getBalanceContract = async (contractId) => currencyForm{}ater(await stdlib.balanceOf(contractId))
    //function that gets address of the contract
    getContractAddress = async (contactObj) => { return contactObj.getContractAddress() }

    // create a new account
    createNewAccount = async () => {
        // set loading as true
        this.setState({
          loading:true
        })
        let userAccount = await stdlib.getDefaultAccount();
        // let userAccount = await stdlib.newTestAccount(stdlib.parseCurrency(1000))
        this.setState({userAccount:userAccount})
        this.setState({userAccountaddr : userAccount.networkAccount.addr})    
        //now show the confirmation section
        this.setState({confirmAccount:true})
        //get user account balance
        let initialAccBal = this.parseAtomicToStandard(await userAccount.balanceOf())
        this.setState({initialAccountBalance:initialAccBal})

        // remove loader
        this.setState({
          loading:false
        })
    }

    fundAccount = async () => {
        await stdlib.fundFromFaucet(this.state.userAccount, stdlib.parseCurrency(10));
        let newBalance = this.parseAtomicToStandard(await this.state.userAccount.balanceOf())
        this.setState({initialAccountBalance:newBalance})
    }

    initiateNewContract = async () => {

        // set loading as true
        this.setState({
          deploying:true
        })

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
      console.log("vote for Ruto")
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
        // show loader
        this.setState({
          voting:true
        })

        let userVote = this.state.railaVotes == 1 ? 1:2
        ctc = await this.state.userAccount.contract(backend,this.state.attachContractDetails);
        // call the voters API
        try{
          // now increment the vote here
          const [ currentVote ] = await ctc.apis.Voter.vote(userVote);
          if(currentVote == 1){
            // show loader
            this.setState({
              voting:false
            })
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
        userRole:"Vote Cordinator"
      })
    }

    voterRole = () => {
      this.setState({
        voterDiv:"showClass",
        roleDiv:"hideClass",
        userRole:"Voter"
      })
    }

    // render the DOM here
    render() {
        return (
          <div class="mainBody" >
            {/* add navigation section here */}
            <Navbar/>
            <div >
              {/* add the body section here */}
              <div className="contentBody">
                
                {/* this is the main body */}
                <div className="mainDiv container">

                  {/* add the role selection section here */}
                  <div className={this.state.roleDiv} >
                    {/* <h3>You are a</h3> */}
                    <img src={ballot} alt="backgroundpic" className="backPic" /><br/>
                    <button  onClick={this.voteCordinatorRole} type="button" className="btn btn-primary">
                        Vote Cordinator
                    </button>
                    &nbsp; &nbsp; &nbsp; 
                    <button onClick={this.voterRole} type="button" className="btn btn-primary">
                        Voter
                    </button>
                  </div>

                  <div className={this.state.userRole == "Vote Cordinator" && this.state.contractDetailsJson == null ? "showClass":"hideClass"}>
                    {/* <h3>Initialize Voting Contract</h3> */}
                    <img src={ballot} alt="backgroundpic" className="backPic" /><br/>

                    {/* add loader div */}
                    <div className={this.state.loading ? "showClass":"hideClass"}>
                      <div className="loader"></div>
                    </div>

                    <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
                      Connect Account    
                    </button>
                    &nbsp;
                    <input
                      type='text'
                      value={this.state.userAccountaddr}
                    /><br/><br/>
                  
                    <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                        Account Balance
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
                  
                  <div className={this.state.userRole == "Voter" && this.state.contractDetailsJson == null ? "showClass":"hideClass"}>
                    {/* <h3>Vote</h3> */}
                    {/* <img src={ballot} alt="backgroundpic" className="backPic" /><br/> */}
                    <h4>Select your preffered President </h4>

                    <div className="row">
                      <div className="col-md-3"></div>
                      <div className="col-md-3">
                        <div class="card votingCard" >
                          <img src={raila} class="card-img-top" alt="raila"/>
                          <div class="card-body">
                            <h5 class="card-title">Raila Odinga</h5>
                            <p class="card-text">Azimio la Umoja Party</p>
                            <input 
                              type="checkbox" 
                              name="raila" 
                              checked = {this.state.railaVotes}
                            /><br/><br/>
                            <button class="btn btn-primary" onClick={this.voteRaila}>Vote</button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div class="card votingCard" >
                          <img src={ruto} className="card-img-top candidateImg" alt="ruto" />
                          <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">UDA Party</p>
                            <input 
                              className ="voteFields" 
                              type="checkbox" name="ruto" 
                              checked = {this.state.rutoVotes}
                            /><br/><br/>
                            <button class="btn btn-primary" onClick={this.voteRuto}>Vote</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3"></div>
                    </div>

                    {/* add loader div */}
                    <div className={this.state.voting ? "showClass":"hideClass"}>
                      <div className="loader"></div>
                    </div>

                    <div className ="votingDiv">
                      <button id="createAccount" onClick={this.createNewAccount} type="button" className="btn btn-primary">
                        Connect Account  
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <input
                        type='text'
                        value={this.state.userAccountaddr}
                      /><br/><br/>

                      <button id="fundAccount" onClick={this.fundAccount} type="button" className="btn btn-primary">
                        Account Balance
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <input
                        type='text'
                        value={this.state.initialAccountBalance}
                      />

                    </div>

                    <input
                      type='text'
                      placeholder='Enter contract'
                      onChange={(e) => this.setState({attachContractDetails: e.currentTarget.value})}
                    /> &nbsp;&nbsp;&nbsp;
                    <button id="submitVote" onClick={this.submitVote} type="button" className="btn btn-primary">
                        Submit Vote
                    </button><br></br>
                  </div>

                  {/* add the results div here */}
                  <Results 
                    winner = {this.state.winner}
                    railaTotalVotes = {this.state.railaTotalVotes}
                    rutoTotalVotes = {this.state.rutoTotalVotes}
                    displayClass = {this.state.votingReady ? "showClass":"hideClass"}
                    contractDetailsJson = {this.state.contractDetailsJson}
                    totalVotes = {this.state.railaTotalVotes + this.state.rutoTotalVotes}
                    loading = {this.state.loading}
                    deploying = {this.state.deploying}
                  />
                  
                </div>
              </div>
            </div>

            {/* add footer section here */}
            <Footer/>

          </div>
        )
    }
}

// now export the created Component
export default Base