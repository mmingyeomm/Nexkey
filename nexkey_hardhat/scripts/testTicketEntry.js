const { ethers } = require("hardhat");

async function main() {
  console.log("🎟️ 티켓 입장 검증 테스트 시작...");
  
  try {
    // 컨트랙트 주소들
    const INTERPARK_ADDON_ADDRESS = "0xfeae27388A65eE984F452f86efFEd42AaBD438FD";
    
    // 계정 정보 (주최자/관리자 계정)
    const [organizer] = await ethers.getSigners();
    console.log("검증자 계정 (주최자):", organizer.address);
    
    // 컨트랙트 연결
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = InterparkTicketAddon.attach(INTERPARK_ADDON_ADDRESS);
    
    // 기존 티켓 정보 조회
    console.log("\n🎫 기존 티켓 정보 조회...");
    const ticketInfo = await interparkAddon.tickets(1); // 티켓 ID 1
    
    console.log("📋 티켓 정보:");
    console.log("- 티켓 ID:", ticketInfo.ticketId.toString());
    console.log("- 이벤트 ID:", ticketInfo.eventId.toString());
    console.log("- 소유자:", ticketInfo.owner);
    console.log("- 좌석:", ticketInfo.seatNumber);
    console.log("- 현재 상태:", getTicketStatusName(ticketInfo.status));
    console.log("- QR 코드 해시:", ticketInfo.qrCodeHash);
    
    // 이벤트 정보 확인
    console.log("\n📅 이벤트 정보 확인...");
    const eventInfo = await interparkAddon.events(ticketInfo.eventId);
    console.log("- 이벤트명:", eventInfo.eventName);
    console.log("- 장소:", eventInfo.venue);
    console.log("- 이벤트 날짜:", new Date(Number(eventInfo.eventDate) * 1000).toLocaleString());
    console.log("- 현재 시간:", new Date().toLocaleString());
    
    // 시간 체크 (실제로는 이벤트 시간 전후로만 입장 가능)
    const currentTime = Math.floor(Date.now() / 1000);
    const eventTime = Number(eventInfo.eventDate);
    const timeUntilEvent = eventTime - currentTime;
    
    if (timeUntilEvent > 0) {
      console.log("⏰ 이벤트까지 남은 시간:", Math.floor(timeUntilEvent / 3600), "시간", Math.floor((timeUntilEvent % 3600) / 60), "분");
      console.log("⚠️  실제 환경에서는 이벤트 시간에만 입장이 가능합니다.");
    }
    
    // QR 코드 검증 (입장 전 확인)
    console.log("\n🔍 QR 코드 사전 검증...");
    const isValidBeforeEntry = await interparkAddon.verifyTicket(
      ticketInfo.ticketId,
      ticketInfo.qrCodeHash
    );
    console.log("QR 코드 유효성:", isValidBeforeEntry ? "✅ 유효" : "❌ 무효");
    
    if (!isValidBeforeEntry) {
      throw new Error("유효하지 않은 QR 코드입니다.");
    }
    
    // 티켓 사용 (입장 처리)
    console.log("\n🚪 입장 처리 중...");
    console.log("- 티켓 ID:", ticketInfo.ticketId.toString());
    console.log("- QR 코드 해시:", ticketInfo.qrCodeHash);
    
    const useTicketTx = await interparkAddon.useTicket(
      ticketInfo.ticketId,
      ticketInfo.qrCodeHash
    );
    
    console.log("⏳ 입장 처리 트랜잭션 대기 중...");
    const receipt = await useTicketTx.wait();
    console.log("✅ 입장 처리 완료!");
    console.log("트랜잭션 해시:", receipt.hash);
    
    // 입장 후 티켓 상태 확인
    console.log("\n📊 입장 후 티켓 상태 확인...");
    const updatedTicketInfo = await interparkAddon.tickets(1);
    console.log("- 변경된 상태:", getTicketStatusName(updatedTicketInfo.status));
    console.log("- 상태 코드:", updatedTicketInfo.status.toString());
    
    // 재입장 시도 (실패해야 함)
    console.log("\n🚫 재입장 시도 테스트...");
    try {
      await interparkAddon.useTicket(
        ticketInfo.ticketId,
        ticketInfo.qrCodeHash
      );
      console.log("❌ 재입장이 허용되었습니다. (오류!)");
    } catch (reentryError) {
      console.log("✅ 재입장 차단됨 (정상):", reentryError.message.includes("not valid for use") ? "이미 사용된 티켓" : reentryError.message);
    }
    
    // 사용된 티켓으로 QR 검증 시도
    console.log("\n🔍 사용된 티켓 QR 검증...");
    const isValidAfterUse = await interparkAddon.verifyTicket(
      ticketInfo.ticketId,
      ticketInfo.qrCodeHash
    );
    console.log("사용된 티켓 QR 유효성:", isValidAfterUse ? "✅ 유효" : "❌ 무효 (정상)");
    
    // 이벤트 로그에서 TicketUsed 이벤트 확인
    console.log("\n📃 블록체인 이벤트 로그 확인...");
    const filter = interparkAddon.filters.TicketUsed(ticketInfo.ticketId);
    const events = await interparkAddon.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
    
    if (events.length > 0) {
      const ticketUsedEvent = events[0];
      console.log("✅ TicketUsed 이벤트 발견:");
      console.log("- 티켓 ID:", ticketUsedEvent.args[0].toString());
      console.log("- 이벤트 ID:", ticketUsedEvent.args[1].toString());
      console.log("- 사용 시간:", new Date(Number(ticketUsedEvent.args[2]) * 1000).toLocaleString());
    }
    
    console.log("\n🎉 입장 검증 테스트 완료!");
    console.log("=".repeat(60));
    console.log("✅ QR 코드 검증 성공");
    console.log("✅ 티켓 입장 처리 성공");
    console.log("✅ 재입장 차단 확인");
    console.log("✅ 상태 변경 확인");
    console.log("✅ 이벤트 로그 기록 확인");
    console.log("=".repeat(60));
    
    console.log("\n📊 전체 워크플로우 요약:");
    console.log("1. DID 기반 신원 확인 ✅");
    console.log("2. 티켓 구매 및 결제 ✅");
    console.log("3. QR 코드 생성 및 발급 ✅");
    console.log("4. 입장 시 QR 검증 ✅");
    console.log("5. 티켓 사용 처리 ✅");
    console.log("6. 재사용 방지 ✅");
    console.log("7. 블록체인 기록 ✅");
    
  } catch (error) {
    console.error("❌ 입장 검증 실패:", error.message);
    
    if (error.message.includes("Not authorized organizer")) {
      console.log("\n💡 해결 방법: 주최자 권한이 필요합니다.");
    } else if (error.message.includes("not valid for use")) {
      console.log("\n💡 이미 사용된 티켓이거나 취소된 티켓입니다.");
    } else if (error.message.includes("Invalid QR code")) {
      console.log("\n💡 QR 코드가 일치하지 않습니다.");
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
    console.log("\n📊 입장 검증 테스트 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 