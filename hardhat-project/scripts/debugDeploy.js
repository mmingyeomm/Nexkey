const { ethers } = require("hardhat");

async function main() {
  console.log("Debug deployment script starting...");
  
  try {
    // Get provider info
    const provider = ethers.provider;
    console.log("Provider URL:", provider.connection?.url || "Unknown");
    
    // Check network
    const network = await provider.getNetwork();
    console.log("Network info:", {
      name: network.name,
      chainId: network.chainId.toString(),
    });
    
    // Check accounts
    const accounts = await ethers.getSigners();
    console.log("Available accounts:", accounts.length);
    console.log("First account address:", accounts[0].address);
    
    // Check balance
    const balance = await provider.getBalance(accounts[0].address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    // Get latest block
    const block = await provider.getBlock("latest");
    console.log("Latest block:", {
      number: block.number,
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString()
    });
    
    // Try to estimate gas for a simple transaction
    console.log("\nTrying gas estimation...");
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    
    try {
      const deployTx = await SimpleStorage.getDeployTransaction();
      console.log("Deploy transaction data length:", deployTx.data.length);
      
      const gasEstimate = await provider.estimateGas({
        data: deployTx.data
      });
      console.log("Estimated gas:", gasEstimate.toString());
      
    } catch (gasError) {
      console.log("Gas estimation failed:", gasError.message);
    }
    
    // Try manual deployment
    console.log("\nTrying manual deployment...");
    const simpleStorage = await SimpleStorage.deploy({
      gasLimit: 3000000, // Much higher gas limit
      gasPrice: ethers.parseUnits("1", "gwei")
    });
    
    console.log("Deployment transaction hash:", simpleStorage.deploymentTransaction().hash);
    console.log("Waiting for deployment...");
    
    await simpleStorage.waitForDeployment();
    const address = await simpleStorage.getAddress();
    console.log("Contract deployed to:", address);
    
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error code:", error.code);
    console.error("Error reason:", error.reason);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  }); 