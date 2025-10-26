//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

/**
 * A simple counter smart contract that allows users to record their counter value on-chain
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    address public immutable owner;
    
    // Mapping to store each user's counter value
    mapping(address => uint256) public userCounters;
    
    // Track all users who have recorded a counter
    address[] public users;
    mapping(address => bool) public hasRecorded;

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event CounterRecorded(address indexed user, uint256 counterValue, uint256 timestamp);

    // Constructor: Called once on contract deployment
    constructor(address _owner) {
        owner = _owner;
    }

    /**
     * Function that allows users to record their counter value on-chain
     * @param _counterValue (uint256) - the counter value to record
     */
    function recordCounter(uint256 _counterValue) public {
        console.log("Recording counter for user:", msg.sender);
        console.log("Counter value:", _counterValue);

        userCounters[msg.sender] = _counterValue;
        
        // Track new users
        if (!hasRecorded[msg.sender]) {
            users.push(msg.sender);
            hasRecorded[msg.sender] = true;
        }

        emit CounterRecorded(msg.sender, _counterValue, block.timestamp);
    }

    /**
     * Function to get a user's recorded counter value
     * @param _user (address) - the address of the user
     * @return uint256 - the user's counter value
     */
    function getUserCounter(address _user) public view returns (uint256) {
        return userCounters[_user];
    }

    /**
     * Function to get the total number of users who have recorded a counter
     * @return uint256 - the number of users
     */
    function getTotalUsers() public view returns (uint256) {
        return users.length;
    }

    /**
     * Function to get all users who have recorded a counter
     * @return address[] - array of user addresses
     */
    function getAllUsers() public view returns (address[] memory) {
        return users;
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable { }
}
