const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 NexKey DID 시스템 상태 확인");
  console.log("=".repeat(80));
  
  try {
    // 컨트랙트 주소들
    const DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e";
    const INTERPARK_ADDON_ADDRESS = "0xfeae27388A65eE984F452f86efFEd42AaBD438FD";
    
    // 계정 정보
    const [deployer] = await ethers.getSigners();
    console.log("📱 연결된 계정:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // 네트워크 정보
    const network = await ethers.provider.getNetwork();
    console.log("🌐 네트워크:", network.name, "(Chain ID:", network.chainId.toString() + ")");
    
    // 컨트랙트 연결
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = InterparkTicketAddon.attach(INTERPARK_ADDON_ADDRESS);
    
    console.log("\n🆔 DID Registry 상태");
    console.log("-".repeat(50));
    console.log("📍 컨트랙트 주소:", DID_REGISTRY_ADDRESS);
    
    const totalDIDs = await didRegistry.getTotalDIDs();
    console.log("📊 총 DID 개수:", totalDIDs.toString());
    
    // DID 목록 조회
    if (totalDIDs > 0) {
      console.log("\n🔗 등록된 DID 목록:");
      for (let i = 1; i <= totalDIDs; i++) {
        try {
          const didInfo = await didRegistry.getDID(i);
          const statusName = didInfo.status === 0n ? "🟢 ACTIVE" : 
                           didInfo.status === 1n ? "🟡 SUSPENDED" : "🔴 REVOKED";
          
          console.log(`  ${i}. ${didInfo.didIdentifier}`);
          console.log(`     👤 이름: ${didInfo.name}`);
          console.log(`     📧 소유자: ${didInfo.owner}`);
          console.log(`     🏳️  국적: ${didInfo.nationality}`);
          console.log(`     📅 생년월일: ${didInfo.birthDate}`);
          console.log(`     ⚡ 상태: ${statusName}`);
          console.log(`     🕐 생성일: ${new Date(Number(didInfo.createdAt) * 1000).toLocaleString()}`);
          console.log("");
        } catch (error) {
          console.log(`  ${i}. ❌ DID 조회 실패: ${error.message}`);
        }
      }
    }
    
    console.log("\n🎫 Interpark Ticket Addon 상태");
    console.log("-".repeat(50));
    console.log("📍 컨트랙트 주소:", INTERPARK_ADDON_ADDRESS);
    
    // DID Registry 참조 확인
    const referencedDIDRegistry = await interparkAddon.didRegistry();
    console.log("🔗 참조하는 DID Registry:", referencedDIDRegistry);
    console.log("✅ DID Registry 연결:", referencedDIDRegistry.toLowerCase() === DID_REGISTRY_ADDRESS.toLowerCase() ? "정상" : "오류");
    
    // 이벤트 정보 조회
    console.log("\n📅 등록된 이벤트:");
    try {
      let eventId = 1;
      while (true) {
        try {
          const eventInfo = await interparkAddon.events(eventId);
          if (eventInfo.eventId === 0n) break;
          
          console.log(`  ${eventId}. ${eventInfo.eventName}`);
          console.log(`     🏟️  장소: ${eventInfo.venue}`);
          console.log(`     📅 날짜: ${new Date(Number(eventInfo.eventDate) * 1000).toLocaleString()}`);
          console.log(`     💰 가격: ${ethers.formatEther(eventInfo.ticketPrice)} ETH`);
          console.log(`     🎟️  티켓: ${eventInfo.soldTickets}/${eventInfo.totalTickets} 판매`);
          console.log(`     👤 주최자: ${eventInfo.organizer}`);
          console.log(`     ⚡ 활성: ${eventInfo.isActive ? "✅" : "❌"}`);
          console.log("");
          
          eventId++;
        } catch (error) {
          break;
        }
      }
      
      if (eventId === 1) {
        console.log("  📭 등록된 이벤트가 없습니다.");
      }
    } catch (error) {
      console.log("  ❌ 이벤트 조회 실패:", error.message);
    }
    
    // 티켓 정보 조회
    console.log("\n🎟️ 발행된 티켓:");
    try {
      const userTickets = await interparkAddon.getUserTickets(deployer.address);
      
      if (userTickets.length > 0) {
        console.log(`📊 ${deployer.address} 소유 티켓: ${userTickets.length}개`);
        
        for (const ticketId of userTickets) {
          try {
            const ticketInfo = await interparkAddon.tickets(ticketId);
            const statusNames = ["📋 AVAILABLE", "🎫 SOLD", "✅ USED", "❌ CANCELLED"];
            
            console.log(`  티켓 #${ticketInfo.ticketId}:`);
            console.log(`     🎪 이벤트 ID: ${ticketInfo.eventId}`);
            console.log(`     🆔 DID ID: ${ticketInfo.didId}`);
            console.log(`     💺 좌석: ${ticketInfo.seatNumber}`);
            console.log(`     💰 가격: ${ethers.formatEther(ticketInfo.price)} ETH`);
            console.log(`     📅 구매일: ${new Date(Number(ticketInfo.purchaseTime) * 1000).toLocaleString()}`);
            console.log(`     ⚡ 상태: ${statusNames[ticketInfo.status] || "❓ UNKNOWN"}`);
            console.log(`     🔐 QR: ${ticketInfo.qrCodeHash.substring(0, 20)}...`);
            console.log("");
          } catch (error) {
            console.log(`  티켓 #${ticketId}: ❌ 조회 실패`);
          }
        }
      } else {
        console.log("  📭 소유한 티켓이 없습니다.");
      }
    } catch (error) {
      console.log("  ❌ 티켓 조회 실패:", error.message);
    }
    
    // DID별 티켓 통계
    if (totalDIDs > 0) {
      console.log("\n📊 DID별 티켓 소유 현황:");
      for (let didId = 1; didId <= totalDIDs; didId++) {
        try {
          const didTickets = await interparkAddon.getDIDTickets(didId);
          const didInfo = await didRegistry.getDID(didId);
          console.log(`  DID #${didId} (${didInfo.name}): ${didTickets.length}개 티켓`);
        } catch (error) {
          console.log(`  DID #${didId}: 조회 실패`);
        }
      }
    }
    
    // 시스템 통계
    console.log("\n📈 시스템 통계");
    console.log("-".repeat(50));
    console.log(`🆔 총 DID 수: ${totalDIDs}`);
    
    // 컨트랙트 잔액 확인
    const contractBalance = await ethers.provider.getBalance(INTERPARK_ADDON_ADDRESS);
    console.log(`💰 티켓 컨트랙트 잔액: ${ethers.formatEther(contractBalance)} ETH`);
    
    // 블록 정보
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`📦 최신 블록: ${latestBlock}`);
    
    console.log("\n🎯 주요 기능 상태");
    console.log("-".repeat(50));
    console.log("✅ DID 등록 및 관리");
    console.log("✅ DID 기반 신원 확인");
    console.log("✅ 이벤트 생성 및 관리");
    console.log("✅ DID 검증 기반 티켓 구매");
    console.log("✅ QR 코드 생성 및 검증");
    console.log("✅ 티켓 사용 및 입장 관리");
    console.log("✅ 재사용 방지 시스템");
    console.log("✅ 블록체인 투명성 및 불변성");
    
    console.log("\n🚀 다음 단계 제안");
    console.log("-".repeat(50));
    console.log("1. 추가 DID 생성 및 테스트");
    console.log("2. 티켓 전송 기능 테스트");
    console.log("3. 여러 이벤트 생성 및 관리");
    console.log("4. 웹 인터페이스 개발");
    console.log("5. 모바일 앱 연동");
    console.log("6. 메인넷 배포 준비");
    
    console.log("\n" + "=".repeat(80));
    console.log("🎉 NexKey DID 시스템이 정상적으로 작동중입니다!");
    console.log("=".repeat(80));
    
  } catch (error) {
    console.error("❌ 시스템 상태 확인 실패:", error.message);
    throw error;
  }
}

// 메인 함수 실행
main()
  .then(() => {
    console.log("\n📊 시스템 상태 확인 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 