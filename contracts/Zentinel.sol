// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, ebool, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Zentinel
/// @author Takumixbt
/// @notice A wallet submits its collateral and debt figures encrypted. The contract computes
/// a safe/unsafe collateralization verdict on the encrypted numbers and makes only that verdict
/// publicly decryptable — the underlying collateral and debt amounts are never revealed to
/// anyone but the wallet itself.
contract Zentinel is ZamaEthereumConfig {
    /// @notice Required collateralization ratio, expressed as a percentage (150 = 150%).
    uint32 public immutable requiredRatioPercent;

    mapping(address wallet => euint64 collateral) private _collateral;
    mapping(address wallet => euint64 debt) private _debt;
    mapping(address wallet => ebool isSafe) private _isSafe;
    /// @notice Whether a wallet has an encrypted position on file.
    mapping(address wallet => bool hasSubmitted) public hasPosition;

    /// @notice Emitted once a wallet's encrypted collateral/debt position has been stored.
    /// @param wallet The wallet that submitted the position.
    event PositionSubmitted(address indexed wallet);

    /// @notice Emitted once a wallet's safe/unsafe verdict has been computed and published.
    /// @param wallet The wallet the verdict was computed for.
    event VerdictComputed(address indexed wallet);

    constructor(uint32 _requiredRatioPercent) {
        require(_requiredRatioPercent > 0, "ratio must be positive");
        requiredRatioPercent = _requiredRatioPercent;
    }

    /// @notice Submit encrypted collateral and debt figures for the caller's position.
    /// @dev Overwrites any previous position for the caller.
    /// @param collateralInput Encrypted collateral amount, produced client-side.
    /// @param debtInput Encrypted debt amount, produced client-side.
    /// @param inputProof Zero-knowledge proof that both ciphertexts are well-formed.
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
    /// @param wallet The wallet to look up.
    function getVerdict(address wallet) external view returns (ebool) {
        return _isSafe[wallet];
    }

    /// @notice Returns the caller's own encrypted collateral/debt handles (only the caller can decrypt these).
    /// @return collateral The caller's encrypted collateral handle.
    /// @return debt The caller's encrypted debt handle.
    function getMyPosition() external view returns (euint64 collateral, euint64 debt) {
        return (_collateral[msg.sender], _debt[msg.sender]);
    }
}
