var ERC721MintableComplete = artifacts.require('ERC721RealEstateToken')

contract('TestERC721Mintable', accounts => {
  const account_one = accounts[0]
  const account_two = accounts[1]
  const account_three = accounts[2]
  const account_four = accounts[3]
  const account_five = accounts[4]
  const account_six = accounts[5]

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })

      // TODO: mint multiple tokens
      await this.contract.mint(account_two, 1, { from: account_one })
      await this.contract.mint(account_three, 2, { from: account_one })
      await this.contract.mint(account_four, 3, { from: account_one })
      await this.contract.mint(account_five, 4, { from: account_one })
    })

    it('should return total supply', async function () {
      let total = await this.contract.totalSupply.call()
      const expectedTotal = 4
      assert.equal(
        total.toNumber(),
        expectedTotal,
        `Total tokens should be ${expectedTotal}`
      )
    })

    it('should get token balance', async function () {
      let balance = await this.contract.balanceOf.call(account_four, {
        from: account_one
      })
      const expectedBalance = 1
      assert.equal(
        balance.toNumber(),
        expectedBalance,
        `account balance should be ${expectedBalance}`
      )
    })

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      let _tokenURI = await this.contract.tokenURI.call(1, {
        from: account_one
      })
      const expectedTokenURI =
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1'
      assert(
        _tokenURI == expectedTokenURI,
        `TokenURI of the token must be ${expectedTokenURI}`
      )
    })

    it('should transfer token from one owner to another', async function () {
      const tokenId = 1
      await this.contract.approve(account_four, tokenId, { from: account_two })
      await this.contract.transferFrom(account_two, account_four, tokenId, {
        from: account_two
      })
      // check new owner
      const currentOwner = await this.contract.ownerOf.call(tokenId)
      assert.equal(
        currentOwner,
        account_four,
        `account_four should be the new owner of ${tokenId}`
      )
    })
  })

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })
    })

    it('should fail when minting when address is not contract owner', async function () {
      let tokenMintedFailed = true
      try {
        await this.contract.mint(account_three, 20, { from: account_two })
      } catch (e) {
        tokenMintedFailed = false
      }

      assert.equal(
        tokenMintedFailed,
        false,
        'Token minted when sending a message from account that does not own contract'
      )
    })

    it('should return contract owner', async function () {
      let owner = await this.contract.owner.call({ from: account_one })
      assert.equal(owner, account_one, 'account_one should be contract owner')
    })
  })
})
