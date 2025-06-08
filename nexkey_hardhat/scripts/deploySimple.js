const { ethers } = require("hardhat");

async function main() {
  console.log("Starting SimpleStorage deployment...");
  
  // Get the contract factory
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  
  console.log("Deploying SimpleStorage contract...");
  
  try {
    // Deploy with very low gas configuration
    const simpleStorage = await SimpleStorage.deploy({
      gasLimit: 4500, // Very low gas limit
      gasPrice: ethers.parseUnits("1", "gwei") // Low gas price
    });
    
    console.log("Deployment transaction sent...");
    await simpleStorage.waitForDeployment();
    
    const address = await simpleStorage.getAddress();
    console.log("SimpleStorage contract deployed to:", address);
    console.log("Transaction hash:", simpleStorage.deploymentTransaction().hash);
    
    // Test the contract
    console.log("Testing contract...");
    const storedValue = await simpleStorage.storedData();
    console.log("Initial stored value:", storedValue.toString());
    
  } catch (error) {
    console.error("Deployment failed:", error.message);
    console.log("The Besu node might have too low gas limit for contract deployment.");
    console.log("Current block gas limit is only 5000, which is insufficient for most contracts.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 