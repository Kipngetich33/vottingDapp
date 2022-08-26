'reach 0.1';

export const main = Reach.App(() => {
  // define the vote Cordinator interface
  const VoteCordinator = Participant('VoteCordinator', {
    getContestantsID: Fun([],Object({
      contestantId:UInt,
    })),
    votingReady: Fun([],Null),
    voteStatus: Fun([UInt],Null),
    finalVote: Fun([UInt],Null),
  });


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

  // define the voter API interface
  const Voter = API('Voter', {
    vote: Fun([UInt],Tuple(UInt)),
  });

  init();

  // now get the contest ID (VoteCordinator local step)
  VoteCordinator.only(() => {
    // const enteredContestantId = declassify(interact.getContestantsID())
    // const getContestastants = getContestants
  })

  // The VoteCordinator is the first one to publish and hence pay deployment fees
  VoteCordinator.publish();
  commit();


  VoteCordinator.publish();
  const lenInBlocks = 50
  const end = lastConsensusTime() + lenInBlocks;
  const firstVote = 0

  VoteCordinator.interact.votingReady();

  const [ currentVote, ] = parallelReduce([ firstVote, ])
    .invariant(balance() >= 0 )
    .while(lastConsensusTime() <= end )
    .api_(Voter.vote, (vote) => {
      // add dynamic assertions
      // check(bid > lastPrice, "Bid is too low.");

      // now add the new amounts
      // currentVote
      // currentVote = currentVote + firstVote
      // return calcuates amount
      return [vote, (notify) => {
        notify([vote]);

        // if(! isFirstBid){
        //   transfer(lastPrice).to(highestBidder)
        // }
        // const who = this;
        VoteCordinator.interact.voteStatus(vote);
        return [currentVote + vote]
      }];
    })
    .timeout(absoluteTime(end), () => {
      VoteCordinator.publish();
      return [currentVote]
    });
  

  // print the last vote here
  VoteCordinator.interact.finalVote(currentVote)


  transfer(balance()).to(VoteCordinator);

  commit();

  // end contract
  // exit();

});
