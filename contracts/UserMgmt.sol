/**
 * @description  User manage functionalities
 * @author SijeshP <sijesh.poovalapil@gmail.com>
 * @dev The purpose of the UserMgmt contract is to implement the user control
 * functionalities. Maintaining the user profile will help the project to handle the 
 * rate the user involvment and provide feedback. Inplimened emergency stop for user creation
 * updation and deletion.
 */

pragma solidity ^0.4.24;
import "zeppelin/contracts/lifecycle/Pausable.sol";


/** @title UserMgmt 
 *  @dev The conract implemented user creation,update,retrive and delete functionalities.
 */
contract UserMgmt is Pausable { 

   // Struct to manage user profile and userId is used to implement Mapping iterator 
    struct UserData {
        bytes32 userName;
        bytes32 userEmail;
        bytes32 userPhoneNo;
        bytes32 avatarIpfsHash;
        uint userId;
    }

    // Map the address to User profile 
    mapping(address => UserData) private  users;
    // unordered list to implement mapping iterator pattern.
    address[] private userIndex;
    
    // event for user creation, updation and deletion.
    event LogNewUser   (address indexed userAddress, bytes32 userName, bytes32 userEmail, uint index);
    event LogUpdateUser(address indexed userAddress, bytes32 userName, bytes32 userEmail, uint index);
    event LogDeleteUser(address indexed userAddress, uint index);
  
    // restriction logic to access only for registered user.
    modifier onlyValidUser() {
        require(userIndex.length != 0,"No registered users");
        require((userIndex[users[msg.sender].userId] == msg.sender), "Not a valide user");
        _;
    }

    // restricted access for non- registered user , with out setting important user info.
    modifier onlyNonUser() {
        require((users[msg.sender].userName == 0x0),"Should not be a valid user");
        _;
    }

    /** 
     * @dev The func implemented user create new user.Restricted to non-registered user.
     * @param _userName - new user name 
     * @param _userEmail - email of the user will help to contract user 
     * @param _userPhoneNo - phone no. will help to contract user 
     * @param _avatarIpfsHash -  profile pic (stored in IPFS)
     */
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

   /** 
     * @dev The func implemented user updation.Restricted to registered user.
     * @param _newName - new user name 
     * @param _newEmail - email of the user will help to contract user 
     * @param _newPhoneNo - phone no. will help to contract user 
     */
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

    /** 
     * @dev The func implemented user updation.Restricted to registered user.
     * @return success  - deletion success or failure.
     */
    function deleteUser()
        public
        onlyValidUser()
        whenNotPaused()
        returns (bool success)
    {
        require(userIndex.length>0,"integer underflow");
        uint indexToDelete = users[msg.sender].userId;
        address recordToMove = userIndex[userIndex.length-1];
        userIndex[indexToDelete] = recordToMove;
        userIndex.length--;
        return true;
    }

    /** 
     * @dev The conract implemented to retrive the user info.Restricted to registered user.
     * @return username  - retrive the user name 
     */
    function userLogin()
        public 
        view
        onlyValidUser()
        returns(bytes32)
    {
        return users[msg.sender].userName;
    }

    // ------- /Update functions ------------

    function updateUserName(
        bytes32 _userName
    )
        public
        onlyValidUser()
        whenNotPaused()
        returns(bool success)
    {
        require (_userName != 0x0,"Not a valid user name");
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
        require (_userEmail != 0x0,"Not a valid email name");
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
        require (_userPhoneNo != 0x0,"Not a valid phone number");
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
        
        require (_avatarIpfsHash != 0x0,"Not a valid ipfs tag");
        users[msg.sender].avatarIpfsHash = _avatarIpfsHash;
        return true;
    }

    // ----  helper function (Get the user info)------------

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
            users[userAddress].userName, 
            users[userAddress].userEmail,
            users[userAddress].userPhoneNo,
            users[userAddress].avatarIpfsHash, 
            users[userAddress].userId
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