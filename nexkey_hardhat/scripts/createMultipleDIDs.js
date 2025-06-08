const { ethers, network } = require("hardhat");

async function main() {
  console.log(`🆔 ${network.name} 네트워크에서 다중 DID 생성 시작...\n`);
  
  try {
    // 네트워크별 DID Registry 주소 설정
    let DID_REGISTRY_ADDRESS;
    if (network.name === "render") {
      DID_REGISTRY_ADDRESS = "0xBF921f94Fd9eF1738bE25D8CeCFDFE2C822c81B0"; // Render 배포 주소
    } else {
      DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e"; // 로컬 배포 주소
    }
    
    console.log("🌐 네트워크:", network.name);
    console.log("📍 DID Registry 주소:", DID_REGISTRY_ADDRESS);
    
    // DID Registry 컨트랙트 연결
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    // 모든 계정 가져오기
    const signers = await ethers.getSigners();
    console.log(`👥 사용 가능한 계정: ${signers.length}개\n`);
    
    // 다양한 사용자 프로필 정의
    const userProfiles = [
      {
        accountIndex: 0,
        name: "김철수",
        birthDate: "1990-05-15",
        nationality: "Korean",
        idCardNumber: "KR1990051500001",
        description: "기존 마이너 계정 (이미 가입됨)"
      },
      {
        accountIndex: 1,
        name: "이영희",
        birthDate: "1992-08-22",
        nationality: "Korean",
        idCardNumber: "KR1992082200002",
        description: "일반 사용자 1"
      },
      {
        accountIndex: 2,
        name: "박민수",
        birthDate: "1988-12-03",
        nationality: "Korean", 
        idCardNumber: "KR1988120300003",
        description: "일반 사용자 2"
      },
      {
        accountIndex: 3,
        name: "최지은",
        birthDate: "1995-03-17",
        nationality: "Korean",
        idCardNumber: "KR1995031700004",
        description: "일반 사용자 3"
      },
      {
        accountIndex: 4,
        name: "John Smith",
        birthDate: "1987-07-10",
        nationality: "American",
        idCardNumber: "US1987071000005",
        description: "외국인 사용자 1"
      },
      {
        accountIndex: 5,
        name: "Emma Johnson",
        birthDate: "1993-11-28",
        nationality: "British",
        idCardNumber: "UK1993112800006",
        description: "외국인 사용자 2"
      },
      {
        accountIndex: 6,
        name: "田中太郎",
        birthDate: "1991-04-05",
        nationality: "Japanese",
        idCardNumber: "JP1991040500007",
        description: "일본인 사용자"
      },
      {
        accountIndex: 7,
        name: "Marie Dubois",
        birthDate: "1989-09-14",
        nationality: "French",
        idCardNumber: "FR1989091400008",
        description: "프랑스인 사용자"
      },
      {
        accountIndex: 8,
        name: "Carlos Rodriguez",
        birthDate: "1994-01-20",
        nationality: "Spanish",
        idCardNumber: "ES1994012000009",
        description: "스페인인 사용자"
      },
      {
        accountIndex: 9,
        name: "Anna Müller",
        birthDate: "1986-06-30",
        nationality: "German",
        idCardNumber: "DE1986063000010",
        description: "독일인 사용자"
      }
    ];
    
    // 기존 DID 개수 확인
    const totalDIDsBefore = await didRegistry.getTotalDIDs();
    console.log(`📊 기존 DID 개수: ${totalDIDsBefore}개\n`);
    
    const createdDIDs = [];
    
    // 각 계정으로 DID 생성 (계정 0은 이미 있으므로 1부터 시작)
    // 단, 계정 0(마이너)만 authorizedIssuer이므로 계정 0으로 다른 사용자들의 DID를 생성
    const issuerSigner = signers[0]; // 마이너 계정이 발급기관
    const didRegistryWithIssuer = didRegistry.connect(issuerSigner);
    
    for (let i = 1; i < Math.min(userProfiles.length, signers.length); i++) {
      const profile = userProfiles[i];
      const targetSigner = signers[i]; // DID 소유자가 될 계정
      
      console.log(`🆔 계정 ${i}의 DID 생성 중...`);
      console.log(`   소유자 주소: ${targetSigner.address}`);
      console.log(`   사용자명: ${profile.name}`);
      console.log(`   생년월일: ${profile.birthDate}`);
      console.log(`   국적: ${profile.nationality}`);
      console.log(`   신분증 번호: ${profile.idCardNumber}`);
      console.log(`   설명: ${profile.description}`);
      
      try {
        // DID 생성 (마이너 계정이 다른 사용자들을 위해 발급)
        const createTx = await didRegistryWithIssuer.createDID(
          targetSigner.address,    // _owner: DID 소유자
          profile.name,            // _name: 이름
          profile.birthDate,       // _birthDate: 생년월일
          profile.nationality,     // _nationality: 국적
          profile.idCardNumber,    // _idCardNumber: 신분증 번호
          "",                      // _profileImageHash: 프로필 이미지 해시 (빈 값)
          ""                       // _metadataURI: 메타데이터 URI (빈 값)
        );
        
        console.log(`   트랜잭션 해시: ${createTx.hash}`);
        
        // 트랜잭션 완료 대기
        const receipt = await createTx.wait();
        console.log(`   ✅ DID 생성 완료! 블록: ${receipt.blockNumber}`);
        
        // 생성된 DID 정보 조회
        const totalDIDsAfter = await didRegistry.getTotalDIDs();
        const didId = totalDIDsAfter.toString();
        
        const didInfo = await didRegistry.getDID(didId);
        console.log(`   📄 생성된 DID 정보:`);
        console.log(`      - DID ID: ${didInfo.id}`);
        console.log(`      - DID 식별자: ${didInfo.didIdentifier}`);
        console.log(`      - 소유자: ${didInfo.owner}`);
        console.log(`      - 상태: ${didInfo.status === 0 ? 'ACTIVE' : 'INACTIVE'}`);
        
        createdDIDs.push({
          accountIndex: i,
          accountAddress: targetSigner.address,
          didId: didInfo.id.toString(),
          didIdentifier: didInfo.didIdentifier,
          name: profile.name,
          birthDate: profile.birthDate,
          nationality: profile.nationality,
          idCardNumber: profile.idCardNumber,
          txHash: createTx.hash,
          blockNumber: receipt.blockNumber
        });
        
        console.log(""); // 빈 줄
        
      } catch (error) {
        console.error(`   ❌ 계정 ${i} DID 생성 실패:`, error.message);
        console.log(""); // 빈 줄
      }
    }
    
    // 최종 결과 요약
    console.log("🎉 다중 DID 생성 완료!\n");
    console.log("=".repeat(80));
    
    const totalDIDsAfter = await didRegistry.getTotalDIDs();
    console.log(`📊 최종 DID 개수: ${totalDIDsAfter}개`);
    console.log(`➕ 새로 생성된 DID: ${createdDIDs.length}개\n`);
    
    if (createdDIDs.length > 0) {
      console.log("📋 생성된 DID 목록:");
      createdDIDs.forEach((did, index) => {
        console.log(`\n🆔 DID ${index + 1}:`);
        console.log(`   계정 ${did.accountIndex}: ${did.accountAddress}`);
        console.log(`   DID ID: ${did.didId}`);
        console.log(`   이름: ${did.name} (${did.nationality})`);
        console.log(`   생년월일: ${did.birthDate}`);
        console.log(`   신분증 번호: ${did.idCardNumber}`);
        console.log(`   DID 식별자: ${did.didIdentifier}`);
        console.log(`   트랜잭션: ${did.txHash}`);
      });
    }
    
    console.log("\n" + "=".repeat(80));
    
    // 전체 DID 목록 조회 (검증용)
    console.log("\n🔍 전체 DID 검증:");
    for (let i = 1; i <= totalDIDsAfter; i++) {
      try {
        const didInfo = await didRegistry.getDID(i);
        const isValid = await didRegistry.verifyDID(i);
        console.log(`   DID ${i}: ${didInfo.name} (${didInfo.owner}) - ${isValid ? '✅ 유효' : '❌ 무효'}`);
      } catch (error) {
        console.log(`   DID ${i}: ❌ 조회 실패`);
      }
    }
    
    console.log("\n💡 다음 단계:");
    console.log("   - 다양한 계정으로 티켓 구매 테스트");
    console.log("   - DID 소유권 검증 테스트");
    console.log("   - 크로스 계정 이벤트 참여 테스트");
    
    return {
      network: network.name,
      didRegistryAddress: DID_REGISTRY_ADDRESS,
      totalDIDsBefore: totalDIDsBefore.toString(),
      totalDIDsAfter: totalDIDsAfter.toString(),
      newDIDsCreated: createdDIDs.length,
      createdDIDs
    };
    
  } catch (error) {
    console.error("❌ 다중 DID 생성 실패:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n✅ 다중 DID 생성 스크립트 완료!");
    console.log("결과:", {
      network: result.network,
      totalDIDs: result.totalDIDsAfter,
      newDIDs: result.newDIDsCreated
    });
    process.exit(0);
  })
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  }); 