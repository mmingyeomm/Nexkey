const { ethers } = require("hardhat");

async function main() {
  console.log("🔑 새로운 이더리움 계정 10개 생성 중...\n");
  
  const accounts = [];
  
  // 기존 개발용 계정도 포함
  const existingAccount = {
    index: 0,
    address: "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73",
    privateKey: "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
    description: "기존 Besu 개발용 계정 (마이너)"
  };
  accounts.push(existingAccount);
  
  // 새로운 계정 9개 생성
  for (let i = 1; i <= 9; i++) {
    const wallet = ethers.Wallet.createRandom();
    const account = {
      index: i,
      address: wallet.address,
      privateKey: wallet.privateKey,
      description: `새로 생성된 계정 ${i}`
    };
    accounts.push(account);
  }
  
  console.log("📋 생성된 계정 목록:");
  console.log("=".repeat(80));
  
  accounts.forEach((account, index) => {
    console.log(`\n🔐 계정 ${account.index}:`);
    console.log(`   주소: ${account.address}`);
    console.log(`   개인키: ${account.privateKey}`);
    console.log(`   설명: ${account.description}`);
  });
  
  console.log("\n" + "=".repeat(80));
  
  // Hardhat 설정용 배열 생성
  console.log("\n📝 Hardhat Config용 개인키 배열:");
  console.log("accounts: [");
  accounts.forEach((account, index) => {
    const comma = index < accounts.length - 1 ? "," : "";
    console.log(`  "${account.privateKey}"${comma} // ${account.description}`);
  });
  console.log("]");
  
  // 계정 정보를 JSON 파일로 저장
  const accountsData = {
    generated_at: new Date().toISOString(),
    network_info: {
      chainId: 1337,
      description: "Besu Development Network"
    },
    accounts: accounts.map(acc => ({
      index: acc.index,
      address: acc.address,
      privateKey: acc.privateKey,
      description: acc.description
    }))
  };
  
  const fs = require('fs');
  const path = require('path');
  
  const accountsFile = path.join(__dirname, '../generated-accounts.json');
  fs.writeFileSync(accountsFile, JSON.stringify(accountsData, null, 2));
  
  console.log(`\n💾 계정 정보가 저장되었습니다: ${accountsFile}`);
  
  console.log("\n🚨 보안 주의사항:");
  console.log("- 이 개인키들은 개발용입니다!");
  console.log("- 실제 메인넷에서는 절대 사용하지 마세요!");
  console.log("- generated-accounts.json 파일을 Git에 커밋하지 마세요!");
  
  console.log("\n💡 다음 단계:");
  console.log("1. hardhat.config.ts에 새로운 계정들 추가");
  console.log("2. 각 계정에 ETH 전송 (개발용)");
  console.log("3. 다양한 사용자로 DID 및 티켓 테스트");
  
  return accounts;
}

main()
  .then((accounts) => {
    console.log(`\n✅ 총 ${accounts.length}개 계정 생성 완료!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 계정 생성 실패:", error);
    process.exit(1);
  }); 