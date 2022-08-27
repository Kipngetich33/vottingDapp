// import all the third party libraries here
import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs'

// ***************************************************************************************************************************************
// define global variables
const stdlib = loadStdlib(process.env);
const startingBalance = stdlib.parseCurrency(100);
const contestants = ["Raila Odinga",'William Ruto']
const results = {
  'Raila Odinga':0,
  'William Ruto':0
}
let votingDone = false;
const voters = [];
let ctcVoteCordinator = null;

// ***************************************************************************************************************************************
// define helper functions
const castVote = async () => await ask(
  'Please Cast you vote below: 1 - Raila Odinga, 2 - William Ruto.',
  (x => x) // use call back to return the details entered by the user
)

const getContractFromVoter = async () => await ask(
  'Enter the voting contract details to continue',
  (x => x) // use call back to return the details entered by the user
)

const defineUserRole = async () => await ask(
  'Are you a vote Cordinator? (y/n)',
  yesno
)


// ***************************************************************************************************************************************
// start program section
console.log("********************************************* Voting System ***************************************************")
console.log("Starting Contract")

// determine the users role
const userRole =  await defineUserRole() ? "voteCordinator" : "voter"
console.log(userRole)

// modify interaction based on role
if(userRole == "voteCordinator" ){
  // this is the vote cordinator and hence need to deploy the contract
  const accVoteCordinator = await stdlib.newTestAccount(startingBalance);
  console.log('Created account for VoteCordinator');
  // allow accVoteCordinator to attach to the backend as the deployer of the contract
  ctcVoteCordinator = accVoteCordinator.contract(backend);
  // display contract details so that users can attach
  ctcVoteCordinator.getInfo().then((contractDetails) => {
  console.log(`Contract Details : ${JSON.stringify(contractDetails._hex)}`)
  })

  // crate a partcipant interface for the voter cordininator
  await ctcVoteCordinator.participants.VoteCordinator({
    votingReady: () => {
      console.log("Voting is ready.")
    },
    voteStatus: (vote) => {
      console.log(`User Vote ${vote}`);
    }, 
    finalVote: (firstCandidateVotes, secondCandidateVotes) => {
      // assign votes correctly
      results['Raila Odinga'] = firstCandidateVotes
      results['William Ruto'] = secondCandidateVotes
      // console the final results
      console.log(`firstCandidateVotes: ${firstCandidateVotes}, secondCandidateVotes: ${secondCandidateVotes}`);
    },
    getContestants: () => {
      return {
        position:"President",
        candidates:["Raila Odinga","William Ruto"]
      }
    },
    testObject: () => {
      return {'status':true}
    },
    printFunction: (message) => {
      console.log(`${message}`)
    },
    terminateContract: async () => {
      const defineUserRole = async () => await ask(
        'Do you want to terminate contract?',
        yesno
      )
      const terminate = await defineUserRole()
      if(terminate){
        console.log("Terminating...")
        // mark voting as done
        votingDone = true
      }else{
        console.log("Contract will keep running until the time elapses.")
      }
    }
  })

  // while(! votingDone ) {
  //   await stdlib.wait(1);
  // }

}else if(userRole =="voter"){
  // add the Voter APIs here
  console.log("You at participating as a Voter")
  
   // get user's vote
   const castedVote = await castVote()
   console.log("castedVote",castedVote)

  // create a new test account for user
  const acc = await stdlib.newTestAccount(startingBalance);
  const constractDetails = getContractFromVoter()

  // attach to the contract in the backend
  const ctc = acc.contract(backend,constractDetails);
  // call the voters API

  try{
    // now increment the vote here
    const [ currentVote ] = await ctc.apis.Voter.vote(castedVote);
    console.log(`Your latest vote is ${currentVote}`)
  }catch (e) {
    console.log(`Failed to Vote`)
  } 

}else{
  // user role is not defined
  console.log("The given user role is not defined.")
}

console.log('Thanks for Making you voice Heard');
// end the contract at this point

// while(!votingDone){
//   // keep terminals open
// }
votingDone = true
done()
