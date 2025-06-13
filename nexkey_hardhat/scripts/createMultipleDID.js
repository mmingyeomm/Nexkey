const { ethers, network } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log(`🆔 ${network.name} 네트워크에서 다중 DID 생성 시작...\n`);
  
  try {
    // 네트워크별 DID Registry 주소 설정
    let DID_REGISTRY_ADDRESS;
    if (network.name === "render") {
      DID_REGISTRY_ADDRESS = "0xa50a51c09a5c451C52BB714527E1974b686D8e77"; // Render 배포 주소
    } else {
      DID_REGISTRY_ADDRESS = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e"; // 로컬 배포 주소
    }
    
    console.log("🌐 네트워크:", network.name);
    console.log("📍 DID Registry 주소:", DID_REGISTRY_ADDRESS);
    
    // DID Registry 컨트랙트 연결
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(DID_REGISTRY_ADDRESS);
    
    // generated-accounts.json 파일에서 계정 정보 읽기
    const accountsPath = path.join(__dirname, '../generated-accounts.json');
    const accountsData = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
    const accounts = accountsData.accounts;
    console.log(`👥 사용 가능한 계정: ${accounts.length}개\n`);
    
    // 다양한 사용자 프로필 정의
    const userProfiles = [
      {
        accountIndex: 0,
        name: "김민준",
        birthDate: "1990-05-15",
        nationality: "Korean",
        idCardNumber: "KR1990051500001",
        description: "기존 마이너 계정 (이미 가입됨)"
      },
      {
        accountIndex: 1,
        name: "이서연",
        birthDate: "1992-08-22",
        nationality: "Korean",
        idCardNumber: "KR2024031500001",
        description: "일반 사용자 1"
      },
      {
        accountIndex: 2,
        name: "박지훈",
        birthDate: "1988-12-03",
        nationality: "Korean", 
        idCardNumber: "KR2024031500002",
        description: "일반 사용자 2"
      },
      {
        accountIndex: 3,
        name: "최수아",
        birthDate: "1995-03-17",
        nationality: "Korean",
        idCardNumber: "KR2024031500003",
        description: "일반 사용자 3"
      },
      {
        accountIndex: 4,
        name: "정도윤",
        birthDate: "1991-07-10",
        nationality: "Korean",
        idCardNumber: "KR2024031500004",
        description: "일반 사용자 4"
      },
      {
        accountIndex: 5,
        name: "한지민",
        birthDate: "1993-11-28",
        nationality: "Korean",
        idCardNumber: "KR2024031500005",
        description: "일반 사용자 5"
      },
      {
        accountIndex: 6,
        name: "강현서",
        birthDate: "1994-04-05",
        nationality: "Korean",
        idCardNumber: "KR2024031500006",
        description: "일반 사용자 6"
      },
      {
        accountIndex: 7,
        name: "윤지우",
        birthDate: "1996-09-14",
        nationality: "Korean",
        idCardNumber: "KR2024031500007",
        description: "일반 사용자 7"
      },
      {
        accountIndex: 8,
        name: "임서준",
        birthDate: "1992-01-20",
        nationality: "Korean",
        idCardNumber: "KR2024031500008",
        description: "일반 사용자 8"
      },
      {
        accountIndex: 9,
        name: "송하은",
        birthDate: "1995-06-30",
        nationality: "Korean",
        idCardNumber: "KR2024031500009",
        description: "일반 사용자 9"
      }
    ];
    
    // 기존 DID 개수 확인
    const totalDIDsBefore = await didRegistry.getTotalDIDs();
    console.log(`📊 기존 DID 개수: ${totalDIDsBefore}개\n`);
    
    const createdDIDs = [];
    
    // 마이너 계정(계정 0)이 발급기관이므로 해당 계정으로 다른 사용자들의 DID를 생성
    const issuerWallet = new ethers.Wallet(accounts[0].privateKey, ethers.provider);
    const didRegistryWithIssuer = didRegistry.connect(issuerWallet);
    
    for (let i = 1; i < Math.min(userProfiles.length, accounts.length); i++) {
      const profile = userProfiles[i];
      const targetAccount = accounts[i]; // DID 소유자가 될 계정
      
      console.log(`🆔 계정 ${i}의 DID 생성 중...`);
      console.log(`   소유자 주소: ${targetAccount.address}`);
      console.log(`   사용자명: ${profile.name}`);
      console.log(`   생년월일: ${profile.birthDate}`);
      console.log(`   국적: ${profile.nationality}`);
      console.log(`   신분증 번호: ${profile.idCardNumber}`);
      console.log(`   설명: ${profile.description}`);
      
      try {
        // DID 생성 (마이너 계정이 다른 사용자들을 위해 발급)
        const createTx = await didRegistryWithIssuer.createDID(
          targetAccount.address,    // _owner: DID 소유자
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
          accountAddress: targetAccount.address,
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
        console.log(`   블록: ${did.blockNumber}`);
      });
    }
    
    return {
      success: true,
      didRegistryAddress: DID_REGISTRY_ADDRESS,
      totalDIDsBefore,
      totalDIDsAfter,
      createdDIDs
    };
  } catch (error) {
    console.error("❌ 다중 DID 생성 중 오류 발생:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

main()
  .then((result) => {
    if (result.success) {
      console.log("\n✨ 다중 DID 생성이 성공적으로 완료되었습니다!");
      console.log(`📝 DID Registry 컨트랙트 주소: ${result.didRegistryAddress}`);
    } else {
      console.error("\n❌ 다중 DID 생성 실패:", result.error);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 예상치 못한 오류 발생:", error);
    process.exit(1);
  }); 