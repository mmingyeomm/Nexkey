const { ethers, network } = require("hardhat");

async function main() {
  console.log("🎫 Interpark Ticket Addon 배포 시작...");
  
  try {
    // 배포자 계정 정보
    const [deployer] = await ethers.getSigners();
    console.log("배포 계정:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("계정 잔액:", ethers.formatEther(balance), "ETH");
    
    // 네트워크별 DID Registry 주소 설정
    let DID_REGISTRY_ADDRESS;
    if (network.name === "render") {
      DID_REGISTRY_ADDRESS = "0xa50a51c09a5c451C52BB714527E1974b686D8e77"; // Render 배포 주소
    } else {
      DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e"; // 로컬 배포 주소
    }
    
    console.log("네트워크:", network.name);
    console.log("참조할 DID Registry 주소:", DID_REGISTRY_ADDRESS);
    
    // DID Registry 연결 확인
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    console.log("DID Registry 연결 확인 중...");
    const totalDIDs = await didRegistry.getTotalDIDs();
    console.log("기존 DID 개수:", totalDIDs.toString());
    
    // Interpark Ticket Addon 배포
    console.log("\n🏢 Interpark Ticket Addon 배포 중...");
    const InterparkTicketAddon = await ethers.getContractFactory("InterparkTicketAddon");
    const interparkAddon = await InterparkTicketAddon.deploy(DID_REGISTRY_ADDRESS);
    
    await interparkAddon.waitForDeployment();
    const addonAddress = await interparkAddon.getAddress();
    
    console.log("✅ Interpark Ticket Addon 배포 완료!");
    console.log("컨트랙트 주소:", addonAddress);
    console.log("트랜잭션 해시:", interparkAddon.deploymentTransaction().hash);
    
    // 테스트 이벤트 생성
    console.log("\n🎪 테스트 이벤트 생성 중...");
    
    const testEvent = {
      eventName: "BTS 콘서트 2024 (Render)",
      venue: "잠실 종합운동장",
      eventDate: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30일 후
      ticketPrice: ethers.parseEther("0.1"), // 0.1 ETH
      totalTickets: 1000
    };
    
    const createEventTx = await interparkAddon.createEvent(
      testEvent.eventName,
      testEvent.venue,
      testEvent.eventDate,
      testEvent.ticketPrice,
      testEvent.totalTickets
    );
    
    await createEventTx.wait();
    console.log("✅ 테스트 이벤트 생성 완료!");
    console.log("이벤트 생성 트랜잭션:", createEventTx.hash);
    
    // 생성된 이벤트 정보 조회 (직접 contract call 사용)
    try {
      const eventInfo = await interparkAddon.events(1); // mapping을 직접 호출
      console.log("\n📅 생성된 이벤트 정보:");
      console.log("- 이벤트 ID:", eventInfo.eventId.toString());
      console.log("- 이벤트명:", eventInfo.eventName);
      console.log("- 장소:", eventInfo.venue);
      console.log("- 날짜:", new Date(Number(eventInfo.eventDate) * 1000).toLocaleString());
      console.log("- 티켓 가격:", ethers.formatEther(eventInfo.ticketPrice), "ETH");
      console.log("- 총 티켓 수:", eventInfo.totalTickets.toString());
      console.log("- 판매된 티켓:", eventInfo.soldTickets.toString());
      console.log("- 활성 상태:", eventInfo.isActive);
      console.log("- 주최자:", eventInfo.organizer);
    } catch (eventError) {
      console.log("⚠️ 이벤트 정보 조회 중 오류:", eventError.message);
      console.log("이벤트는 성공적으로 생성되었습니다.");
    }
    
    // DID 검증 기능 테스트
    console.log("\n🔍 DID 연동 기능 테스트 중...");
    
    // 기존 DID 정보 조회 (DID ID 1 사용)
    try {
      const didInfo = await didRegistry.getDID(1);
      console.log("연동할 DID 정보:");
      console.log("- DID ID:", didInfo.id.toString());
      console.log("- DID 식별자:", didInfo.didIdentifier);
      console.log("- 소유자:", didInfo.owner);
      console.log("- 이름:", didInfo.name);
      console.log("- 상태:", didInfo.status === 0 ? "ACTIVE" : "INACTIVE");
      
      const didRegistryFromAddon = await interparkAddon.didRegistry();
      console.log("- 애드온에서 참조하는 DID Registry:", didRegistryFromAddon);
      
      const isValidDID = await didRegistry.verifyDID(1);
      console.log("- DID 유효성:", isValidDID ? "✅ 유효" : "❌ 무효");
      
    } catch (error) {
      console.log("⚠️ 기존 DID가 없습니다. 먼저 DID를 생성해주세요.");
    }
    
    console.log("\n🎯 티켓 구매 시나리오:");
    console.log("1. 사용자가 유효한 DID를 가지고 있어야 함");
    console.log("2. purchaseTicket() 함수에서 DID 검증");
    console.log("3. DID 소유권 확인 후 티켓 발급");
    console.log("4. 티켓에 QR 코드 해시 생성");
    console.log("5. 입장 시 QR 코드로 검증");
    
    console.log("\n💡 테스트 예시 명령어:");
    console.log("// 티켓 구매 (DID ID 1을 사용하여)");
    console.log("await interparkAddon.purchaseTicket(1, 1, 'A-1', { value: ethers.parseEther('0.1') });");
    
    console.log("\n🎉 배포 및 테스트 완료!");
    console.log("=".repeat(60));
    console.log("🏢 Interpark Ticket Addon 주소:", addonAddress);
    console.log("🆔 DID Registry 주소:", DID_REGISTRY_ADDRESS);
    console.log("🌐 네트워크:", network.name);
    console.log("🎪 테스트 이벤트 ID: 1");
    console.log("=".repeat(60));
    
    return {
      addonAddress,
      didRegistryAddress: DID_REGISTRY_ADDRESS,
      deploymentHash: interparkAddon.deploymentTransaction().hash,
      testEventId: 1,
      network: network.name
    };
    
  } catch (error) {
    console.error("❌ 배포 실패:", error.message);
    if (error.message.includes("DID does not exist")) {
      console.log("\n💡 해결 방법:");
      console.log("1. 먼저 DID Registry에서 DID를 생성하세요:");
      console.log("   npx hardhat run scripts/deployDID.js --network", network.name);
      console.log("2. 그 다음 Interpark Addon을 배포하세요.");
    }
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