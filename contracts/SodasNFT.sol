// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// TODO: Can be enhanced to add more kind of Sodas restricted to onlyOwner.

contract SodasNFT is ERC721, ERC721URIStorage, Ownable {
	struct Soda {
		uint score;
		string cid;
	}
	
	struct MySoda {
		uint tokenId;
		uint index;
	}
	
	mapping(uint => Soda) public drinks;
	mapping(address => MySoda) public tokenIdByAddress;
	
	event Mint(uint tokenId);
	event Drink(uint tokenId);
	event Review(uint index);

	using Counters for Counters.Counter;

	Counters.Counter private _tokenIdCounter;

	constructor(string[10] memory _cids) ERC721("SodasNFT", "SODAS") {
		for (uint i = 0; i < _cids.length; i++) {
			drinks[i].cid = _cids[i];
		}
		// Lowest tokenId is 1
		if (_tokenIdCounter.current() == 0) {
			_tokenIdCounter.increment();
		}
	}
	
	function mint(uint index) public {
		require(isAllowedToMint(msg.sender));
		
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(msg.sender, tokenId);
		_setTokenURI(tokenId, string.concat("http://ipfs.io/ipfs/", drinks[index].cid));
		tokenIdByAddress[msg.sender].tokenId = tokenId;
		tokenIdByAddress[msg.sender].index = index;
		
		emit Mint(tokenId);
	}
	
	function drink() public {
		require(isAllowedToDrink(msg.sender));
		_burn(tokenIdByAddress[msg.sender].tokenId);
		
		emit Drink(tokenIdByAddress[msg.sender].tokenId);
	}
	
	function review(bool res) public {
		require(isAllowedToReview(msg.sender));
		tokenIdByAddress[msg.sender].tokenId = 0;
		drinks[tokenIdByAddress[msg.sender].index].score += res ? 1 : 0;
		emit Review(tokenIdByAddress[msg.sender].index);
		
		delete tokenIdByAddress[msg.sender];
	}
	
	function isAllowedToMint(address sender) public view returns (bool) {
		return !_exists(tokenIdByAddress[sender].tokenId) && tokenIdByAddress[sender].tokenId == 0;
	}
	
	function isAllowedToDrink(address sender) public view returns (bool) {
		return _exists(tokenIdByAddress[sender].tokenId);
	}
	
	function isAllowedToReview(address sender) public view returns (bool) {
		return !_exists(tokenIdByAddress[sender].tokenId) && tokenIdByAddress[sender].tokenId != 0;
	}

	// The following functions are overrides required by Solidity.

	function _burn(
			uint256 tokenId
	) internal override(ERC721, ERC721URIStorage) {
			super._burn(tokenId);
	}

	function tokenURI(
			uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
			return super.tokenURI(tokenId);
	}

	function supportsInterface(
			bytes4 interfaceId
	) public view override(ERC721, ERC721URIStorage) returns (bool) {
			return super.supportsInterface(interfaceId);
	}
}
