const Verifier = artifacts.require('SquareVerifier')
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')

const proof = require('../../zokrates/code/square/proof')

contract('TestSolnSquareVerifier', accounts => {
  const account_one = accounts[0]
  const account_two = accounts[1]

  beforeEach(async function () {
    const _Verifier = await Verifier.new({ from: account_one })
    this.contract = await SolnSquareVerifier.new(_Verifier.address, {
      from: account_one
    })
  })

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it('A new solution can be added', async function () {
    let solutionAdded = true
    try {
      await this.contract.addSolution(
        account_two,
        2,
        '0x341f85f5eca6304166fcfb6f591d49f6019f23fa39be0615e6417da06bf747ce',
        {
          from: account_one
        }
      )
    } catch (e) {
      solutionAdded = false
    }
    assert.equal(solutionAdded, true, 'Solution should have been added')
  })

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it('An ERC721 token can be minted', async function () {
    let tokenMinted = true
    try {
      await this.contract.mintToken(
        account_two,
        14,
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        { from: account_one }
      )
    } catch (e) {
      tokenMinted = false
    }

    assert.equal(tokenMinted, true, 'Token should be minted')
  })

  it('An ERC721 token can be minted with incorrect proof', async function () {
    let tokenMinted = true
    try {
      const input = [
        '0x0000000000000000000000000000000000000000000000000000000000000027',
        '0x0000000000000000000000000000000000000000000000000000000000000099'
      ]

      await this.contract.mintToken(
        account_two,
        2,
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        input,
        { from: account_one }
      )
    } catch (e) {
      tokenMinted = false
    }

    assert.equal(
      tokenMinted,
      false,
      'Token should not be minted with incorrect proof'
    )
  })
})
