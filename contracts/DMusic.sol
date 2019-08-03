pragma solidity ^0.5.0;

import "./ERC20.sol";

contract DMusic {
    // structure of a song added
    struct Song {
        string ipfsHash;
        uint256 price;
        address owner;
        bool isAvailable;
    }
    // Id given to particular song
    uint256 public songsId;
    // mapping of songsId to Song struct
    mapping(uint256 => Song) public songsIdToSong;
    // mapping of artist address to songs
    mapping(address => uint256[]) public artistToSongs;
    //mapping of Song to Users
    mapping(uint256 => address[]) public songToUsers;
    //mapping of user to songs 
    mapping(address => uint256[]) public userToSongs;
    //mapping of artist with tokens
    mapping(address => address) public artistToToken;
    //event when the song is added
    event songAdded(uint256 songsId,address artist);
    //event when the song is bought
    event songBought(uint256 songsId,address user);
    //event when the erc20 is generated
    event tokenGenerated(address artist, address token);
    
    function addSong(string memory mIpfsHash, uint256  mPrice) public
    {
        Song memory song = Song({
            ipfsHash:mIpfsHash,
            price: mPrice,
            owner: msg.sender,
            isAvailable: true
        });
        
        songsIdToSong[songsId] = song;
        artistToSongs[msg.sender].push(songsId);
        
        emit songAdded(songsId++,msg.sender);
    }
    
    function buySong(uint256  mSongsId) public payable
    {
        
        Song memory song = songsIdToSong[mSongsId];
        require(song.isAvailable == true, "Song does not exist!!");
        uint256  price = song.price;
        
        require(msg.value == price, "Not enough money, transaction failed!!");
        
        _sendFunds(song.owner,msg.value);
        
        songToUsers[mSongsId].push(msg.sender);
        userToSongs[msg.sender].push(mSongsId);
        
        emit songBought(songsId, msg.sender);
        
    }
    
    function generateTokenForArtist(string memory tokenName,string memory tokenSymbol,uint8 decimals) public returns (address)
    {
        require(artistToToken[msg.sender] == address(0), "Artist already exist, Can't generate the duplicate token");

        
        address tokenAddress = address(new ERC20(tokenName,tokenSymbol,decimals,15000));
        artistToToken[msg.sender] = tokenAddress;
        
        emit tokenGenerated(msg.sender,tokenAddress);
        
        return tokenAddress;
        
        
    }
    
    function _sendFunds(address beneficiary,uint256 value) internal
    {
        address(uint160(beneficiary)).transfer(value);
    }
    
    
}