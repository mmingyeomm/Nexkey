const { ethers, network } = require("hardhat");

async function main() {
  console.log(`💰 ${network.name} 네트워크에서 ETH 전송 시작...\n`);
  
  try {
    // 송신자 계정 (첫 번째 계정)
    const [sender] = await ethers.getSigners();
    
    // 수신자 주소
    const recipientAddress = "0x0d10F69243B8A2FE4299FA4cC115c3023F4011CF";
    
    // 전송할 금액 (20 ETH)
    const amountToSend = ethers.parseEther("20.0");
    
    console.log("🏦 송신자 정보:");
    console.log("주소:", sender.address);
    
    const senderBalance = await ethers.provider.getBalance(sender.address);
    console.log("잔액:", ethers.formatEther(senderBalance), "ETH\n");
    
    // 잔액 확인
    if (senderBalance < amountToSend) {
      console.log("⚠️ 송신자의 ETH가 부족합니다.");
      console.log(`필요: ${ethers.formatEther(amountToSend)} ETH`);
      console.log(`보유: ${ethers.formatEther(senderBalance)} ETH`);
      return;
    }
    
    console.log("📤 전송 정보:");
    console.log("수신자:", recipientAddress);
    console.log("금액:", ethers.formatEther(amountToSend), "ETH\n");
    
    // 수신자 전송 전 잔액 확인
    const recipientBalanceBefore = await ethers.provider.getBalance(recipientAddress);
    console.log("수신자 전송 전 잔액:", ethers.formatEther(recipientBalanceBefore), "ETH");
    
    // 가스 정보 가져오기
    const feeData = await ethers.provider.getFeeData();
    console.log(`⛽ 현재 가스 가격: ${ethers.formatUnits(feeData.gasPrice, "gwei")} Gwei`);
    
    // 트랜잭션 전송
    console.log("\n🚀 트랜잭션 전송 중...");
    const tx = await sender.sendTransaction({
      to: recipientAddress,
      value: amountToSend,
      gasLimit: 21000,
      gasPrice: feeData.gasPrice
    });
    
    console.log("✅ 트랜잭션 전송 완료!");
    console.log("트랜잭션 해시:", tx.hash);
    
    // 트랜잭션 컨펌 대기
    console.log("\n⏳ 트랜잭션 컨펌 대기 중...");
    const receipt = await tx.wait();
    
    console.log("✅ 트랜잭션 컨펌 완료!");
    console.log("블록 번호:", receipt.blockNumber);
    console.log("가스 사용량:", receipt.gasUsed.toString());
    
    // 최종 잔액 확인
    const senderBalanceAfter = await ethers.provider.getBalance(sender.address);
    const recipientBalanceAfter = await ethers.provider.getBalance(recipientAddress);
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 전송 완료 결과");
    console.log("=".repeat(60));
    
    console.log("\n🏦 송신자 잔액 변화:");
    console.log(`   전송 전: ${ethers.formatEther(senderBalance)} ETH`);
    console.log(`   전송 후: ${ethers.formatEther(senderBalanceAfter)} ETH`);
    
    console.log("\n💰 수신자 잔액 변화:");
    console.log(`   전송 전: ${ethers.formatEther(recipientBalanceBefore)} ETH`);
    console.log(`   전송 후: ${ethers.formatEther(recipientBalanceAfter)} ETH`);
    
    const actualTransferred = recipientBalanceAfter - recipientBalanceBefore;
    console.log(`\n✅ 실제 전송된 금액: ${ethers.formatEther(actualTransferred)} ETH`);
    
    return {
      network: network.name,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      from: sender.address,
      to: recipientAddress,
      amount: ethers.formatEther(amountToSend),
      senderBalanceAfter: ethers.formatEther(senderBalanceAfter),
      recipientBalanceAfter: ethers.formatEther(recipientBalanceAfter)
    };
    
  } catch (error) {
    console.error("❌ ETH 전송 실패:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n🎉 ETH 전송 스크립트 완료!");
    console.log("결과:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 