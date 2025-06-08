// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./DIDRegistry.sol";

/**
 * @title InterparkTicketAddon
 * @dev Interpark ticket selling system that validates users through DID Registry
 */
contract InterparkTicketAddon is Ownable, ReentrancyGuard {
    
    // DID Registry 컨트랙트 참조
    DIDRegistry public immutable didRegistry;
    
    // 티켓 상태
    enum TicketStatus {
        AVAILABLE,    // 판매 가능
        SOLD,         // 판매됨
        USED,         // 사용됨
        CANCELLED     // 취소됨
    }
    
    // 이벤트 정보 구조체
    struct Event {
        uint256 eventId;
        string eventName;
        string venue;
        uint256 eventDate;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 soldTickets;
        bool isActive;
        address organizer;
    }
    
    // 티켓 정보 구조체
    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        uint256 didId;           // 구매자의 DID ID
        address owner;           // 구매자 주소
        string seatNumber;
        uint256 purchaseTime;
        uint256 price;
        TicketStatus status;
        string qrCodeHash;       // QR 코드 해시 (검증용)
    }
    
    // 상태 변수
    uint256 private _eventIdCounter;
    uint256 private _ticketIdCounter;
    
    // 매핑
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public eventTickets;     // 이벤트 ID => 티켓 ID 배열
    mapping(address => uint256[]) public userTickets;      // 사용자 => 소유 티켓 배열
    mapping(uint256 => uint256[]) public didTickets;       // DID ID => 티켓 배열
    mapping(address => bool) public authorizedOrganizers;  // 승인된 주최자
    
    // 이벤트
    event EventCreated(
        uint256 indexed eventId,
        string eventName,
        address indexed organizer,
        uint256 ticketPrice,
        uint256 totalTickets
    );
    
    event TicketPurchased(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        uint256 indexed didId,
        address buyer,
        string seatNumber,
        uint256 price
    );
    
    event TicketUsed(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        uint256 timestamp
    );
    
    event TicketTransferred(
        uint256 indexed ticketId,
        address indexed from,
        address indexed to,
        uint256 newDidId
    );
    
    // 수정자 - DID 검증을 컨트랙트 레벨에서 수행
    modifier onlyValidDIDOwner(uint256 _didId) {
        // 1. DID가 존재하고 활성 상태인지 DID Registry에서 확인
        require(didRegistry.verifyDID(_didId), "Invalid or inactive DID");
        
        // 2. DID Registry에서 DID 소유자 주소를 조회하고 트랜잭션 서명자와 비교
        DIDRegistry.DIDDocument memory didDoc = didRegistry.getDID(_didId);
        require(didDoc.owner == msg.sender, "Transaction signer is not the DID owner");
        require(didDoc.status == DIDRegistry.DIDStatus.ACTIVE, "DID is not active");
        _;
    }
    
    // 특정 주소가 DID 소유자인지 확인하는 수정자 (티켓 전송용)
    modifier onlyValidDIDOwnerFor(uint256 _didId, address _expectedOwner) {
        // 1. DID가 존재하고 활성 상태인지 DID Registry에서 확인
        require(didRegistry.verifyDID(_didId), "Invalid or inactive DID");
        
        // 2. DID Registry에서 DID 소유자 주소를 조회하고 예상 소유자와 비교
        DIDRegistry.DIDDocument memory didDoc = didRegistry.getDID(_didId);
        require(didDoc.owner == _expectedOwner, "Expected address is not the DID owner");
        require(didDoc.status == DIDRegistry.DIDStatus.ACTIVE, "DID is not active");
        _;
    }
    
    modifier onlyTicketOwner(uint256 _ticketId) {
        require(tickets[_ticketId].owner == msg.sender, "Not ticket owner");
        _;
    }
    
    modifier onlyAuthorizedOrganizer() {
        require(authorizedOrganizers[msg.sender] || msg.sender == owner(), "Not authorized organizer");
        _;
    }
    
    modifier eventExists(uint256 _eventId) {
        require(events[_eventId].eventId != 0, "Event does not exist");
        _;
    }
    
    modifier ticketExists(uint256 _ticketId) {
        require(tickets[_ticketId].ticketId != 0, "Ticket does not exist");
        _;
    }
    
    constructor(address _didRegistryAddress) Ownable(msg.sender) {
        require(_didRegistryAddress != address(0), "Invalid DID Registry address");
        didRegistry = DIDRegistry(_didRegistryAddress);
        
        // Interpark을 기본 승인된 주최자로 설정
        authorizedOrganizers[msg.sender] = true;
    }
    
    /**
     * @dev 새 이벤트 생성 (주최자만)
     */
    function createEvent(
        string memory _eventName,
        string memory _venue,
        uint256 _eventDate,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external onlyAuthorizedOrganizer nonReentrant returns (uint256) {
        require(bytes(_eventName).length > 0, "Event name cannot be empty");
        require(_eventDate > block.timestamp, "Event date must be in the future");
        require(_ticketPrice > 0, "Ticket price must be greater than 0");
        require(_totalTickets > 0, "Total tickets must be greater than 0");
        
        _eventIdCounter++;
        uint256 newEventId = _eventIdCounter;
        
        Event memory newEvent = Event({
            eventId: newEventId,
            eventName: _eventName,
            venue: _venue,
            eventDate: _eventDate,
            ticketPrice: _ticketPrice,
            totalTickets: _totalTickets,
            soldTickets: 0,
            isActive: true,
            organizer: msg.sender
        });
        
        events[newEventId] = newEvent;
        
        emit EventCreated(newEventId, _eventName, msg.sender, _ticketPrice, _totalTickets);
        
        return newEventId;
    }
    
    /**
     * @dev 티켓 구매 (DID 검증 필요) - 컨트랙트 레벨 검증
     */
    function purchaseTicket(
        uint256 _eventId,
        uint256 _didId,
        string memory _seatNumber
    ) external payable eventExists(_eventId) onlyValidDIDOwner(_didId) nonReentrant returns (uint256) {
        Event storage eventInfo = events[_eventId];
        require(eventInfo.isActive, "Event is not active");
        require(eventInfo.soldTickets < eventInfo.totalTickets, "Event is sold out");
        require(msg.value >= eventInfo.ticketPrice, "Insufficient payment");
        require(bytes(_seatNumber).length > 0, "Seat number cannot be empty");
        
        _ticketIdCounter++;
        uint256 newTicketId = _ticketIdCounter;
        
        // QR 코드 해시 생성
        string memory qrCodeHash = _generateQRCodeHash(newTicketId, _eventId, _didId);
        
        Ticket memory newTicket = Ticket({
            ticketId: newTicketId,
            eventId: _eventId,
            didId: _didId,
            owner: msg.sender,
            seatNumber: _seatNumber,
            purchaseTime: block.timestamp,
            price: eventInfo.ticketPrice,
            status: TicketStatus.SOLD,
            qrCodeHash: qrCodeHash
        });
        
        // 저장
        tickets[newTicketId] = newTicket;
        eventTickets[_eventId].push(newTicketId);
        userTickets[msg.sender].push(newTicketId);
        didTickets[_didId].push(newTicketId);
        
        // 이벤트 정보 업데이트
        eventInfo.soldTickets++;
        
        // 잉여 금액 환불
        if (msg.value > eventInfo.ticketPrice) {
            payable(msg.sender).transfer(msg.value - eventInfo.ticketPrice);
        }
        
        emit TicketPurchased(newTicketId, _eventId, _didId, msg.sender, _seatNumber, eventInfo.ticketPrice);
        
        return newTicketId;
    }
    
    /**
     * @dev 티켓 사용 (입장 시)
     */
    function useTicket(
        uint256 _ticketId,
        string memory _qrCodeHash
    ) external ticketExists(_ticketId) onlyAuthorizedOrganizer nonReentrant {
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.status == TicketStatus.SOLD, "Ticket is not valid for use");
        require(keccak256(bytes(ticket.qrCodeHash)) == keccak256(bytes(_qrCodeHash)), "Invalid QR code");
        
        Event storage eventInfo = events[ticket.eventId];
        require(block.timestamp <= eventInfo.eventDate + 3 hours, "Event has ended");
        
        ticket.status = TicketStatus.USED;
        
        emit TicketUsed(_ticketId, ticket.eventId, block.timestamp);
    }
    
    /**
     * @dev 티켓 전송 (DID 간 전송) - 컨트랙트 레벨 검증
     */
    function transferTicket(
        uint256 _ticketId,
        address _to,
        uint256 _newDidId
    ) external ticketExists(_ticketId) onlyTicketOwner(_ticketId) onlyValidDIDOwnerFor(_newDidId, _to) nonReentrant {
        require(_to != address(0), "Invalid recipient address");
        require(_to != msg.sender, "Cannot transfer to yourself");
        
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.status == TicketStatus.SOLD, "Ticket cannot be transferred");
        
        address from = ticket.owner;
        uint256 oldDidId = ticket.didId;
        
        // 티켓 정보 업데이트
        ticket.owner = _to;
        ticket.didId = _newDidId;
        
        // 매핑 업데이트
        _removeFromArray(userTickets[from], _ticketId);
        _removeFromArray(didTickets[oldDidId], _ticketId);
        userTickets[_to].push(_ticketId);
        didTickets[_newDidId].push(_ticketId);
        
        emit TicketTransferred(_ticketId, from, _to, _newDidId);
    }
    
    /**
     * @dev 현재 트랜잭션 서명자가 DID 소유자인지 검증
     */
    function validateSignerIsDIDOwner(uint256 _didId) external view returns (bool) {
        try didRegistry.verifyDID(_didId) returns (bool isValid) {
            if (!isValid) return false;
            
            try didRegistry.getDID(_didId) returns (DIDRegistry.DIDDocument memory didDoc) {
                return didDoc.owner == msg.sender && didDoc.status == DIDRegistry.DIDStatus.ACTIVE;
            } catch {
                return false;
            }
        } catch {
            return false;
        }
    }
    
    /**
     * @dev 특정 주소가 DID 소유자인지 검증 (외부 호출용)
     */
    function validateAddressIsDIDOwner(uint256 _didId, address _addressToCheck) external view returns (bool) {
        try didRegistry.verifyDID(_didId) returns (bool isValid) {
            if (!isValid) return false;
            
            try didRegistry.getDID(_didId) returns (DIDRegistry.DIDDocument memory didDoc) {
                return didDoc.owner == _addressToCheck && didDoc.status == DIDRegistry.DIDStatus.ACTIVE;
            } catch {
                return false;
            }
        } catch {
            return false;
        }
    }
    
    /**
     * @dev 이벤트 정보 조회
     */
    function getEvent(uint256 _eventId) external view eventExists(_eventId) returns (Event memory) {
        return events[_eventId];
    }
    
    /**
     * @dev 티켓 정보 조회
     */
    function getTicket(uint256 _ticketId) external view ticketExists(_ticketId) returns (Ticket memory) {
        return tickets[_ticketId];
    }
    
    /**
     * @dev 사용자의 모든 티켓 조회
     */
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }
    
    /**
     * @dev DID의 모든 티켓 조회
     */
    function getDIDTickets(uint256 _didId) external view returns (uint256[] memory) {
        return didTickets[_didId];
    }
    
    /**
     * @dev 이벤트의 모든 티켓 조회
     */
    function getEventTickets(uint256 _eventId) external view returns (uint256[] memory) {
        return eventTickets[_eventId];
    }
    
    /**
     * @dev 티켓 유효성 검증 (QR 코드로)
     */
    function verifyTicket(uint256 _ticketId, string memory _qrCodeHash) external view ticketExists(_ticketId) returns (bool) {
        Ticket memory ticket = tickets[_ticketId];
        return keccak256(bytes(ticket.qrCodeHash)) == keccak256(bytes(_qrCodeHash)) && 
               ticket.status == TicketStatus.SOLD;
    }
    
    /**
     * @dev 주최자 권한 관리
     */
    function setAuthorizedOrganizer(address _organizer, bool _authorized) external onlyOwner {
        authorizedOrganizers[_organizer] = _authorized;
    }
    
    /**
     * @dev 수익금 인출 (주최자)
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Internal functions
    function _generateQRCodeHash(uint256 _ticketId, uint256 _eventId, uint256 _didId) internal view returns (string memory) {
        return Strings.toHexString(uint256(keccak256(abi.encodePacked(
            _ticketId,
            _eventId,
            _didId,
            block.timestamp,
            msg.sender
        ))));
    }
    
    function _removeFromArray(uint256[] storage array, uint256 value) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
} 