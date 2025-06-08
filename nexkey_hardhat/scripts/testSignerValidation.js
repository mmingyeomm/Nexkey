const { ethers } = require("hardhat");

async function main() {
  console.log("🔐 DID 서명자 검증 테스트 시작...");
  
  try {
    // 컨트랙트 주소들
    const DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e";
    const INTERPARK_ADDON_ADDRESS = "0x686AfD6e502A81D2e77f2e038A23C0dEf4949A20"; // 새로 배포된 주소
    
    // 계정 정보
    const [signer] = await ethers.getSigners();
    console.log("트랜잭션 서명자:", signer.address);
    
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // 컨트랙트 연결
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = InterparkTicketAddon.attach(INTERPARK_ADDON_ADDRESS);
    
    console.log("\n🆔 DID 정보 확인...");
    const didInfo = await didRegistry.getDID(1);
    console.log("- DID ID: 1");
    console.log("- DID Registry에서 조회된 소유자:", didInfo.owner);
    console.log("- 현재 트랜잭션 서명자:", signer.address);
    console.log("- 소유자 일치:", didInfo.owner.toLowerCase() === signer.address.toLowerCase() ? "✅ YES" : "❌ NO");
    console.log("- DID 상태:", didInfo.status === 0n ? "🟢 ACTIVE" : "🔴 INACTIVE");
    
    // DID 상태 활성화 (필요한 경우)
    if (didInfo.status !== 0n) {
      console.log("\n⚠️ DID 비활성 상태 - 활성화 중...");
      const activateTx = await didRegistry.changeDIDStatus(1, 0); // 0 = ACTIVE
      await activateTx.wait();
      console.log("✅ DID 활성화 완료!");
    }
    
    console.log("\n🔍 새로운 서명자 검증 함수 테스트...");
    
    // 1. 현재 서명자가 DID 소유자인지 검증
    const isSignerOwner = await interparkAddon.validateSignerIsDIDOwner(1);
    console.log("validateSignerIsDIDOwner(1):", isSignerOwner ? "✅ TRUE" : "❌ FALSE");
    
    // 2. 특정 주소가 DID 소유자인지 검증
    const isAddressOwner = await interparkAddon.validateAddressIsDIDOwner(1, signer.address);
    console.log("validateAddressIsDIDOwner(1, signer.address):", isAddressOwner ? "✅ TRUE" : "❌ FALSE");
    
    // 3. 잘못된 주소로 테스트
    const randomAddress = "0x0000000000000000000000000000000000000001";
    const isRandomOwner = await interparkAddon.validateAddressIsDIDOwner(1, randomAddress);
    console.log("validateAddressIsDIDOwner(1, randomAddress):", isRandomOwner ? "❌ TRUE (오류!)" : "✅ FALSE (정상)");
    
    console.log("\n🎫 개선된 티켓 구매 테스트...");
    console.log("서명자 검증이 modifier 레벨에서 수행되는지 확인...");
    
    // 이벤트 정보 확인
    const eventInfo = await interparkAddon.events(1);
    console.log("- 이벤트명:", eventInfo.eventName);
    console.log("- 티켓 가격:", ethers.formatEther(eventInfo.ticketPrice), "ETH");
    
    // 티켓 구매 (새로운 modifier가 서명자를 자동 검증)
    console.log("\n🛒 티켓 구매 실행...");
    console.log("onlyValidDIDOwner modifier가 다음을 검증합니다:");
    console.log("1. didRegistry.verifyDID(1) - DID 존재 및 활성 상태");
    console.log("2. didDoc.owner == msg.sender - 서명자가 DID 소유자인지");
    console.log("3. didDoc.status == ACTIVE - DID 활성 상태 재확인");
    
    const purchaseTx = await interparkAddon.purchaseTicket(
      1,                                    // 이벤트 ID
      1,                                    // DID ID
      "A-1",                               // 좌석 번호
      { value: eventInfo.ticketPrice }     // 티켓 가격
    );
    
    console.log("⏳ 트랜잭션 처리 중...");
    const receipt = await purchaseTx.wait();
    console.log("✅ 티켓 구매 성공!");
    console.log("트랜잭션 해시:", receipt.hash);
    
    // 구매된 티켓 정보 확인
    console.log("\n🎟️ 구매된 티켓 검증...");
    const userTickets = await interparkAddon.getUserTickets(signer.address);
    console.log("사용자 소유 티켓 수:", userTickets.length);
    
    if (userTickets.length > 0) {
      const latestTicketId = userTickets[userTickets.length - 1];
      const ticketInfo = await interparkAddon.tickets(latestTicketId);
      
      console.log("- 티켓 ID:", ticketInfo.ticketId.toString());
      console.log("- 연결된 DID ID:", ticketInfo.didId.toString());
      console.log("- 티켓 소유자:", ticketInfo.owner);
      console.log("- 서명자와 일치:", ticketInfo.owner.toLowerCase() === signer.address.toLowerCase() ? "✅ YES" : "❌ NO");
      console.log("- 좌석:", ticketInfo.seatNumber);
      console.log("- 상태:", ["AVAILABLE", "SOLD", "USED", "CANCELLED"][ticketInfo.status]);
    }
    
    console.log("\n🎯 서명자 검증 개선 사항 요약:");
    console.log("=".repeat(60));
    console.log("✅ Contract-level validation in modifiers");
    console.log("✅ Direct cross-contract DID Registry queries");
    console.log("✅ Explicit signer (msg.sender) ownership verification");
    console.log("✅ Atomic validation - all checks in one place");
    console.log("✅ Gas efficient - single validation point");
    console.log("✅ Security enhanced - no local state assumptions");
    console.log("=".repeat(60));
    
    console.log("\n🔐 검증 플로우:");
    console.log("1. 트랜잭션 서명자 = msg.sender");
    console.log("2. DID Registry.getDID() → DID 문서 조회");
    console.log("3. didDoc.owner == msg.sender 검증");
    console.log("4. 검증 성공 시에만 함수 실행");
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
    
    if (error.message.includes("Transaction signer is not the DID owner")) {
      console.log("\n💡 서명자가 DID 소유자가 아닙니다!");
      console.log("검증이 올바르게 작동하고 있습니다.");
    } else if (error.message.includes("Invalid or inactive DID")) {
      console.log("\n💡 DID가 유효하지 않거나 비활성 상태입니다.");
    }
    
    throw error;
  }
}

// 메인 함수 실행
main()
  .then(() => {
    console.log("\n📊 서명자 검증 테스트 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 