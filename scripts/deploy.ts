import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  
  if(!deployer) {
    console.error("No valid deployer found.");
    return;
  }

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Loan Contract
  console.log("Deploying Loan...");
  const Loan = await ethers.getContractFactory("Loan");
  const loan = await Loan.deploy();
  await loan.waitForDeployment();
  console.log("Loan contract deployed to:", await loan.getAddress());

  // Deploy Lending Contract
  console.log("Deploying Lending...");
  // Using a dummy address for the ERC20 token for testnet purposes
  const dummyTokenAddress = "0x0000000000000000000000000000000000000001";
  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(dummyTokenAddress);
  await lending.waitForDeployment();
  console.log("Lending contract deployed to:", await lending.getAddress());

  // Deploy LiteracyBadge Contract
  console.log("Deploying LiteracyBadge...");
  const LiteracyBadge = await ethers.getContractFactory("LiteracyBadge");
  const literacyBadge = await LiteracyBadge.deploy();
  await literacyBadge.waitForDeployment();
  console.log("LiteracyBadge contract deployed to:", await literacyBadge.getAddress());

  console.log("-------------Deployment Summary-------------");
  console.log(`Loan Contract: ${await loan.getAddress()}`);
  console.log(`Lending Contract: ${await lending.getAddress()}`);
  console.log(`Literacy Badge Contract: ${await literacyBadge.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
