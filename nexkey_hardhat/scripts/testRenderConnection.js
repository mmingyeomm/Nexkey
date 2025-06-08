const { ethers } = require("hardhat");

async function main() {
  console.log("🌐 Render Besu 연결 테스트 시작...");
  
  try {
    // 네트워크 정보 확인
    const network = await ethers.provider.getNetwork();
    console.log("연결된 네트워크:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    
    // 계정 정보
    const [deployer] = await ethers.getSigners();
    console.log("계정 주소:", deployer.address);
    
    // 잔액 확인
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // 블록 정보
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("최신 블록 번호:", blockNumber);
    
    // 네트워크 연결 테스트
    const block = await ethers.provider.getBlock("latest");
    console.log("최신 블록 해시:", block.hash);
    console.log("블록 타임스탬프:", new Date(Number(block.timestamp) * 1000).toLocaleString());
    
    // Gas Price 확인
    const gasPrice = await ethers.provider.getFeeData();
    console.log("Gas Price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "Gwei");
    
    console.log("\n🎉 Render Besu 연결 성공!");
    console.log("=".repeat(50));
    console.log("✅ 네트워크 연결 확인");
    console.log("✅ 계정 정보 조회 성공");
    console.log("✅ 블록체인 데이터 접근 가능");
    console.log("✅ 배포 준비 완료");
    console.log("=".repeat(50));
    
    console.log("\n📝 다음 단계:");
    console.log("1. DID Registry 배포: npx hardhat run scripts/deployDID.js --network render");
    console.log("2. Interpark Addon 배포: npx hardhat run scripts/deployInterparkAddon.js --network render");
    console.log("3. 시스템 테스트: npx hardhat run scripts/systemStatus.js --network render");
    
  } catch (error) {
    console.error("❌ 연결 실패:", error.message);
    
    if (error.message.includes("network does not support ENS")) {
      console.log("⚠️ ENS 지원하지 않음 (정상 - 개발 네트워크)");
    } else if (error.message.includes("timeout")) {
      console.log("💡 네트워크 타임아웃 - Render 서비스 상태를 확인하세요");
    } else if (error.message.includes("connection refused")) {
      console.log("💡 연결 거부 - URL이 올바른지 확인하세요");
    }
    
    throw error;
  }
}

// 메인 함수 실행
main()
  .then(() => {
    console.log("\n📊 연결 테스트 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 