// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount = 0;
    mapping(uint => Request) public requests;
    uint public requestCount = 0;

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this.");
        _;
    }

    constructor(uint minimum, address campaignCreator) {
        manager = campaignCreator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "Contribution is below the minimum."
        );
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests[requestCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint requestID) public {
        Request storage request = requests[requestID];
        require(approvers[msg.sender], "You must be a contributor to approve.");
        require(
            !request.approvals[msg.sender],
            "You have already approved this request."
        );
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestID) public restricted {
        Request storage request = requests[requestID];
        require(
            request.approvalCount > (approversCount / 2),
            "Not enough approvals."
        );
        require(!request.complete, "Request already finalized.");
        request.complete = true;
        request.recipient.transfer(request.value);
    }
}

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getCampaignsList() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}
