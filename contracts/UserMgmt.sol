pragma solidity ^0.4.24;
import "zeppelin/contracts/lifecycle/Pausable.sol";

contract UserMgmt is Pausable { 

    struct UserData {
        bytes32 userName;
        bytes32 userEmail;
        bytes32 userPhoneNo;
        bytes32 avatarIpfsHash;
        uint userId;
    }

    mapping(address => UserData) private  users;
    address[] private userIndex;
    
    event LogNewUser   (address indexed userAddress, bytes32 userName, bytes32 userEmail, uint index);
    event LogUpdateUser(address indexed userAddress, bytes32 userName, bytes32 userEmail, uint index);
    event LogDeleteUser(address indexed userAddress, uint index);
  
    modifier onlyValidUser() {
        require(userIndex.length != 0,"No registered users");
        require((userIndex[users[msg.sender].userId] == msg.sender), "Not a valide user");
        _;
    }

    modifier onlyNonUser() {
        require((users[msg.sender].userName == 0x0),"Should not be a valid user");
        _;
    }

    function userSignup( 
        bytes32 _userName,
        bytes32 _userEmail,
        bytes32 _userPhoneNo,
        bytes32 _avatarIpfsHash
    )
        public
        onlyNonUser()
        whenNotPaused()
        returns(bool success)
    {
        require (_userName != 0x0,"Not a valid user name");
        users[msg.sender].userName = _userName;
        users[msg.sender].userEmail = _userEmail;
        users[msg.sender].userPhoneNo = _userPhoneNo;
        users[msg.sender].avatarIpfsHash = _avatarIpfsHash; 
        users[msg.sender].userId = userIndex.push(msg.sender)-1;
        emit LogNewUser(msg.sender,_userName,_userEmail,users[msg.sender].userId);
        return true;
    }

    function userUpdate(
        bytes32 _newName, 
        bytes32 _newEmail, 
        bytes32 _newPhoneNo
    ) 
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success) 
    {
        require (_newName != 0x0,"Not a valid user name");
        users[msg.sender].userName = _newName;
        users[msg.sender].userEmail = _newEmail;
        users[msg.sender].userPhoneNo = _newPhoneNo;
        emit LogUpdateUser(msg.sender,_newName,_newEmail,users[msg.sender].userId);
        return true;
    }

    function deleteUser()
        public
        onlyValidUser()
        whenNotPaused()
        returns (bool success)
    {
        uint indexToDelete = users[msg.sender].userId;
        require(userIndex.length>0,"integer underflow");
        address recordToMove = userIndex[userIndex.length-1];
        userIndex[indexToDelete] = recordToMove;
        userIndex.length--;
    }

    function userLogin()
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[msg.sender].userName;
    }

    // //Update functions ------------

    function updateUserName(
        bytes32 _userName
    )
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success)
    {
        
        users[msg.sender].userName = _userName;
        return true;
    }

    function updateUserEmail(
        bytes32 _userEmail
    )
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success)
    {
        users[msg.sender].userEmail = _userEmail;
        return true;
    }
    
    function updateUserPhoneNo(
        bytes32 _userPhoneNo
    )
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success)
    {
    
        users[msg.sender].userPhoneNo = _userPhoneNo;
        return true;
    }
    
    function updateUserAvatar(
        bytes32 _avatarIpfsHash
    )
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success)
    {
        
        users[msg.sender].avatarIpfsHash = _avatarIpfsHash;
        return true;
    }

    // //helper function ------------

    function getUserSummary(
        address userAddress
    )
        public
        view
        onlyValidUser()
        returns(
            bytes32,
            bytes32,
            bytes32,
            bytes32,
            uint
        )
    {
        return (
            users[msg.sender].userName, 
            users[msg.sender].userEmail,
            users[msg.sender].userPhoneNo,
            users[msg.sender].avatarIpfsHash, 
            users[msg.sender].userId
        ); 
    }
    
    function getUserIndex()
        public
        view
        onlyValidUser()
        returns(uint)
    {
        return users[msg.sender].userId ;
    }

    function getUserCount()
        public 
        view
        returns(uint)
    {
        return userIndex.length;
    }

    function getUserAddressAtIndex(
        uint index
    )
        public
        view
        onlyValidUser()
        returns(address)
    {
        return userIndex[index];
    }

    function getUserName(
        address userAddress
    )
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[userAddress].userName;
    }
    
    function getUserEmail(
        address userAddress
    )
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[userAddress].userEmail;
    }

    function getUserPhoneNo(
        address userAddress
    )
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[userAddress].userPhoneNo;
    }

    function getUserAvatar(
        address userAddress
    )
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[userAddress].avatarIpfsHash;
    }

}