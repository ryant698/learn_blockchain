// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import {PriceConversion} from "./PriceConversionLib.sol";

contract FundMe {
    using PriceConversion for uint256;
    address public immutable i_fundOwner;
    uint256 public constant MINIMUM_USD = 5e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    constructor() {
        i_fundOwner = msg.sender;
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "doesn't reach minimum!"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value; // Track the actual ETH amount funded
    }

    function withdraw() public payable onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            addressToAmountFunded[funders[i]] = 0;
        }
        funders = new address[](0); // new blank address array with 0 number of elements
        // payable(msg.sender).transfer(address(this).balance);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed!");
    }

    modifier onlyOwner() {
        require(
            msg.sender == i_fundOwner,
            "Must be fund owner to call this function!"
        );
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
