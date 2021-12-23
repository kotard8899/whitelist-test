import { useCallback, useEffect } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import useW3Wallet from "./useW3Wallet"
import switchNetwork from "./switchNetwork"
import detectAccounts from "./detectAccounts"
import requestAccounts from "./requestAccounts"

function W3WalletDriver () {
  const [W3Wallet, W3WalletDispatch] = useW3Wallet()

  const connectBtnClick = useCallback(async () => {
    const accounts = await requestAccounts(W3Wallet.provider)
    W3WalletDispatch({
      type: "updateAccounts",
      payload: { accounts },
    })
  }, [W3Wallet.provider, W3WalletDispatch])

  // 偵測是否有安裝Ethereum相容錢包，如MetaMask
  // W3WalletDispatch永遠不會改變，固只會跑一次
  useEffect(() => {
    (async () => {
      W3WalletDispatch({
        type: "detectIsMetaMaskInstalled",
        payload: await detectEthereumProvider(),
      })
    })()
  }, [W3WalletDispatch])

  // 如果有安裝MetaMask，則切換到指定預設的Network
  // 如MetaMask無法切換到此Network，則新增指定Network
  // 偵測帳號，如果有帳號則表示有登入
  useEffect(() => {
    (async () => {
      if (W3Wallet.isMetaMaskInstalled) {
        W3Wallet.provider.on("error", (error) => {
          console.log("hello")
        })
        const chainId = await switchNetwork(W3Wallet.provider)
        const accounts = await detectAccounts(W3Wallet.provider)

        W3WalletDispatch({
          type: "detectNetworkAndAccounts",
          payload: {
            chainId,
            accounts,
          },
        })
      }
    })()
  }, [W3Wallet.isMetaMaskInstalled, W3Wallet.provider, W3WalletDispatch])

  return (
    <>
      {!W3Wallet.isMetaMaskInstalled && (
        <a
          className="inline-block border rounded-lg py-4 px-8"
          target="_blank"
          rel="noreferrer"
          href="https://metamask.io/download.html"
        >
          Install MetaMask
        </a>
      )}
      {!W3Wallet.isMetaMaskConnected && (
        <button
          className="inline-block border rounded-lg py-4 px-8 ml-auto"
          onClick={connectBtnClick}
        >
          Connect Wallet
        </button>
      )}
      {W3Wallet.isMetaMaskConnected && (
        <div className="inline-block border rounded-lg py-4 px-8 ml-auto">
          {W3Wallet.accounts[0]}
        </div>
      )}
    </>
  )
}

export default W3WalletDriver
