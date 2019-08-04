pragma solidity ^0.5.0;
import "./ArtistToken.sol";



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
    // balances
    mapping(address => uint256) public balances;
    //event when the song is added
    event songAdded(uint256 songsId,address artist);
    //event when the song is bought
    event songBought(uint256 songsId,address user);
    //event when the erc20 is generated
    event tokenGenerated(address artist, address token);
    
    //Token Instance
    ArtistToken public erc20;



    function getUserSongs(address user) public view returns(uint256[] memory userSongs) {
        userSongs = new uint256[](userToSongs[user].length);
        for(uint i = 0; i < userToSongs[user].length; i++) {
            userSongs[i] = userToSongs[user][i];
        }
        return userSongs;
    }
    
    function addSong(string memory mIpfsHash, uint256  mPrice) public
    {
        // require(artistToToken[msg.sender] == address(0), "Artist already exist, Can't generate the duplicate token");
        if(artistToToken[msg.sender] == address(0)) {
            generateTokenForArtist();
        }
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
        
        require(msg.value >= price, "Not enough money, transaction failed!!");
        
        balances[song.owner]+=msg.value;
        
        songToUsers[mSongsId].push(msg.sender);
        userToSongs[msg.sender].push(mSongsId);
        
        address token = artistToToken[song.owner];
        
        setExistingContractInstance(token);
        
        require(erc20.transfer(msg.sender,20));
        
        
        emit songBought(songsId, msg.sender);
        
    }
    
    function generateTokenForArtist() private returns (address)
    {        
    address tokenAddress = address(new ArtistToken("TOKEN","TKN",18,address(this)));
        artistToToken[msg.sender] = tokenAddress;
        emit tokenGenerated(msg.sender,tokenAddress);
        setExistingContractInstance(tokenAddress);
        return tokenAddress;
    }
    
    function _sendFunds(address beneficiary,uint256 value) internal
    {
       address(uint160(beneficiary)).transfer(value);
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender]>amount,"balance is not sufficient!");
        _sendFunds(msg.sender,amount);
        balances[msg.sender]-=amount;
        
    }
    
    function setExistingContractInstance(address token) internal
    {
        erc20 = ArtistToken(token);
    }
    
    function () external payable {
        revert();
    }
    
    
}