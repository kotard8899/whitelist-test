import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useW3Wallet, W3WalletDriver } from "../components/w3wallet"
import Web3 from "web3"
import abi from "../abi/ABI.json"
import getProof from "../utils/getProof"
import { useState, useEffect } from "react"

export default function Home() {
  // const [W3Wallet] = useW3Wallet()
  // const { provider, accounts } = W3Wallet
  // const account = accounts[0]
  // const web3 = new Web3(provider)
  const [provider, setProvider] = useState("")
  const [web3, setWeb3] = useState("")
  const [contract, setContract] = useState("")
  const [account, setAccount] = useState("")
  const address = "0x51f758145ab8ae13ef5afbc75bbe66441810d0e3"
  // const contract = new web3.eth.Contract(abi, address)

  useEffect(() => {
    (async () => {
      const QubicProvider = (await import("@qubic-js/browser")).default
      setProvider(new QubicProvider({
        apiKey: process.env.NEXT_PUBLIC_QUBIC_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_QUBIC_API_SECRET,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN, 10),
        infuraProjectId: process.env.NEXT_PUBLIC_INFURA_ID,
        enableIframe: false,
      }))
      })()
  }, [])

  useEffect(() => {
    const web3 = new Web3(provider)
    provider && setWeb3(web3)
    provider && setContract(new web3.eth.Contract(abi, address))
  }, [provider])

  const [hash, setHash] = useState("")
  const [status, setStatus] = useState("")

  const handleMint = async () => {
    const cost = web3.utils.toWei("0.1", "ether")
    const proof = getProof(account.toLowerCase())
    console.log(proof)
    const r = await contract.methods
      .presaleMint(account, 1, proof)
      .send({ from: account, value: cost })
      .on("transactionHash", (hash) => {
        setHash(hash)
        setStatus("pending")
      })
      .on("receipt", (receipt) => {
        console.log(receipt)
        setStatus("success")
      })
      .on("error", (error) => {
        console.log(error)
        setStatus("fail")
      })
      .catch(error => {
        console.log(error)
        setStatus("fail")
      })
  }

  const handleConnect = async () => {
    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
        })
        setAccount(accounts[0])
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BS MINT TEST</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <W3WalletDriver/> */}
      {account ? <div>{account}</div> : 
      <button onClick={handleConnect}>
        Connect
      </button>}
      <button onClick={handleMint}>
        MINT 1
      </button>
      <div>
        txHash: 
        <a target="_blank" rel="noreferrer noopener" href={`https://rinkeby.etherscan.io/tx/${hash}`} style={{ color: "blue", textDecoration: "underline" }}>{hash}</a>
      </div>
      <div>
        status: {status}
      </div>
    </div>
  )
}
