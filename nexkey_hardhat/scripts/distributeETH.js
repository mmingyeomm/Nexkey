const { ethers, network } = require("hardhat");

async function main() {
  console.log(`💰 ${network.name} 네트워크에서 ETH 분배 시작...\n`);
  
  try {
    // 모든 계정 정보 가져오기
    const signers = await ethers.getSigners();
    const mainAccount = signers[0]; // 마이너 계정 (ETH가 있는 계정)
    
    console.log("🏦 메인 계정 (ETH 보유):");
    console.log("주소:", mainAccount.address);
    
    const mainBalance = await ethers.provider.getBalance(mainAccount.address);
    console.log("잔액:", ethers.formatEther(mainBalance), "ETH\n");
    
    if (mainBalance < ethers.parseEther("10")) {
      console.log("⚠️ 메인 계정의 ETH가 부족합니다. 최소 10 ETH가 필요합니다.");
      return;
    }
    
    // 각 새로운 계정에 보낼 ETH 양 설정
    const amountToSend = ethers.parseEther("5.0"); // 계정당 5 ETH
    console.log(`📤 각 계정에 전송할 금액: ${ethers.formatEther(amountToSend)} ETH\n`);
    
    // 계정 1-9에 ETH 전송 (계정 0은 이미 ETH가 있음)
    const transactions = [];
    
    for (let i = 1; i < signers.length; i++) {
      const targetAccount = signers[i];
      
      console.log(`💸 계정 ${i}로 ETH 전송 중...`);
      console.log("대상 주소:", targetAccount.address);
      
      // 전송 전 잔액 확인
      const beforeBalance = await ethers.provider.getBalance(targetAccount.address);
      console.log("전송 전 잔액:", ethers.formatEther(beforeBalance), "ETH");
      
      try {
        // ETH 전송
        const tx = await mainAccount.sendTransaction({
          to: targetAccount.address,
          value: amountToSend,
          gasLimit: 21000 // 기본 ETH 전송 가스
        });
        
        console.log("트랜잭션 해시:", tx.hash);
        
        // 트랜잭션 완료 대기
        const receipt = await tx.wait();
        console.log("✅ 전송 완료! 블록:", receipt.blockNumber);
        
        // 전송 후 잔액 확인
        const afterBalance = await ethers.provider.getBalance(targetAccount.address);
        console.log("전송 후 잔액:", ethers.formatEther(afterBalance), "ETH");
        
        transactions.push({
          accountIndex: i,
          address: targetAccount.address,
          amount: ethers.formatEther(amountToSend),
          txHash: tx.hash,
          blockNumber: receipt.blockNumber
        });
        
        console.log(""); // 빈 줄
        
      } catch (error) {
        console.error(`❌ 계정 ${i} 전송 실패:`, error.message);
        console.log(""); // 빈 줄
      }
    }
    
    // 최종 결과 요약
    console.log("🎉 ETH 분배 완료!\n");
    console.log("=".repeat(80));
    
    // 메인 계정 최종 잔액
    const finalMainBalance = await ethers.provider.getBalance(mainAccount.address);
    console.log(`🏦 메인 계정 (${mainAccount.address}):`);
    console.log(`   최종 잔액: ${ethers.formatEther(finalMainBalance)} ETH\n`);
    
    // 모든 계정 잔액 확인
    console.log("💼 전체 계정 잔액 현황:");
    for (let i = 0; i < signers.length; i++) {
      const account = signers[i];
      const balance = await ethers.provider.getBalance(account.address);
      const description = i === 0 ? "마이너 계정" : `새 계정 ${i}`;
      console.log(`   계정 ${i} (${description}): ${ethers.formatEther(balance)} ETH`);
    }
    
    console.log("\n" + "=".repeat(80));
    
    console.log("\n📊 전송 요약:");
    console.log(`   성공한 전송: ${transactions.length}건`);
    console.log(`   총 전송량: ${transactions.length * 5} ETH`);
    console.log(`   네트워크: ${network.name}`);
    
    if (transactions.length > 0) {
      console.log("\n📋 전송 내역:");
      transactions.forEach(tx => {
        console.log(`   계정 ${tx.accountIndex}: ${tx.amount} ETH → ${tx.address}`);
        console.log(`   TX: ${tx.txHash}`);
      });
    }
    
    console.log("\n💡 이제 모든 계정으로 다양한 테스트를 진행할 수 있습니다!");
    console.log("   - DID 생성: 여러 사용자 시나리오");
    console.log("   - 티켓 구매: 다양한 계정으로 테스트");
    console.log("   - 크로스 계정 검증: DID 소유권 확인");
    
    return {
      network: network.name,
      mainAccountBalance: ethers.formatEther(finalMainBalance),
      successfulTransfers: transactions.length,
      totalDistributed: `${transactions.length * 5} ETH`,
      transactions
    };
    
  } catch (error) {
    console.error("❌ ETH 분배 실패:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n✅ ETH 분배 스크립트 완료!");
    console.log("결과:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 