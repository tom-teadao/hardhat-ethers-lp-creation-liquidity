//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token2 is ERC20 {
    uint constant _initial_supply = 30000000 * (10**18);
    constructor() ERC20("Goofy2", "GG2") {
        _mint(msg.sender, _initial_supply);
    }
}