const { ethers, network } = require("hardhat");

async function main() {
  console.log("🚀 NEXKEY 전체 시스템 설정 시작...\n");
  console.log("=" .repeat(80));
  console.log(`🌐 네트워크: ${network.name}`);
  console.log(`⏰ 시작 시간: ${new Date().toLocaleString()}`);
  console.log("=" .repeat(80));
  
  const signers = await ethers.getSigners();
  console.log(`👥 사용 가능한 계정: ${signers.length}개`);
  console.log(`💰 마이너 계정: ${signers[0].address}`);
  
  // 마이너 계정 잔액 확인
  const minerBalance = await ethers.provider.getBalance(signers[0].address);
  console.log(`💎 마이너 계정 잔액: ${ethers.formatEther(minerBalance)} ETH`);
  
  const results = {
    network: network.name,
    timestamp: new Date().toISOString(),
    contracts: {},
    dids: [],
    events: [],
    tickets: [],
    ethDistribution: []
  };
  
  try {
    // ==================== STEP 1: DID Registry 배포 ====================
    console.log("\n📋 STEP 1: DID Registry 컨트랙트 배포 중...");
    
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = await DIDRegistry.deploy();
    await didRegistry.waitForDeployment();
    
    const didRegistryAddress = await didRegistry.getAddress();
    results.contracts.didRegistry = didRegistryAddress;
    
    console.log(`✅ DID Registry 배포 완료: ${didRegistryAddress}`);
    
    // 초기 DID 생성 (마이너 계정)
    console.log("🆔 마이너 계정 DID 생성 중...");
    const createMinerDIDTx = await didRegistry.createDID(
      signers[0].address,
      "김철수",
      "1990-05-15", 
      "Korean",
      "KR1990051500001",
      "",
      ""
    );
    await createMinerDIDTx.wait();
    console.log("✅ 마이너 계정 DID 생성 완료 (ID: 1)");
    
    // ==================== STEP 2: Interpark Addon 배포 ====================
    console.log("\n🎫 STEP 2: Interpark Ticket Addon 컨트랙트 배포 중...");
    
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = await InterparkTicketAddon.deploy(didRegistryAddress);
    await interparkAddon.waitForDeployment();
    
    const interparkAddress = await interparkAddon.getAddress();
    results.contracts.interparkAddon = interparkAddress;
    
    console.log(`✅ Interpark Addon 배포 완료: ${interparkAddress}`);
    console.log(`🔗 DID Registry 참조: ${didRegistryAddress}`);
    
    // ==================== STEP 3: ETH 분배 및 10명 사용자 DID 생성 ====================
    console.log("\n💰 STEP 3: ETH 분배 및 다중 테스트 DID 생성 중...");
    
    const userProfiles = [
      {
        name: "이영희",
        birthDate: "1992-08-22",
        nationality: "Korean",
        idCardNumber: "KR1992082200002"
      },
      {
        name: "박민수", 
        birthDate: "1988-12-03",
        nationality: "Korean",
        idCardNumber: "KR1988120300003"
      },
      {
        name: "최지은",
        birthDate: "1995-03-17", 
        nationality: "Korean",
        idCardNumber: "KR1995031700004"
      },
      {
        name: "John Smith",
        birthDate: "1987-07-10",
        nationality: "American", 
        idCardNumber: "US1987071000005"
      },
      {
        name: "Emma Johnson",
        birthDate: "1993-11-28",
        nationality: "British",
        idCardNumber: "UK1993112800006"
      },
      {
        name: "田中太郎",
        birthDate: "1991-04-05",
        nationality: "Japanese",
        idCardNumber: "JP1991040500007"
      },
      {
        name: "Marie Dubois",
        birthDate: "1989-09-14",
        nationality: "French",
        idCardNumber: "FR1989091400008"
      },
      {
        name: "Carlos Rodriguez",
        birthDate: "1994-01-20",
        nationality: "Spanish",
        idCardNumber: "ES1994012000009"
      },
      {
        name: "Anna Müller",
        birthDate: "1986-06-30",
        nationality: "German",
        idCardNumber: "DE1986063000010"
      },
      {
        name: "Li Wei",
        birthDate: "1993-12-25",
        nationality: "Chinese",
        idCardNumber: "CN1993122500011"
      }
    ];
    
    const ethToDistribute = ethers.parseEther("5.0"); // 5 ETH per user
    
    for (let i = 0; i < Math.min(userProfiles.length, signers.length - 1); i++) {
      const profile = userProfiles[i];
      const targetSigner = signers[i + 1]; // 계정 1부터 시작
      
      console.log(`\n👤 사용자 ${i + 1}: ${profile.name} 설정 중...`);
      console.log(`   계정 주소: ${targetSigner.address}`);
      
      // 현재 잔액 확인
      const currentBalance = await ethers.provider.getBalance(targetSigner.address);
      console.log(`   현재 잔액: ${ethers.formatEther(currentBalance)} ETH`);
      
      // 5 ETH 전송
      console.log(`   💸 5 ETH 전송 중...`);
      const transferTx = await signers[0].sendTransaction({
        to: targetSigner.address,
        value: ethToDistribute
      });
      await transferTx.wait();
      
      const newBalance = await ethers.provider.getBalance(targetSigner.address);
      console.log(`   ✅ 전송 완료! 새 잔액: ${ethers.formatEther(newBalance)} ETH`);
      
      results.ethDistribution.push({
        accountIndex: i + 1,
        address: targetSigner.address,
        name: profile.name,
        amountSent: "5.0",
        newBalance: ethers.formatEther(newBalance),
        txHash: transferTx.hash
      });
      
      // DID 생성
      console.log(`   🆔 DID 생성 중...`);
      const createTx = await didRegistry.createDID(
        targetSigner.address,
        profile.name,
        profile.birthDate,
        profile.nationality,
        profile.idCardNumber,
        "",
        ""
      );
      await createTx.wait();
      
      const totalDIDs = await didRegistry.getTotalDIDs();
      const didInfo = await didRegistry.getDID(totalDIDs);
      
      results.dids.push({
        didId: didInfo.id.toString(),
        owner: targetSigner.address,
        name: profile.name,
        nationality: profile.nationality,
        didIdentifier: didInfo.didIdentifier,
        ethBalance: ethers.formatEther(newBalance)
      });
      
      console.log(`   ✅ DID ${didInfo.id} 생성 완료!`);
    }
    
    console.log(`\n✅ 총 ${results.dids.length + 1}개 DID 생성 완료 (마이너 포함)`);
    console.log(`💰 총 ${results.ethDistribution.length * 5} ETH 분배 완료`);
    
    // ==================== STEP 4: 테스트 이벤트 생성 ====================
    console.log("\n🎪 STEP 4: 테스트 이벤트 생성 중...");
    
    const testEvents = [
      {
        name: "BTS 콘서트 2024",
        venue: "잠실 종합운동장",
        datetime: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30일 후
        totalTickets: 1000,
        ticketPrice: ethers.parseEther("0.1")
      },
      {
        name: "IU 단독 콘서트",
        venue: "올림픽공원 체조경기장", 
        datetime: Math.floor(Date.now() / 1000) + (45 * 24 * 60 * 60), // 45일 후
        totalTickets: 500,
        ticketPrice: ethers.parseEther("0.15")
      },
      {
        name: "NewJeans 팬미팅",
        venue: "코엑스 홀", 
        datetime: Math.floor(Date.now() / 1000) + (20 * 24 * 60 * 60), // 20일 후
        totalTickets: 300,
        ticketPrice: ethers.parseEther("0.08")
      }
    ];
    
    for (const event of testEvents) {
      console.log(`🎪 이벤트 생성 중: ${event.name}`);
      
      const createEventTx = await interparkAddon.createEvent(
        event.name,
        event.venue,
        event.datetime,
        event.totalTickets,
        event.ticketPrice
      );
      await createEventTx.wait();
      
      const totalEvents = await interparkAddon.getTotalEvents();
      const eventInfo = await interparkAddon.events(totalEvents);
      
      results.events.push({
        eventId: totalEvents.toString(),
        name: event.name,
        venue: event.venue,
        ticketPrice: ethers.formatEther(event.ticketPrice),
        totalTickets: event.totalTickets,
        availableTickets: event.totalTickets
      });
      
      console.log(`   ✅ 이벤트 ${totalEvents} 생성 완료: ${event.name}`);
    }
    
    // ==================== STEP 5: 테스트 티켓 구매 ====================
    console.log("\n🎫 STEP 5: 테스트 티켓 구매 중...");
    
    // 김철수 (DID 1)가 BTS 콘서트 티켓 구매
    console.log("🎫 김철수 → BTS 콘서트 티켓 구매 중...");
    const purchaseTx1 = await interparkAddon.purchaseTicket(1, 1, { 
      value: ethers.parseEther("0.1") 
    });
    await purchaseTx1.wait();
    
    const ticket1 = await interparkAddon.tickets(1);
    results.tickets.push({
      ticketId: "1",
      eventId: "1", 
      eventName: "BTS 콘서트 2024",
      owner: signers[0].address,
      ownerName: "김철수",
      didId: "1",
      seat: ticket1.seat,
      qrCode: ticket1.qrCode
    });
    
    console.log(`   ✅ 티켓 1 구매 완료: 좌석 ${ticket1.seat}`);
    
    // 이영희 (DID 2)가 IU 콘서트 티켓 구매
    if (signers.length > 1 && results.dids.length > 0) {
      console.log("🎫 이영희 → IU 콘서트 티켓 구매 중...");
      const signer1 = signers[1];
      const interparkWithSigner1 = interparkAddon.connect(signer1);
      
      const purchaseTx2 = await interparkWithSigner1.purchaseTicket(2, 2, {
        value: ethers.parseEther("0.15")
      });
      await purchaseTx2.wait();
      
      const ticket2 = await interparkAddon.tickets(2);
      results.tickets.push({
        ticketId: "2", 
        eventId: "2",
        eventName: "IU 단독 콘서트",
        owner: signer1.address,
        ownerName: "이영희",
        didId: "2",
        seat: ticket2.seat,
        qrCode: ticket2.qrCode
      });
      
      console.log(`   ✅ 티켓 2 구매 완료: 좌석 ${ticket2.seat}`);
    }
    
    // 박민수 (DID 3)가 NewJeans 팬미팅 티켓 구매
    if (signers.length > 2 && results.dids.length > 1) {
      console.log("🎫 박민수 → NewJeans 팬미팅 티켓 구매 중...");
      const signer2 = signers[2];
      const interparkWithSigner2 = interparkAddon.connect(signer2);
      
      const purchaseTx3 = await interparkWithSigner2.purchaseTicket(3, 3, {
        value: ethers.parseEther("0.08")
      });
      await purchaseTx3.wait();
      
      const ticket3 = await interparkAddon.tickets(3);
      results.tickets.push({
        ticketId: "3", 
        eventId: "3",
        eventName: "NewJeans 팬미팅",
        owner: signer2.address,
        ownerName: "박민수",
        didId: "3",
        seat: ticket3.seat,
        qrCode: ticket3.qrCode
      });
      
      console.log(`   ✅ 티켓 3 구매 완료: 좌석 ${ticket3.seat}`);
    }
    
    // ==================== STEP 6: 시스템 검증 ====================
    console.log("\n🔍 STEP 6: 시스템 검증 중...");
    
    // DID 검증
    const totalDIDs = await didRegistry.getTotalDIDs();
    console.log(`📊 총 DID 개수: ${totalDIDs}`);
    
    for (let i = 1; i <= totalDIDs; i++) {
      const isValid = await didRegistry.verifyDID(i);
      const didInfo = await didRegistry.getDID(i);
      console.log(`   DID ${i}: ${didInfo.name} - ${isValid ? '✅ 유효' : '❌ 무효'}`);
    }
    
    // 이벤트 검증
    const totalEvents = await interparkAddon.getTotalEvents();
    console.log(`🎪 총 이벤트 개수: ${totalEvents}`);
    
    for (let i = 1; i <= totalEvents; i++) {
      const eventInfo = await interparkAddon.events(i);
      console.log(`   이벤트 ${i}: ${eventInfo.name} - ${eventInfo.availableTickets}/${eventInfo.totalTickets} 티켓`);
    }
    
    // 티켓 검증
    const totalTickets = await interparkAddon.getTotalTickets();
    console.log(`🎫 총 티켓 개수: ${totalTickets}`);
    
    for (let i = 1; i <= totalTickets; i++) {
      const ticket = await interparkAddon.tickets(i);
      const isValid = await interparkAddon.verifyTicket(i);
      console.log(`   티켓 ${i}: 좌석 ${ticket.seat} - ${isValid ? '✅ 유효' : '❌ 무효'}`);
    }
    
    // ==================== 완료 ====================
    console.log("\n" + "=".repeat(80));
    console.log("🎉 NEXKEY 전체 시스템 설정 완료!");
    console.log("=".repeat(80));
    
    console.log("\n📋 배포된 컨트랙트:");
    console.log(`   🆔 DID Registry: ${results.contracts.didRegistry}`);
    console.log(`   🎫 Interpark Addon: ${results.contracts.interparkAddon}`);
    
    console.log("\n💰 ETH 분배 결과:");
    console.log(`   💸 총 분배 금액: ${results.ethDistribution.length * 5} ETH`);
    console.log(`   👥 분배 받은 계정: ${results.ethDistribution.length}개`);
    results.ethDistribution.forEach((dist, index) => {
      console.log(`   ${index + 1}. ${dist.name}: ${dist.amountSent} ETH → 잔액 ${dist.newBalance} ETH`);
    });
    
    console.log("\n👥 생성된 DID:");
    console.log(`   📊 총 개수: ${totalDIDs}개`);
    results.dids.forEach((did, index) => {
      console.log(`   ${index + 2}. ${did.name} (${did.nationality}) - DID ${did.didId} [${did.ethBalance} ETH]`);
    });
    
    console.log("\n🎪 생성된 이벤트:");
    results.events.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.name} @ ${event.venue} - ${event.ticketPrice} ETH`);
    });
    
    console.log("\n🎫 구매된 티켓:");
    results.tickets.forEach((ticket, index) => {
      console.log(`   ${index + 1}. ${ticket.eventName} - ${ticket.ownerName} (좌석: ${ticket.seat})`);
    });
    
    console.log("\n💡 사용 가능한 명령어:");
    console.log("   npm run setup              # 전체 시스템 재설정");
    console.log("   npm run test:purchase       # 티켓 구매 테스트");
    console.log("   npm run compile             # 컨트랙트 컴파일");
    
    console.log("\n🔗 유용한 정보:");
    console.log(`   체인 ID: ${network.config.chainId || 'Unknown'}`);
    console.log(`   마이너 주소: ${signers[0].address}`);
    const finalMinerBalance = await ethers.provider.getBalance(signers[0].address);
    console.log(`   마이너 최종 잔액: ${ethers.formatEther(finalMinerBalance)} ETH`);
    console.log(`   완료 시간: ${new Date().toLocaleString()}`);
    
    return results;
    
  } catch (error) {
    console.error("\n❌ 시스템 설정 실패:", error.message);
    console.error("스택 트레이스:", error.stack);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n✅ 전체 시스템 설정 스크립트 완료!");
    console.log("🎯 결과 요약:", {
      network: result.network,
      contracts: Object.keys(result.contracts).length,
      dids: result.dids.length + 1, // 마이너 포함
      events: result.events.length,
      tickets: result.tickets.length,
      ethDistributed: `${result.ethDistribution.length * 5} ETH`
    });
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 스크립트 실행 실패:", error);
    process.exit(1);
  }); 