// import all the third party libraries here
import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs'

// define global variables
const stdlib = loadStdlib(process.env);
const startingBalance = stdlib.parseCurrency(100);
const contestants = ["Raila Odinga",'William Ruto']
const results = {
  'Raila Odinga':0,
  'William Ruto':0
}

// now start the program
console.log("********************************************* Voting System ***************************************************")
console.log("Starting Contract")
// create an account for the vote cordinator
const accVoteCordinator  =  await stdlib.newTestAccount(startingBalance);
console.log('Created account for accVoteCordinator');

// define helper functions
const castVote = async () => await ask(
  'Please Cast you vote below: 1 - Raila Odinga, 2 - William Ruto.',
  (x => x) // use call back to return the details entered by the user
)


let votingDone = false;
const voters = []
const startVotters = async () => {  
  const runVotter = async () => {
    console.log("Running Voter")
    const castedVote = await castVote()
    console.log("castedVote",castedVote)
     // voters.push(vote);
    const acc = await stdlib.newTestAccount(startingBalance);
    const ctc = acc.contract(backend, ctcVoteCordinator.getInfo());
    console.log(`Create account for Voter ${castedVote}}`)

    // call the voter api
    try{
      // now increment the vote here
      const [ currentVote ] = await ctc.apis.Voter.vote(castedVote);
      console.log(`Your latest vote is ${currentVote}`)
    }catch (e) {
      console.log(`Failed to Vote`)
    } 
  }

  // now run voters votes here
  await runVotter()
  await runVotter()
  await runVotter()

  while(! votingDone ) {
    await stdlib.wait(1);
  }
}


// allow accVoteCordinator to attach to the backend as the deployer of the contract
const ctcVoteCordinator = accVoteCordinator.contract(backend);
// display contract details so that users can attach
ctcVoteCordinator.getInfo().then((contractDetails) => {
  console.log(`Contract Details : ${JSON.stringify(contractDetails)}`)
})


// add the await all promise loop
await Promise.all([
  // crate a partcipant interface for the voter cordininator
  await ctcVoteCordinator.participants.VoteCordinator({
    votingReady: () => {
      startVotters();
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
    }
  })
])


console.log('Thanks for Making you voice Heard');
// end the contract at this point
votingDone = true
done()
