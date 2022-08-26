// import all the third party libraries here
import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs'

// load the stdlib environment variables
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

// define contestants 
const contestants = {
  "President":[
    {'fullName':"Raila Oding"},
    {'fullName':"William Ruto"}
  ],
  "Gorvernor":[
    {'fullName':"John Sakaja"},
    {'fullName':"Polycarp Igathe"}
  ]
}

console.log("********************************************* Voting System ***************************************************")
console.log("Starting Contract")
// create an account for the vote cordinator
const accVoteCordinator  =  await stdlib.newTestAccount(startingBalance);
console.log('Created account for accVoteCordinator');


// define helper functions
const getContestantsID = async () => {
  console.log("Getting Contestant ID")
  const voterId = await ask(
    'Enter your Id No.',
    (x => x) // use call back to return the details entered by the user
  )
  return {
    contestantId: voterId
  }
}

let votingDone = false;
const voters = []
const startVotters = async () => {
  console.log("starting Voters")

  const runVotter = async (passedVote) => {
    console.log("Running Voter")
     // voters.push(vote);
    const acc = await stdlib.newTestAccount(startingBalance);
    console.log(`Create account for Voter ${passedVote}}`)

    // define contract for the current user
    const ctc = acc.contract(backend, ctcVoteCordinator.getInfo());
    // call the voter api
    try{
      // now increment the vote here
      const [ currentVote ] = await ctc.apis.Voter.vote(passedVote);
      console.log(`Your latest vote is ${currentVote}`)
    }catch (e) {
      console.log(`Failed to Vote`)
    } 
  }

  // now run voters votes here
  await runVotter(1)
  await runVotter(1)
  await runVotter(1)

  while(! votingDone ) {
    await stdlib.wait(1);
  }
}


// allow accVoteCordinator to attach to the backend as the deployer of the contract
const ctcVoteCordinator = accVoteCordinator.contract(backend);
// crate a partcipant interface for the voter cordininator
await ctcVoteCordinator.participants.VoteCordinator({
  votingReady: () => {
    startVotters();
  },
  voteStatus: (vote) => {
    console.log(`User Vote ${vote}`);
  },
  finalVote: (vote) => {
    console.log(`Final Total Vote: ${vote}`);
  },
})

console.log('Thanks for Making you voice Heard');
// exit from active contract
votingDone = true
// done()
