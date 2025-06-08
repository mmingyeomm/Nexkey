// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DIDRegistry
 * @dev Contract for storing and managing DID (Decentralized Identifier) identity cards
 */
contract DIDRegistry is Ownable, ReentrancyGuard {
    uint256 private _didIdCounter;
    
    // DID 신분증 상태
    enum DIDStatus {
        ACTIVE,     // 활성
        SUSPENDED,  // 일시정지
        REVOKED     // 취소됨
    }
    
    // DID 신분증 구조체
    struct DIDDocument {
        uint256 id;                  // DID ID
        string didIdentifier;        // DID 식별자 (did:nexkey:...)
        address owner;               // 소유자 주소
        string name;                 // 실명
        string birthDate;            // 생년월일 (YYYY-MM-DD)
        string nationality;          // 국적
        string idCardNumber;         // 신분증 번호 (해시값)
        string profileImageHash;     // 프로필 이미지 IPFS 해시
        string metadataURI;          // 메타데이터 URI (IPFS)
        DIDStatus status;            // 상태
        uint256 issuedAt;           // 발급 시간
        uint256 updatedAt;          // 수정 시간
        address issuedBy;           // 발급기관 주소
    }
    
    // 매핑
    mapping(uint256 => DIDDocument) public didDocuments;          // ID => DID 문서
    mapping(address => uint256[]) public ownerDIDs;               // 소유자 => DID ID 목록
    mapping(string => uint256) public didIdentifierToId;          // DID 식별자 => ID
    mapping(string => bool) public usedIdCardNumbers;             // 사용된 신분증 번호
    mapping(address => bool) public authorizedIssuers;            // 승인된 발급기관
    
    // 이벤트
    event DIDCreated(
        uint256 indexed didId,
        string indexed didIdentifier,
        address indexed owner,
        string name,
        address issuedBy
    );
    
    event DIDUpdated(
        uint256 indexed didId,
        string indexed didIdentifier,
        address indexed owner,
        uint256 updatedAt
    );
    
    event DIDStatusChanged(
        uint256 indexed didId,
        string indexed didIdentifier,
        DIDStatus oldStatus,
        DIDStatus newStatus
    );
    
    event IssuerAuthorized(address indexed issuer, bool authorized);
    
    // 수정자
    modifier onlyDIDOwner(uint256 _didId) {
        require(didDocuments[_didId].owner == msg.sender, "Not DID owner");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), "Not authorized issuer");
        _;
    }
    
    modifier didExists(uint256 _didId) {
        require(didDocuments[_didId].id != 0, "DID does not exist");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // 컨트랙트 배포자를 기본 발급기관으로 설정
        authorizedIssuers[msg.sender] = true;
    }
    
    /**
     * @dev 새로운 DID 신분증 생성
     */
    function createDID(
        address _owner,
        string memory _name,
        string memory _birthDate,
        string memory _nationality,
        string memory _idCardNumber,
        string memory _profileImageHash,
        string memory _metadataURI
    ) external onlyAuthorizedIssuer nonReentrant returns (uint256) {
        require(_owner != address(0), "Invalid owner address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_idCardNumber).length > 0, "ID card number cannot be empty");
        require(!usedIdCardNumbers[_idCardNumber], "ID card number already used");
        
        // DID ID 증가
        _didIdCounter++;
        uint256 newDIDId = _didIdCounter;
        
        // DID 식별자 생성 (did:nexkey:chainId:contractAddress:id)
        string memory didIdentifier = string(abi.encodePacked(
            "did:nexkey:",
            Strings.toString(block.chainid),
            ":",
            Strings.toHexString(uint160(address(this)), 20),
            ":",
            Strings.toString(newDIDId)
        ));
        
        // DID 문서 생성
        DIDDocument memory newDID = DIDDocument({
            id: newDIDId,
            didIdentifier: didIdentifier,
            owner: _owner,
            name: _name,
            birthDate: _birthDate,
            nationality: _nationality,
            idCardNumber: _idCardNumber,
            profileImageHash: _profileImageHash,
            metadataURI: _metadataURI,
            status: DIDStatus.ACTIVE,
            issuedAt: block.timestamp,
            updatedAt: block.timestamp,
            issuedBy: msg.sender
        });
        
        // 저장
        didDocuments[newDIDId] = newDID;
        ownerDIDs[_owner].push(newDIDId);
        didIdentifierToId[didIdentifier] = newDIDId;
        usedIdCardNumbers[_idCardNumber] = true;
        
        emit DIDCreated(newDIDId, didIdentifier, _owner, _name, msg.sender);
        
        return newDIDId;
    }
    
    /**
     * @dev DID 정보 업데이트 (소유자만)
     */
    function updateDID(
        uint256 _didId,
        string memory _name,
        string memory _profileImageHash,
        string memory _metadataURI
    ) external didExists(_didId) onlyDIDOwner(_didId) nonReentrant {
        require(didDocuments[_didId].status == DIDStatus.ACTIVE, "DID is not active");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        DIDDocument storage did = didDocuments[_didId];
        did.name = _name;
        did.profileImageHash = _profileImageHash;
        did.metadataURI = _metadataURI;
        did.updatedAt = block.timestamp;
        
        emit DIDUpdated(_didId, did.didIdentifier, did.owner, block.timestamp);
    }
    
    /**
     * @dev DID 상태 변경 (발급기관만)
     */
    function changeDIDStatus(
        uint256 _didId,
        DIDStatus _newStatus
    ) external didExists(_didId) onlyAuthorizedIssuer nonReentrant {
        DIDDocument storage did = didDocuments[_didId];
        DIDStatus oldStatus = did.status;
        did.status = _newStatus;
        did.updatedAt = block.timestamp;
        
        emit DIDStatusChanged(_didId, did.didIdentifier, oldStatus, _newStatus);
    }
    
    /**
     * @dev DID 문서 조회
     */
    function getDID(uint256 _didId) external view didExists(_didId) returns (DIDDocument memory) {
        return didDocuments[_didId];
    }
    
    /**
     * @dev DID 식별자로 조회
     */
    function getDIDByIdentifier(string memory _didIdentifier) external view returns (DIDDocument memory) {
        uint256 didId = didIdentifierToId[_didIdentifier];
        require(didId != 0, "DID does not exist");
        return didDocuments[didId];
    }
    
    /**
     * @dev 소유자의 모든 DID 목록 조회
     */
    function getOwnerDIDs(address _owner) external view returns (uint256[] memory) {
        return ownerDIDs[_owner];
    }
    
    /**
     * @dev DID 유효성 검증
     */
    function verifyDID(uint256 _didId) external view didExists(_didId) returns (bool) {
        return didDocuments[_didId].status == DIDStatus.ACTIVE;
    }
    
    /**
     * @dev 발급기관 권한 관리 (owner만)
     */
    function setAuthorizedIssuer(address _issuer, bool _authorized) external onlyOwner {
        authorizedIssuers[_issuer] = _authorized;
        emit IssuerAuthorized(_issuer, _authorized);
    }
    
    /**
     * @dev 전체 DID 개수 조회
     */
    function getTotalDIDs() external view returns (uint256) {
        return _didIdCounter;
    }
    
    /**
     * @dev 신분증 번호 사용 여부 확인
     */
    function isIdCardNumberUsed(string memory _idCardNumber) external view returns (bool) {
        return usedIdCardNumbers[_idCardNumber];
    }
} 