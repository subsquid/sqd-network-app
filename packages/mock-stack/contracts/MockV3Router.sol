// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

/**
 * Minimal Pancake/Uniswap V3 SwapRouter stub.
 *
 * Only implements the two functions called by the portal pool deploy harness
 * (`exactInputSingle`, `exactInput`). Returns 1:1 swaps with no slippage and
 * no AMM math — the integration tests we run against this don't need realistic
 * pricing, only deterministic accounting.
 *
 * Tokens must be pre-funded into this contract for swaps to settle (the deploy
 * harness mints both legs into the router during seeding).
 */
contract MockV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    event MockSwap(
        address indexed tokenIn,
        address indexed tokenOut,
        address indexed recipient,
        uint256 amountIn,
        uint256 amountOut
    );

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        returns (uint256 amountOut)
    {
        IERC20Minimal(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        amountOut = params.amountIn; // 1:1
        require(amountOut >= params.amountOutMinimum, "MockV3Router: slippage");
        IERC20Minimal(params.tokenOut).transfer(params.recipient, amountOut);
        emit MockSwap(params.tokenIn, params.tokenOut, params.recipient, params.amountIn, amountOut);
    }

    function exactInput(ExactInputParams calldata params) external returns (uint256 amountOut) {
        // Decode the first / last addresses from the path. V3 path encoding:
        // [tokenIn (20)] [fee (3)] [tokenN (20)] [fee (3)] ... [tokenOut (20)]
        // We don't validate intermediate hops; only the endpoints matter.
        bytes memory path = params.path;
        require(path.length >= 43, "MockV3Router: path");
        address tokenIn;
        address tokenOut;
        assembly {
            tokenIn := shr(96, mload(add(path, 32)))
            tokenOut := shr(96, mload(add(add(path, 32), sub(mload(path), 20))))
        }

        IERC20Minimal(tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        amountOut = params.amountIn; // 1:1
        require(amountOut >= params.amountOutMinimum, "MockV3Router: slippage");
        IERC20Minimal(tokenOut).transfer(params.recipient, amountOut);
        emit MockSwap(tokenIn, tokenOut, params.recipient, params.amountIn, amountOut);
    }

    /// Funded by the deploy harness to keep the 1:1 swap promise.
    function fund(address token, uint256 amount) external {
        IERC20Minimal(token).transferFrom(msg.sender, address(this), amount);
    }
}
