const { ethers, network } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log(`💰 ${network.name} 네트워크에서 ETH 분배 시작...\n`);
  
  try {
    // generated-accounts.json 파일에서 계정 정보 읽기
    const accountsPath = path.join(__dirname, '../generated-accounts.json');
    const accountsData = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    const accounts = accountsData.accounts;
    
    // 마이너 계정 (첫 번째 계정)
    const mainAccount = new ethers.Wallet(accounts[0].privateKey, ethers.provider);
    
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
    
    // 원하는 만큼만 분배 (예: 최대 10개 계정)
    const maxTx = Math.min(10, accounts.length - 1);
    
    // 현재 nonce 가져오기
    const currentNonce = await ethers.provider.getTransactionCount(mainAccount.address, "pending");
    console.log(`📊 현재 nonce: ${currentNonce}`);
    
    // 가스 가격 정보 가져오기
    const feeData = await ethers.provider.getFeeData();
    console.log(`⛽ 현재 가스 가격: ${ethers.formatUnits(feeData.gasPrice, "gwei")} Gwei`);
    
    // 가스 가격을 1.5배로 높여서 우선순위 확보
    const gasPrice = feeData.gasPrice * BigInt(15) / BigInt(10); // 1.5배
    const gasLimit = 21000;
    
    console.log(`🚀 ${maxTx}개의 트랜잭션을 병렬로 전송합니다...`);
    console.log(`⛽ 사용할 가스 가격: ${ethers.formatUnits(gasPrice, "gwei")} Gwei (1.5배 증가)\n`);
    
    // 1단계: 모든 트랜잭션을 병렬로 생성 및 전송 (nonce 명시적 관리)
    const txPromises = [];
    const startTime = Date.now();
    
    for (let i = 1; i <= maxTx; i++) {
      const targetAccount = accounts[i];
      const txNonce = currentNonce + i - 1; // 각 트랜잭션마다 고유한 nonce
      
      // 전송 전 잔액 체크를 병렬로 처리
      const txPromise = (async (accountIndex, nonce) => {
        try {
          console.log(`📤 계정 ${accountIndex} (${targetAccount.address})로 트랜잭션 생성 중... (nonce: ${nonce})`);
          
          const beforeBalance = await ethers.provider.getBalance(targetAccount.address);
          
          // 트랜잭션 생성 및 전송
          const tx = await mainAccount.sendTransaction({
            to: targetAccount.address,
            value: amountToSend,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce
          });
          
          console.log(`✅ 계정 ${accountIndex} 트랜잭션 전송 완료! Hash: ${tx.hash.substring(0, 42)}...`);
          
          return {
            accountIndex,
            address: targetAccount.address,
            beforeBalance: ethers.formatEther(beforeBalance),
            tx: tx,
            nonce: nonce,
            success: true
          };
        } catch (error) {
          console.error(`❌ 계정 ${accountIndex} 트랜잭션 생성 실패 (nonce: ${nonce}):`, error.message);
          return {
            accountIndex,
            address: targetAccount.address,
            nonce: nonce,
            error: error.message,
            success: false
          };
        }
      })(i, txNonce);
      
      txPromises.push(txPromise);
    }
    
    // 모든 트랜잭션 생성 완료 대기
    const txResults = await Promise.all(txPromises);
    const successfulTxs = txResults.filter(result => result.success);
    const failedTxs = txResults.filter(result => !result.success);
    
    console.log(`\n🎯 트랜잭션 전송 완료: ${successfulTxs.length}개 성공, ${failedTxs.length}개 실패`);
    
    if (failedTxs.length > 0) {
      console.log("\n❌ 실패한 트랜잭션들:");
      failedTxs.forEach(failed => {
        console.log(`   계정 ${failed.accountIndex} (nonce: ${failed.nonce}): ${failed.error}`);
      });
    }
    
    if (successfulTxs.length === 0) {
      console.log("모든 트랜잭션이 실패했습니다.");
      return;
    }
    
    console.log(`\n⏳ ${successfulTxs.length}개 트랜잭션 컨펌 대기 중...`);
    
    // 2단계: 모든 트랜잭션 컨펌을 병렬로 대기
    const receiptPromises = successfulTxs.map(async (txResult) => {
      try {
        console.log(`⏳ 계정 ${txResult.accountIndex} 컨펌 대기 중... (${txResult.tx.hash.substring(0, 42)}...)`);
        const receipt = await txResult.tx.wait();
        const afterBalance = await ethers.provider.getBalance(txResult.address);
        
        console.log(`✅ 계정 ${txResult.accountIndex} 컨펌 완료! 블록: ${receipt.blockNumber}`);
        
        return {
          ...txResult,
          receipt: receipt,
          afterBalance: ethers.formatEther(afterBalance),
          txHash: txResult.tx.hash,
          blockNumber: receipt.blockNumber,
          confirmed: true
        };
      } catch (error) {
        console.error(`❌ 계정 ${txResult.accountIndex} 컨펌 실패:`, error.message);
        return {
          ...txResult,
          error: error.message,
          confirmed: false
        };
      }
    });
    
    const finalResults = await Promise.all(receiptPromises);
    const confirmedTxs = finalResults.filter(result => result.confirmed);
    const unconfirmedTxs = finalResults.filter(result => !result.confirmed);
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    // 최종 결과 요약
    console.log("\n" + "=".repeat(80));
    console.log("🎉 ETH 분배 완료!\n");
    
    console.log(`⏱️  총 소요시간: ${totalTime.toFixed(2)}초`);
    console.log(`📊 성공한 전송: ${confirmedTxs.length}/${maxTx}건`);
    console.log(`💰 총 전송량: ${confirmedTxs.length * 5} ETH`);
    console.log(`⛽ 사용된 가스 가격: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);
    
    if (unconfirmedTxs.length > 0) {
      console.log(`⚠️  컨펌 실패: ${unconfirmedTxs.length}건`);
    }
    
    // 메인 계정 최종 잔액
    const finalMainBalance = await ethers.provider.getBalance(mainAccount.address);
    console.log(`\n🏦 메인 계정 (${mainAccount.address}):`);
    console.log(`   최종 잔액: ${ethers.formatEther(finalMainBalance)} ETH\n`);
    
    // 모든 계정 잔액 확인
    console.log("💼 전체 계정 잔액 현황:");
    const balancePromises = [];
    for (let i = 0; i <= maxTx; i++) {
      const account = accounts[i];
      balancePromises.push(
        ethers.provider.getBalance(account.address).then(balance => ({
          index: i,
          address: account.address,
          balance: ethers.formatEther(balance),
          description: i === 0 ? "마이너 계정" : `새 계정 ${i}`
        }))
      );
    }
    
    const balances = await Promise.all(balancePromises);
    balances.forEach(acc => {
      console.log(`   계정 ${acc.index} (${acc.description}): ${acc.balance} ETH`);
    });
    
    if (confirmedTxs.length > 0) {
      console.log("\n📋 성공한 전송 내역:");
      confirmedTxs.forEach(tx => {
        console.log(`   계정 ${tx.accountIndex}: ${ethers.formatEther(amountToSend)} ETH → ${tx.address}`);
        console.log(`     전송 전: ${tx.beforeBalance} ETH → 전송 후: ${tx.afterBalance} ETH`);
        console.log(`     TX: ${tx.txHash.substring(0, 42)}... (블록: ${tx.blockNumber}, nonce: ${tx.nonce})`);
      });
    }
    
    console.log("\n💡 이제 모든 계정으로 다양한 테스트를 진행할 수 있습니다!");
    console.log("   - DID 생성: 여러 사용자 시나리오");
    console.log("   - 티켓 구매: 다양한 계정으로 테스트");
    console.log("   - 크로스 계정 검증: DID 소유권 확인");
    
    return {
      success: true,
      totalTime,
      confirmedTxs: confirmedTxs.length,
      failedTxs: failedTxs.length,
      unconfirmedTxs: unconfirmedTxs.length,
      balances
    };
  } catch (error) {
    console.error("❌ ETH 분배 중 오류 발생:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

main()
  .then((result) => {
    if (result.success) {
      console.log("\n✨ ETH 분배가 성공적으로 완료되었습니다!");
    } else {
      console.error("\n❌ ETH 분배 실패:", result.error);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 예상치 못한 오류 발생:", error);
    process.exit(1);
  });
