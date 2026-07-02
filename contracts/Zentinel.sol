// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, ebool, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Zentinel
/// @notice A wallet submits its collateral and debt figures encrypted. The contract computes
/// a safe/unsafe collateralization verdict on the encrypted numbers and makes only that verdict
/// publicly decryptable — the underlying collateral and debt amounts are never revealed to
/// anyone but the wallet itself.
contract Zentinel is ZamaEthereumConfig {
    /// @dev Required collateralization ratio, expressed as a percentage (150 = 150%).
    uint32 public immutable requiredRatioPercent;

    mapping(address => euint64) private _collateral;
    mapping(address => euint64) private _debt;
    mapping(address => ebool) private _isSafe;
    mapping(address => bool) public hasPosition;

    event PositionSubmitted(address indexed wallet);
    event VerdictComputed(address indexed wallet);

    constructor(uint32 _requiredRatioPercent) {
        require(_requiredRatioPercent > 0, "ratio must be positive");
        requiredRatioPercent = _requiredRatioPercent;
    }

    /// @notice Submit encrypted collateral and debt figures for the caller's position.
    /// @dev Overwrites any previous position for the caller.
    function submitPosition(
        externalEuint64 collateralInput,
        externalEuint64 debtInput,
        bytes calldata inputProof
    ) external {
        euint64 collateral = FHE.fromExternal(collateralInput, inputProof);
        euint64 debt = FHE.fromExternal(debtInput, inputProof);

        _collateral[msg.sender] = collateral;
        _debt[msg.sender] = debt;
        hasPosition[msg.sender] = true;

        FHE.allowThis(collateral);
        FHE.allowThis(debt);
        FHE.allow(collateral, msg.sender);
        FHE.allow(debt, msg.sender);

        emit PositionSubmitted(msg.sender);
    }

    /// @notice Compute the caller's safe/unsafe verdict and make it publicly decryptable.
    /// @dev Safe iff collateral / debt >= requiredRatioPercent / 100, checked without division as
    /// collateral * 100 >= debt * requiredRatioPercent. A zero debt position is always safe.
    function computeVerdict() external {
        require(hasPosition[msg.sender], "no position submitted");

        euint64 scaledCollateral = FHE.mul(_collateral[msg.sender], uint64(100));
        euint64 scaledDebt = FHE.mul(_debt[msg.sender], uint64(requiredRatioPercent));

        ebool isSafe = FHE.ge(scaledCollateral, scaledDebt);
        _isSafe[msg.sender] = isSafe;

        FHE.allowThis(isSafe);
        FHE.allow(isSafe, msg.sender);
        FHE.makePubliclyDecryptable(isSafe);

        emit VerdictComputed(msg.sender);
    }

    /// @notice Returns the encrypted verdict handle for a wallet, publicly decryptable once computed.
    function getVerdict(address wallet) external view returns (ebool) {
        return _isSafe[wallet];
    }

    /// @notice Returns the caller's own encrypted collateral/debt handles (only the caller can decrypt these).
    function getMyPosition() external view returns (euint64 collateral, euint64 debt) {
        return (_collateral[msg.sender], _debt[msg.sender]);
    }
}
