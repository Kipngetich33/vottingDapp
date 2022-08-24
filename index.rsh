'reach 0.1';

export const main = Reach.App(() => {
  // define the vote Cordinator interface
  const VoteCordinator = Participant('VoteCordinator', {
    
  });

  // define the voter API interface
  const Voter = API('Voter', {

  });

  init();
  // // The first one to publish deploys the contract
  // A.publish();
  // commit();
  // // The second one to publish always attaches
  // B.publish();
  // commit();
  // // write your program here
  // exit();
});
