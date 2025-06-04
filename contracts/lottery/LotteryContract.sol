// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity 0.8.23;

import {
   VRFConsumerBaseV2Plus
} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {
   VRFV2PlusClient
} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract LotteryContract is ReentrancyGuard, AccessControl, VRFConsumerBaseV2Plus {
   /**
    * Sepolia coordinator: 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
    */
   constructor(
      address superOwner_,
      address usdTokenAddress,
      string memory usdTokenSymbol,
      uint8 usdTokenDecimals,
      uint256 chainLinkSubscriptionId
   ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
      _superOwner = superOwner_;
      _usdToken = IERC20(usdTokenAddress);
      _usdTokenSymbol = usdTokenSymbol;
      _usdDecimals = usdTokenDecimals;
      s_subscriptionId = chainLinkSubscriptionId;
   }

   address public _superOwner;
   IERC20 public _usdToken;
   string public _usdTokenSymbol;
   uint8 public _usdDecimals = 18;

   address[] public _bids;
   uint64 public _bidsCounter = 0;
   uint256 public _bidsSum = 0;
   uint256 public _bidAmount = 1 * (10 ** _usdDecimals);

   struct RequestStatus {
      bool fulfilled; // whether the request has been successfully fulfilled
      bool exists; // whether a requestId exists
      uint256[] randomWords;
   }
   // ChainLink requests
   mapping(uint256 => RequestStatus) public cl_requests;

   // ChanLink subscription ID.
   uint256 public s_subscriptionId;

   // Past request IDs.
   uint256[] public requestIds;
   uint256 public lastRequestId;

   // The gas lane to use, which specifies the maximum gas price to bump to.
   // For a list of available gas lanes on each network,
   // see https://docs.chain.link/docs/vrf/v2-5/supported-networks
   bytes32 public keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

   // Depends on the number of requested values that you want sent to the
   // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
   // so 100,000 is a safe default for this example contract. Test and adjust
   // this limit based on the network that you select, the size of the request,
   // and the processing of the callback request in the fulfillRandomWords()
   // function.
   uint32 public callbackGasLimit = 100000;

   // The default is 3, but you can set this higher.
   uint16 public requestConfirmations = 3;

   // For this example, retrieve 2 random values in one request.
   // Cannot exceed VRFCoordinatorV2_5.MAX_NUM_WORDS.
   uint32 public numWords = 1;

   // events ----------------------------------------------------

   event RequestSent(uint256 requestId, uint32 numWords);
   event RequestFulfilled(uint256 requestId, uint256[] randomWords);

   // functions -------------------------------------------------

   function makeBid() external nonReentrant {
      address sender = _msgSender();

      require(
         _usdToken.allowance(sender, address(this)) >= _bidAmount,
         "User must allow to use of funds"
      );
      require(_usdToken.balanceOf(sender) >= _bidAmount, "User must have funds");

      _usdToken.transferFrom(sender, address(this), _bidAmount);
      _bidsCounter++;
      _bidsSum += _bidAmount;
      _bids.push(sender);

      if (isMultipleOfFive(_bidsCounter)) {
         requestRandomWords(false);
      }
   }

   function isMultipleOfFive(uint256 n) public pure returns (bool) {
      return n % 5 == 0;
   }

   function getRandomFromBigNumber(uint256 bigNumber) public pure returns (uint8) {
      return uint8(bigNumber % 5);
   }

   function _givePrizeByAccountIndex(uint8 idx) internal {
      _usdToken.transfer(_bids[idx], _bidsSum);
      _bidsCounter = 0;
      _bidsSum = 0;
      delete _bids;
   }

   function givePrize(uint8 idx) external onlyOwner {
      require(idx < 5, "idx must be less than 5");
      _givePrizeByAccountIndex(idx);
   }

   // ChainLink -------------------------------------------------

   // Assumes the subscription is funded sufficiently.
   // @param enableNativePayment: Set to `true` to enable payment in native tokens, or
   // `false` to pay in LINK
   function requestRandomWords(bool enableNativePayment) internal returns (uint256 requestId) {
      // Will revert if subscription is not set and funded.
      requestId = s_vrfCoordinator.requestRandomWords(
         VRFV2PlusClient.RandomWordsRequest({
            keyHash: keyHash,
            subId: s_subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords,
            extraArgs: VRFV2PlusClient._argsToBytes(
               VRFV2PlusClient.ExtraArgsV1({ nativePayment: enableNativePayment })
            )
         })
      );
      cl_requests[requestId] = RequestStatus({
         randomWords: new uint256[](0),
         exists: true,
         fulfilled: false
      });
      requestIds.push(requestId);
      lastRequestId = requestId;
      emit RequestSent(requestId, numWords);
      return requestId;
   }

   function fulfillRandomWords(
      uint256 _requestId,
      uint256[] calldata _randomWords
   ) internal override {
      require(cl_requests[_requestId].exists, "request not found");
      cl_requests[_requestId].fulfilled = true;
      cl_requests[_requestId].randomWords = _randomWords;

      if (cl_requests[_requestId].randomWords[0] > 0) {
         uint256 rand = cl_requests[_requestId].randomWords[0];
         uint8 idx = getRandomFromBigNumber(rand);

         if (_bids.length == 5) {
            _givePrizeByAccountIndex(idx);
         }
      }

      emit RequestFulfilled(_requestId, _randomWords);
   }

   function getRequestStatus(
      uint256 _requestId
   ) external view returns (bool fulfilled, uint256[] memory randomWords) {
      require(cl_requests[_requestId].exists, "request not found");
      RequestStatus memory request = cl_requests[_requestId];
      return (request.fulfilled, request.randomWords);
   }
}
