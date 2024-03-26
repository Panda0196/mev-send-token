const { ethers } = require("ethers")

const infuraUrl = "wss://goerli.infura.io/ws/v3/xxx"
const contractAddr = "0xf92ec1b0ad75721e3a12ad9e67759353d6518f74"
const contractAbi = '[{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
const txPrefix = "0xa9059cbb000000000000000000000000walletaddress3"
const senderPkey = "BBC"
const receiverAddr = "receiver wallet"

const provider = new ethers.WebSocketProvider(infuraUrl)
const wallet = new ethers.Wallet(senderPkey, provider)
const contract = new ethers.Contract(contractAddr, contractAbi, wallet)

provider.on("pending", (txHash) => {
    setTimeout(async () => {
        try {
            let tx = await provider.getTransaction(txHash)
            if (tx && tx.to && tx.to.toLowerCase() === contractAddr && tx.data.slice(0, 74) === txPrefix) {
                await contract.transfer(receiverAddr, BigInt("0x" + tx.data.slice(74)))
                console.log(`Redirect LFI Token to address ${receiverAddr}`)
            }
        } catch (err) {
            console.error("Error:", err)
        }
    })
})