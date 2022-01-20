import dotenv from 'dotenv';
import { ethers } from "hardhat";
const hre = require("hardhat");

dotenv.config()


async function main() {

    /* ----------------------------------------------------------------------
    // CONSTANTS
    ------------------------------------------------------------------------*/
    const [ deployer, _ ] = await ethers.getSigners()

    const DAO_ADDRESS = process.env.DAO_ADDRESS
      
    const INITIAL_PRICE = process.env.INITIAL_PRICE
    const INITIAL_BUSD_AMOUNT = process.env.INITIAL_BUSD_AMOUNT

    let PANCAKESWAP_FACTORY_ADDRESS = process.env.PANCAKESWAP_FACTORY_ADDRESS
    let PANCAKESWAP_ROUTER_ADDRESS = process.env.PANCAKESWAP_ROUTER_ADDRESS
   
    /* ----------------------------------------------------------------------
    // DEPLOY TEA and BUSD CONTRACTS
    // ------------------------------------------------------------------------*/
        
    // deploy TEA Token
    const TeaToken = await ethers.getContractFactory("Token1");
    const teaToken = await TeaToken.deploy();
    await teaToken.deployed();
    console.log('TeaToken address: ',teaToken.address)

    // const out = await teaToken.balanceOf(deployer.address)
    // console.log("balance of deployer for teaToken", out.toString())

    // return

    // deploy a mock busd token
    const BusdToken = await ethers.getContractFactory("Token2");
    const busdToken = await BusdToken.deploy();
    await busdToken.deployed();
    console.log('BusdToken address: ',busdToken.address)

    /* ----------------------------------------------------------------------
    // CREATE TEA-BUSD LP Token
    ------------------------------------------------------------------------*/
    
    // Create the Pair Token
    let pairAddress
    let factory

    try {
      const factoryAbi = [
        "constructor(address _feeToSetter) public",
        "function getPair(address tokenA, address tokenB) external view returns (address pair)",
        "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
        "function createPair(address tokenA, address tokenB) external returns (address pair)"
      ];

      // Instance of the Factory contract
      factory = await ethers.getContractAt(factoryAbi, PANCAKESWAP_FACTORY_ADDRESS?PANCAKESWAP_FACTORY_ADDRESS:'', deployer)
 

      // Create the Pair Token
      const pairCreationTx = await factory.createPair(teaToken.address, busdToken.address)
      await pairCreationTx.wait()
      
    } catch(e) {

      console.log(e);
      return
    }

    try {
      const pairAbi = [
        "function balanceOf(address owner) external view returns (uint)"
      ];

      const routerAbi = [
         "function addLiquidity(address tokenA,address tokenB,uint amountADesired,uint amountBDesired,uint amountAMin,uint amountBMin,address to,uint deadline) external returns (uint amountA, uint amountB, uint liquidity)"
      ];
      
      const router = await ethers.getContractAt(routerAbi, PANCAKESWAP_ROUTER_ADDRESS?PANCAKESWAP_ROUTER_ADDRESS:'', deployer);
      


      pairAddress = await factory.getPair.call(deployer.address, teaToken.address, busdToken.address)

      
      const pair = await ethers.getContractAt(pairAbi, pairAddress?pairAddress:'', deployer)


      
      console.log('TEA_BUSD_LP_TOKEN address: ', pairAddress)
 
      // Add liquidity to the pool and give LP Token to DAO_ADDRESS

      const tx1 = await teaToken.approve(router.address, parseInt(INITIAL_BUSD_AMOUNT || '')/parseInt(INITIAL_PRICE || ''))
      await tx1.wait()

      const tx2  = await busdToken.approve(router.address, INITIAL_BUSD_AMOUNT)
      await tx2.wait()

      const addLiquidTx = await router.addLiquidity(
        teaToken.address,
        busdToken.address,
        parseInt(INITIAL_BUSD_AMOUNT || '')/parseInt(INITIAL_PRICE || ''),
        parseInt(INITIAL_BUSD_AMOUNT || ''),
        Math.floor(parseInt(INITIAL_BUSD_AMOUNT || '')/parseInt(INITIAL_PRICE || '')*1.06),
        Math.floor(parseInt(INITIAL_BUSD_AMOUNT || '')*1.06),
        DAO_ADDRESS,
        Math.floor(Date.now() / 1000) + 60 * 10,{ gasLimit: 6700000, gasPrice: 15000000000 });  

        await addLiquidTx.wait({ gasLimit: 6700000, gasPrice: 15000000000 })
      
      const balance = await pair.balanceOf(DAO_ADDRESS); 
      console.log(`balance LP: ${parseFloat(balance)*10**18}`);

    } catch(e) {

      console.log(e);
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });