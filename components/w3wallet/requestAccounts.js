async function requestAccounts (ethereum) {
  let accounts = []

  try {
    accounts = await ethereum.request({
      method: "eth_requestAccounts",
    })
  } catch (requestAccountsError) {
  } finally {
    return accounts
  }
}

export default requestAccounts
