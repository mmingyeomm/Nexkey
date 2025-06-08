const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get the contract factory
  const Lock = await ethers.getContractFactory("Lock");
  
  // Set unlock time to January 1st, 2030
  const unlockTime = 1893456000;
  
  console.log("Deploying Lock contract...");
  console.log("Unlock time:", new Date(unlockTime * 1000));
  
  try {
    // Deploy with manual gas configuration
    const lock = await Lock.deploy(unlockTime, {
      value: ethers.parseEther("0.001"), // Send 0.001 ETH
      gasLimit: 4000, // Try with very low gas limit
      gasPrice: ethers.parseUnits("20", "gwei")
    });
    
    console.log("Deployment transaction sent...");
    await lock.waitForDeployment();
    
    const address = await lock.getAddress();
    console.log("Lock contract deployed to:", address);
    console.log("Transaction hash:", lock.deploymentTransaction().hash);
    
  } catch (error) {
    console.error("Deployment failed:", error.message);
    
    // Try with even lower gas limit
    console.log("Retrying with lower gas limit...");
    try {
      const lock = await Lock.deploy(unlockTime, {
        value: ethers.parseEther("0.001"),
        gasLimit: 3000,
        gasPrice: ethers.parseUnits("1", "gwei")
      });
      
      await lock.waitForDeployment();
      const address = await lock.getAddress();
      console.log("Lock contract deployed to:", address);
      
    } catch (retryError) {
      console.error("Retry also failed:", retryError.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 