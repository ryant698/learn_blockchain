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
    Request[] public requests;
    address[] deployedCampaigns; // addresses of all deployed campaigns

    constructor(uint minimum, address camapaignCreator) {
        manager = camapaignCreator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function getApprovers() public view restricted returns (address[] memory) {
        // return approvers;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public {
        // Create a new Request in storage
        Request storage newRequest = requests.push();

        // Populate the fields of the struct
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint requestID) public {
        Request storage request = requests[requestID];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestID) public restricted {
        Request storage request = requests[requestID];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        request.complete = true;
        request.recipient.transfer(request.value);
    }
}

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaigns(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getCampaignsList() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}
