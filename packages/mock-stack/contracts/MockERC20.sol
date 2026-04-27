// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * Minimal ERC-20 with public mint/burn for test seeding.
 *
 * Intentionally inlined (no OpenZeppelin import) so `forge build` is fast and
 * has no external library dependencies. Behaviour is the bare minimum required
 * by the app: balanceOf, allowance, transfer, transferFrom, approve, mint.
 *
 * `mint` is deliberately permissionless — these contracts are only ever
 * deployed in the mock stack, never in production.
 */
abstract contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= value, "MockERC20: allowance");
            allowance[from][msg.sender] = allowed - value;
        }
        _transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 value) external {
        totalSupply += value;
        unchecked {
            balanceOf[to] += value;
        }
        emit Transfer(address(0), to, value);
    }

    function burn(address from, uint256 value) external {
        require(balanceOf[from] >= value, "MockERC20: balance");
        unchecked {
            balanceOf[from] -= value;
            totalSupply -= value;
        }
        emit Transfer(from, address(0), value);
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(balanceOf[from] >= value, "MockERC20: balance");
        unchecked {
            balanceOf[from] -= value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }
}

contract MockSQD is MockERC20 {
    constructor() MockERC20("Mock Subsquid Token", "SQD", 18) {}
}

contract MockUSDC is MockERC20 {
    constructor() MockERC20("Mock USD Coin", "USDC", 6) {}
}

contract MockWETH is MockERC20 {
    constructor() MockERC20("Mock Wrapped Ether", "WETH", 18) {}

    /// Allow tests to wrap raw ETH if needed by the portal pool flows.
    function deposit() external payable {
        totalSupply += msg.value;
        unchecked {
            balanceOf[msg.sender] += msg.value;
        }
        emit Transfer(address(0), msg.sender, msg.value);
    }

    function withdraw(uint256 value) external {
        require(balanceOf[msg.sender] >= value, "MockWETH: balance");
        unchecked {
            balanceOf[msg.sender] -= value;
            totalSupply -= value;
        }
        (bool ok, ) = msg.sender.call{value: value}("");
        require(ok, "MockWETH: withdraw");
        emit Transfer(msg.sender, address(0), value);
    }

    receive() external payable {}
}
