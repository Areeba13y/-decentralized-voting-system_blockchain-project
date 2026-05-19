const hre = require("hardhat");

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const voting = await hre.ethers.getContractAt("DecentralizedVotingSystem", contractAddress);
  
  const tx1 = await voting.createProposal("Candidate Alice");
  await tx1.wait();
  console.log("Proposal created");
  
  const [deployer, voter1] = await hre.ethers.getSigners();
  const tx2 = await voting.authorizeVoter(voter1.address, 5);
  await tx2.wait();
  console.log("Voter authorized with weight 5");
  
  const tx3 = await voting.connect(voter1).vote(1);
  await tx3.wait();
  console.log("Vote cast");
  
  const winner = await voting.getWinningProposal();
  console.log("Winner:", winner);
}

main().catch(console.error);