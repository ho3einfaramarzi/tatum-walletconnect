let accounts = [];
let user_uuid;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;
let web3Modal
let provider;
let web3;

document.querySelector('#btn-connect').addEventListener('click', async () => {
  connect_func();
  });
async function connect_func(){

        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: rpc_config,
                        }
          }
        };
        web3Modal = new Web3Modal({
          cacheProvider: true, // optional
          providerOptions, // required
          disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });      
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });  
    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });
    await refreshAccountData();
  }
  async function fetchAccountData() {
     web3 = new Web3(provider);
    const chainId = await web3.eth.getChainId();
    selected_chain=chainId;
    let accountp = await web3.eth.getAccounts();
    selectedAccount = accountp[0];
    accounts=selectedAccount;
    document.querySelector("#btn-connect").textContent = selectedAccount; 
}


function get_transaction(){
  const headers = {
"x-api-key": "xxxxx"
  }
axios.get('https://api-eu1.tatum.io/v3/kms/5e6645712b55823de7ea82f1', {}, {
    headers: headers
  })
  .then((response) => {
          const txConfigs = JSON.parse(response.serializedTransaction);
txConfigs.from = accounts;
txConfigs.gasPrice = txConfigs.gasPrice;
   send_toeth(txConfigs);
  })
  .catch((error) => {
    console.log(error);
  })

}

function send_to_eth(txConfigs){
  web3.eth.sendTransaction(txConfigs, function(err, transactionHash) {
    if (!err){
      console.log(transactionHash + " success"); 
    }else{
           console.log(err + " error"); 
      }
  });

}
