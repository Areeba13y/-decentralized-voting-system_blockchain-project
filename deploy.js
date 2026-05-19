const hre = require("hardhat");

async function main() {
  const votingDurationMinutes = 60;
  
  const VotingSystem = await hre.ethers.getContractFactory("DecentralizedVotingSystem");
  const voting = await VotingSystem.deploy(votingDurationMinutes);
  
  await voting.waitForDeployment();
  
  console.log(`Contract deployed to: ${await voting.getAddress()}`);
  console.log(`Voting duration: ${votingDurationMinutes} minutes`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});