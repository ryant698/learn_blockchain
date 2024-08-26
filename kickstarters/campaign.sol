// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;

    constructor(uint minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }

    function getApprovers() public view restricted returns (address[] memory) {
        return approvers;
    }

    function createRequest(
        string memory description,
        uint value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request(
            description,
            value,
            recipient,
            false
        );
        requests.push(newRequest);
    }
}
