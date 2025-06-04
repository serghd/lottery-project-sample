Blockchain: <b>Sepolia (Ethereum Testnet)</b>

TestUSD Token address: <b>0xC385F91686e12FA737576C1cE216a15626BEEf14</b>
https://sepolia.etherscan.io/address/0xC385F91686e12FA737576C1cE216a15626BEEf14#readContract

Lottery Contract address: <b>0xD718a4F3eFba771d0bEcE52AaCC251E20489a1a1</b>
https://sepolia.etherscan.io/address/0xD718a4F3eFba771d0bEcE52AaCC251E20489a1a1#code

Before placing a bet, you must approve the amount that will be at the disposal of the contract by using method 'approve()' of the TestUSD contract.
Then to place a bet you need to use the method 'makeBid()' (without arguments).
After the 5th bet, the funds are randomly transferred to the winner.
Also, you can use the method 'givePrize()' to transfer prize manually (available only for admin).

Fro generating random values Chainlink VRF (Verifiable Random Function) is used.
