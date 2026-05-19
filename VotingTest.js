const { expect } = require("chai");

describe("DecentralizedVotingSystem", function () {
  let voting, admin, voter1, voter2;

  beforeEach(async function () {
    [admin, voter1, voter2] = await ethers.getSigners();
    
    const VotingSystem = await ethers.getContractFactory("DecentralizedVotingSystem");
    voting = await VotingSystem.deploy(10);
    await voting.waitForDeployment();
    
    await voting.createProposal("Candidate A");
    await voting.createProposal("Candidate B");
  });

  it("Should prevent double voting", async function () {
    await voting.authorizeVoter(voter1.address, 1);
    await voting.connect(voter1).vote(1);
    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("Already voted");
  });

  it("Should calculate winner correctly", async function () {
    await voting.authorizeVoter(voter1.address, 3);
    await voting.authorizeVoter(voter2.address, 2);
    
    await voting.connect(voter1).vote(2);
    await voting.connect(voter2).vote(2);
    
    await ethers.provider.send("evm_increaseTime", [600]);
    await ethers.provider.send("evm_mine");
    
    const [id, name, votes] = await voting.getWinningProposal();
    expect(name).to.equal("Candidate B");
  });

  it("Should not allow unauthorized voters", async function () {
    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("Not authorized");
  });

  it("Should create proposal only by admin", async function () {
    await expect(voting.connect(voter1).createProposal("Invalid")).to.be.revertedWith("Only admin");
  });

  it("Should track vote count correctly", async function () {
    await voting.authorizeVoter(voter1.address, 5);
    await voting.connect(voter1).vote(1);
    
    const [, votes] = await voting.getProposalDetails(1);
    expect(votes).to.equal(5);
  });
});