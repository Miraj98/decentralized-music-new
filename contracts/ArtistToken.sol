pragma solidity ^0.5.0;

import "./Owned.sol";
import "./ERC20.sol";
import "./SafeMath.sol";
import "./StandardToken.sol";

 /**
 * @title RamaToken
 */
contract ArtistToken is StandardToken, Owned {
    using SafeMath for uint;
    string public symbol;
    string public name;
    uint8 public decimals;


    /**
    * @dev constructor of a token contract
    * @param _tokenOwner address of the owner of contract.
    */
    constructor (string memory tokenSymbol,string memory tokenName,uint8 tokenDecimal,address _tokenOwner ) public Owned(_tokenOwner) {
        symbol = tokenSymbol;
        name = tokenName;
        decimals = tokenDecimal;
        totalSupply = 1500000000 * 1 ether;
        
        balances[_tokenOwner]+=totalSupply;
    }
    
}