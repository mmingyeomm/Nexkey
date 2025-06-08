const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DID Registry 컨트랙트 배포 시작...");
  
  try {
    // 배포자 계정 정보
    const [deployer] = await ethers.getSigners();
    console.log("배포 계정:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // DIDRegistry 컨트랙트 배포
    console.log("\n📄 DIDRegistry 컨트랙트 배포 중...");
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = await DIDRegistry.deploy();
    
    await didRegistry.waitForDeployment();
    const contractAddress = await didRegistry.getAddress();
    
    console.log("✅ DIDRegistry 배포 완료!");
    console.log("컨트랙트 주소:", contractAddress);
    console.log("트랜잭션 해시:", didRegistry.deploymentTransaction().hash);
    
    // 배포 완료 후 테스트 DID 생성
    console.log("\n🧪 테스트 DID 생성 중...");
    
    // 테스트 사용자 데이터
    const testUser = {
      owner: deployer.address,
      name: "김철수",
      birthDate: "1990-05-15",
      nationality: "Korean",
      idCardNumber: "123456-1234567", // 실제로는 해시값 사용
      profileImageHash: "QmTestHash123456789",
      metadataURI: "https://ipfs.io/ipfs/QmTestMetadata123456789"
    };
    
    // DID 생성 트랜잭션
    const createTx = await didRegistry.createDID(
      testUser.owner,
      testUser.name,
      testUser.birthDate,
      testUser.nationality,
      testUser.idCardNumber,
      testUser.profileImageHash,
      testUser.metadataURI
    );
    
    const receipt = await createTx.wait();
    console.log("✅ 테스트 DID 생성 완료!");
    console.log("트랜잭션 해시:", createTx.hash);
    
    // 생성된 DID 정보 조회
    const totalDIDs = await didRegistry.getTotalDIDs();
    console.log("전체 DID 개수:", totalDIDs.toString());
    
    if (totalDIDs > 0) {
      const didInfo = await didRegistry.getDID(1);
      console.log("\n📋 생성된 DID 정보:");
      console.log("- DID ID:", didInfo.id.toString());
      console.log("- DID 식별자:", didInfo.didIdentifier);
      console.log("- 소유자:", didInfo.owner);
      console.log("- 이름:", didInfo.name);
      console.log("- 생년월일:", didInfo.birthDate);
      console.log("- 국적:", didInfo.nationality);
      console.log("- 상태:", didInfo.status === 0 ? "ACTIVE" : didInfo.status === 1 ? "SUSPENDED" : "REVOKED");
      console.log("- 발급 시간:", new Date(Number(didInfo.issuedAt) * 1000).toLocaleString());
    }
    
    // 컨트랙트 검증
    console.log("\n🔍 컨트랙트 검증...");
    const isValid = await didRegistry.verifyDID(1);
    console.log("DID 유효성:", isValid ? "✅ 유효" : "❌ 무효");
    
    console.log("\n🎉 배포 및 테스트 완료!");
    console.log("=".repeat(50));
    console.log("컨트랙트 주소를 저장해두세요:", contractAddress);
    console.log("=".repeat(50));
    
    return {
      contractAddress,
      deploymentHash: didRegistry.deploymentTransaction().hash,
      testDIDId: 1
    };
    
  } catch (error) {
    console.error("❌ 배포 실패:", error.message);
    throw error;
  }
}

// 메인 함수 실행
main()
  .then((result) => {
    console.log("\n📊 배포 결과:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 