function W3WalletReducer (state, action) {
  switch (action.type) {
    case "detectIsMetaMaskInstalled":
      return {
        ...state,
        isMetaMaskInstalled: !!action.payload?.isMetaMask,
        provider: action.payload,
      }
    case "detectNetworkAndAccounts":
      return {
        ...state,
        chainId: action.payload.chainId,
        accounts: action.payload.accounts.length > 0 ? action.payload.accounts : state.accounts,
        isMetaMaskConnected: action.payload.accounts.length > 0,
      }
    case "updateProvider":
      return {
        ...state,
        provider: action.payload,
      }
    case "updateChainId":
      return {
        ...state,
        chainId: action.payload,
      }
    case "updateAccounts":
      return {
        ...state,
        accounts: action.payload.accounts.length > 0 ? action.payload.accounts : state.accounts,
        isMetaMaskConnected: action.payload.accounts.length > 0,
      }
    default:
      throw new Error()
  }
}

export default W3WalletReducer
