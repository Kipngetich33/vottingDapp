'reach 0.1';

export const main = Reach.App(() => {
  // define the vote Cordinator interface
  const VoteCordinator = Participant('VoteCordinator', {
    votingReady: Fun([],Null),
    voteStatus: Fun([UInt],Null),
    finalVote: Fun([UInt,UInt],Null),
    getContestants: Fun([],Object({
      position:Bytes(50),
      candidates: Tuple(Bytes(50),Bytes(50))
    })),
    sendLogs: Fun([UInt],Null)
  });

  // define the voter API interface
  const Voter = API('Voter', {
    vote: Fun([UInt],Tuple(UInt)),
  });

  // define helper functions here
  const determineAdditionOfVotes = (vote,contestantIndex) => {
    // contestant index 1 for Raila Odinga and 2 for William Ruto
    return vote == contestantIndex ? 1:0
  } 

  init();

  // now get the contest ID (VoteCordinator local step)
  VoteCordinator.only(() => {
  })

  // The VoteCordinator is the first one to publish and hence pay deployment fees
  VoteCordinator.publish();
  commit();


  // publish something in order to enter into a concesus step
  VoteCordinator.only(() => {
  });

  VoteCordinator.publish();

  const lenInBlocks = 10
  const end = lastConsensusTime() + lenInBlocks;
  const firstVote = 0

  // start the Voting process
  VoteCordinator.interact.votingReady();
  // add option to end the contract

  const [ firstCandidateVotes, secondCandidateVotes ] = parallelReduce([ 0, 0 ])
    .invariant(balance() >= 0 )
    .while(lastConsensusTime() <= end )
    .api_(Voter.vote, (vote) => {
      return [vote, (notify) => {
        notify([vote]);
        
        VoteCordinator.interact.voteStatus(vote);
        return [
          firstCandidateVotes + determineAdditionOfVotes(vote,1),
          secondCandidateVotes + determineAdditionOfVotes(vote,2),
        ]
      }];
    })
    // .timeout(absoluteTime(end), () => {
    .timeout(absoluteTime(end), () => {
      VoteCordinator.publish();
      return [firstCandidateVotes, secondCandidateVotes]
    });

  // print the last vote here
  VoteCordinator.interact.finalVote(firstCandidateVotes,secondCandidateVotes)
  transfer(balance()).to(VoteCordinator);

  commit();

  // end contract
  exit();

});
