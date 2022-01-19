//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token1 is ERC20 {
    uint constant _initial_supply = 3000000 * (10**18);
    constructor() ERC20("Goofy1", "GG1") {
        _mint(msg.sender, _initial_supply);
    }
}