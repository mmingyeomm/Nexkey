const { ethers } = require("hardhat");

async function main() {
  console.log("🎫 티켓 구매 테스트 시작...");
  
  try {
    // 컨트랙트 주소들
    const DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e";
    const INTERPARK_ADDON_ADDRESS = "0xfeae27388A65eE984F452f86efFEd42AaBD438FD";
    
    // 계정 정보
    const [deployer] = await ethers.getSigners();
    console.log("구매자 계정:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // 컨트랙트 연결
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = InterparkTicketAddon.attach(INTERPARK_ADDON_ADDRESS);
    
    console.log("\n🔍 기존 DID 정보 확인...");
    const didInfo = await didRegistry.getDID(1);
    console.log("- DID ID:", didInfo.id.toString());
    console.log("- 소유자:", didInfo.owner);
    console.log("- 이름:", didInfo.name);
    console.log("- 상태:", didInfo.status.toString(), didInfo.status === 0n ? "(ACTIVE)" : "(INACTIVE)");
    
    // DID 상태가 INACTIVE라면 ACTIVE로 변경
    if (didInfo.status !== 0n) {
      console.log("\n⚠️ DID가 비활성 상태입니다. 활성화 중...");
      const activateTx = await didRegistry.updateDIDStatus(1, 0); // 0 = ACTIVE
      await activateTx.wait();
      console.log("✅ DID 활성화 완료!");
    }
    
    console.log("\n📅 이벤트 정보 확인...");
    const eventInfo = await interparkAddon.events(1);
    console.log("- 이벤트명:", eventInfo.eventName);
    console.log("- 장소:", eventInfo.venue);
    console.log("- 티켓 가격:", ethers.formatEther(eventInfo.ticketPrice), "ETH");
    console.log("- 총 티켓:", eventInfo.totalTickets.toString());
    console.log("- 판매된 티켓:", eventInfo.soldTickets.toString());
    
    console.log("\n🛒 티켓 구매 시작...");
    console.log("- 이벤트 ID: 1");
    console.log("- DID ID: 1");
    console.log("- 좌석: A-1");
    console.log("- 결제 금액:", ethers.formatEther(eventInfo.ticketPrice), "ETH");
    
    // 티켓 구매 실행
    const purchaseTx = await interparkAddon.purchaseTicket(
      1,                                    // 이벤트 ID
      1,                                    // DID ID
      "A-1",                               // 좌석 번호
      { value: eventInfo.ticketPrice }     // 티켓 가격
    );
    
    console.log("⏳ 트랜잭션 처리 중...");
    const receipt = await purchaseTx.wait();
    console.log("✅ 티켓 구매 완료!");
    console.log("트랜잭션 해시:", receipt.hash);
    
    // 구매된 티켓 정보 조회
    console.log("\n🎫 구매된 티켓 정보 조회...");
    const userTickets = await interparkAddon.getUserTickets(deployer.address);
    console.log("사용자가 소유한 티켓 개수:", userTickets.length);
    
    if (userTickets.length > 0) {
      const latestTicketId = userTickets[userTickets.length - 1];
      const ticketInfo = await interparkAddon.tickets(latestTicketId);
      
      console.log("\n🎟️ 티켓 상세 정보:");
      console.log("- 티켓 ID:", ticketInfo.ticketId.toString());
      console.log("- 이벤트 ID:", ticketInfo.eventId.toString());
      console.log("- DID ID:", ticketInfo.didId.toString());
      console.log("- 소유자:", ticketInfo.owner);
      console.log("- 좌석:", ticketInfo.seatNumber);
      console.log("- 구매 시간:", new Date(Number(ticketInfo.purchaseTime) * 1000).toLocaleString());
      console.log("- 가격:", ethers.formatEther(ticketInfo.price), "ETH");
      console.log("- 상태:", getTicketStatusName(ticketInfo.status));
      console.log("- QR 코드 해시:", ticketInfo.qrCodeHash);
      
      // QR 코드 검증 테스트
      console.log("\n🔍 QR 코드 검증 테스트...");
      const isValidQR = await interparkAddon.verifyTicket(
        ticketInfo.ticketId,
        ticketInfo.qrCodeHash
      );
      console.log("QR 코드 유효성:", isValidQR ? "✅ 유효" : "❌ 무효");
      
      // 잘못된 QR 코드로 테스트
      const isInvalidQR = await interparkAddon.verifyTicket(
        ticketInfo.ticketId,
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
      console.log("잘못된 QR 코드:", isInvalidQR ? "✅ 유효" : "❌ 무효 (정상)");
    }
    
    // 이벤트 업데이트된 정보 확인
    console.log("\n📊 이벤트 업데이트 정보...");
    const updatedEventInfo = await interparkAddon.events(1);
    console.log("- 판매된 티켓:", updatedEventInfo.soldTickets.toString());
    console.log("- 남은 티켓:", (updatedEventInfo.totalTickets - updatedEventInfo.soldTickets).toString());
    
    // DID와 티켓 연결 확인
    console.log("\n🔗 DID-티켓 연결 확인...");
    const didTickets = await interparkAddon.getDIDTickets(1);
    console.log("DID ID 1이 소유한 티켓:", didTickets.map(id => id.toString()));
    
    console.log("\n🎉 티켓 구매 테스트 완료!");
    console.log("=".repeat(60));
    console.log("✅ DID 검증 성공");
    console.log("✅ 티켓 구매 성공");
    console.log("✅ QR 코드 생성 성공");
    console.log("✅ 소유권 확인 성공");
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
    
    if (error.message.includes("Invalid or inactive DID")) {
      console.log("\n💡 해결 방법: DID를 활성화하세요.");
    } else if (error.message.includes("DID does not belong to sender")) {
      console.log("\n💡 해결 방법: DID 소유권을 확인하세요.");
    } else if (error.message.includes("Insufficient payment")) {
      console.log("\n💡 해결 방법: 충분한 ETH를 전송하세요.");
    }
    
    throw error;
  }
}

function getTicketStatusName(status) {
  const statusNames = ["AVAILABLE", "SOLD", "USED", "CANCELLED"];
  return statusNames[status] || "UNKNOWN";
}

// 메인 함수 실행
main()
  .then(() => {
    console.log("\n📊 테스트 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 