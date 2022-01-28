import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, getVestingData, sendRelease } from "./utils/interactETH";
import {Link} from 'react-router-dom';
const poolABI = require('./abis/VestingPoolABI.json')
const vestingABI = require('./abis/TokenVestingABI.json')
const Web3 = require('web3')

const ReleaseETH = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [chainId, setChain] = useState("");
  const [investor, setInvestor] = useState("")
  const [vesting, setVesting] = useState("")
  const [beginTime, setBeginTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [availableAmount, setAvailableAmount] = useState(0)


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus("Write a message in the text-field above.")
        } else {
          setWallet("")
          setStatus("Connect to Metamask using the top right button.")
        }
      })

      window.ethereum.on("chainChanged", (chainId) => {
        if (chainId != null && chainId == 0x1 ) {
          setChain(chainId)
          setStatus("Write a message in the text-field above.")
          initComponents()
        } else {
          setStatus("Change your network to Ethereum Mainnet. Chain id should be 0x1")
        }
      })
    } else {
      setStatus(
              <span>
                  <p>
                      <a target="_blank" href={`https://metamask.io/download.html`}>
                          You must install Metamask, a virtual Ethereum wallet, in your browser.
                      </a>
                  </p>
              </span>
      )
    }
  }

  const initComponents = () => {
    window.web3 = new Web3(window.ethereum)
    var pool_address = '0x5dAAFBE1a286c7E03Dcb3F4734415a23A6A2723a'
    window.pool = new window.web3.eth.Contract(poolABI, pool_address)
  }

  const setVestingData = async (withBeneficiary) => {
    const {beginTime, endTime, availableAmount, beneficiary} = await getVestingData()
    setBeginTime(beginTime)
    setEndTime(endTime)
    setAvailableAmount(availableAmount)
    if (withBeneficiary) {
      setInvestor(beneficiary)
    }
    if (availableAmount > 0) {
      setStatus("To release press button \"Release\"")
    } else {
      setStatus("Nothing to release")
    }
  }

  useEffect(async () => { //TODO: implement
    const {status, address, chainId} = await getCurrentWalletConnected()
    setStatus(status)
    setWallet(address)
    setChain(chainId)

    if (address != "" && chainId == 0x1) {
      initComponents()
    }

    addWalletListener()
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
    setChain(walletResponse.chainId)
  };


  const onChangeInvestor = async (event) => {
    let investor = event.target.value
    setInvestor(investor)
    if (Web3.utils.isAddress(investor)) {

      let vestings = await window.pool.methods.getDistributionContracts(investor).call()
      if (vestings.length > 0) {
        if (vestings.length > 1) {
          setStatus("More than one vestings connected with address. Please specify only the desired one")
        } else {
          window.vesting = new window.web3.eth.Contract(vestingABI, vestings[0])
          await setVestingData(false)
          setVesting(vestings[0])
        }
      } else {
        setStatus("Vestings smart contract not found")
      }
    } else {
      setStatus(
        "Write a valid investor address"
      )
    }
  }

  const onChangeVesting = async (event) => {
    let vesting = event.target.value
    setVesting(vesting)
    if (Web3.utils.isAddress(vesting)) {
      try {
        window.vesting = new window.web3.eth.Contract(vestingABI, vesting)
        await setVestingData(true)
        setVesting(vesting)
      } catch(err) {
        setStatus(err.message)
      }
    } else {
      setStatus(
        "Write a valid vesting address"
      )
    }
  }

  const onReleasePressed = async () => { //TODO: implement
    if (window.vesting != null && availableAmount > 0) {
      const { status } = await sendRelease()
      setStatus(status)
    } else {
      setStatus("Fill all fields correctly and check available amout to release")
    }
  };

  return (
    <div className="Release">

    <Link to="/ReleaseBSC">
    <button> BSC </button>
    </Link>
    <Link to="/ReleaseETH">
    <button> ETH </button>
    </Link>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 && chainId != null ? (
          "ChainId: " + chainId + " | "+ "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Release App ETH</h1>
      <p>
        Simply write your address or vesting smart contract address, then press "Release"
      </p>
      <form>
        <h2>Investor address: </h2>
        <input
          type="text"
          placeholder="e.g. 0xabcd...ff"
          onChange={onChangeInvestor}
          value = {investor}
        />
        <h2>Vesting smart contract: </h2>
        <input
          type="text"
          placeholder="e.g. 0xabcd..ff"
          onChange={onChangeVesting}
          value = {vesting}
        />
        <h2>Vesting begin time: </h2>
        <p id="beginTime">
          {beginTime}
        </p>
        <h2>Vesting end time: </h2>
        <p id="endTime">
          {endTime}
        </p>
        <h2> Availaible amount to release: </h2>
        <p id="amount">
          {availableAmount}
        </p>
      </form>
      <button id="releaseButton" onClick={onReleasePressed}>
        Release
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default ReleaseETH;
