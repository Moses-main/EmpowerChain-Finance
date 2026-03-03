const hre = require("hardhat");

async function main() {
  console.log("Deploying EmpowerChain Finance Contracts...\n");

  // Deploy Loan Contract
  console.log("1. Deploying Loan Contract...");
  const Loan = await hre.ethers.getContractFactory("Loan");
  const loan = await Loan.deploy();
  await loan.waitForDeployment();
  const loanAddress = await loan.getAddress();
  console.log(`   Loan deployed to: ${loanAddress}`);

  // Deploy Lending Contract (Celo testnet - use cUSD on Alfajores)
  // cUSD on Alfajores: 0x874069Fa1Eb16D44d622F2e0Ca25eeB172369bC
  const mockTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeB172369bC"; // cUSD on Alfajores
  const Lending = await hre.ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(mockTokenAddress);
  await lending.waitForDeployment();
  const lendingAddress = await lending.getAddress();
  console.log(`   Lending deployed to: ${lendingAddress}`);

  // Deploy Literacy Badge Contract
  console.log("\n3. Deploying LiteracyBadge Contract...");
  const LiteracyBadge = await hre.ethers.getContractFactory("LiteracyBadge");
  const badge = await LiteracyBadge.deploy();
  await badge.waitForDeployment();
  const badgeAddress = await badge.getAddress();
  console.log(`   LiteracyBadge deployed to: ${badgeAddress}`);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      Loan: loanAddress,
      Lending: lendingAddress,
      LiteracyBadge: badgeAddress,
      MockToken: mockTokenAddress
    }
  };

  console.log("\n=================================");
  console.log("Deployment Summary:");
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Loan: ${loanAddress}`);
  console.log(`Lending: ${lendingAddress}`);
  console.log(`LiteracyBadge: ${badgeAddress}`);
  console.log("=================================\n");

  // Verify contracts on Polygonscan (if not local)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Verifying contracts on Polygonscan...");

    try {
      await hre.run("verify:verify", {
        address: loanAddress,
        constructorArguments: []
      });
      console.log("   Loan verified!");

      await hre.run("verify:verify", {
        address: lendingAddress,
        constructorArguments: [mockTokenAddress]
      });
      console.log("   Lending verified!");

      await hre.run("verify:verify", {
        address: badgeAddress,
        constructorArguments: []
      });
      console.log("   LiteracyBadge verified!");
    } catch (error) {
      console.log("   Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
