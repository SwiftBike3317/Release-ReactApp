export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            var status = "Write a message in the text-field above."
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            var chainId = await window.ethereum.request({
                method: "eth_chainId"
            })
            if (chainId != 0x38 || chainId != 0x1) {
                status = "Change your network to Binance Smart Chain. Chain id should be 0x38"
            }
            const obj = {
                status: status,
                address: addressArray[0],
                chainId: chainId
            };
            return obj
        } catch (err) {
            return {
                status: err.message,
                address: "",
                chainId: ""
            }
        }
    } else {
        return {
            status: (
                <span>
                    <p>
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
            address: "",
            chainId: ""
        }
    }
}


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                var chainId = await window.ethereum.request({
                    method: "eth_chainId"
                })

                if (chainId != 0x38) {
                    return {
                        status: "Change your network to Binance Smart Chain. Chain id should be 0x38",
                        address: "",
                        chainId: ""
                    }
                }
                return {
                    status: "Write a message in the text-field above.",
                    address: addressArray[0],
                    chainId: chainId
                }
            } else {
                return {
                    status: "Connect to Metamask using the top right button.",
                    address: "",
                    chainId: ""
                }
            }
        } catch (err) {
            return {
                status: err.message,
                address: "",
                chainId: ""
            }
        }
    } else {
        return {

            status: (
                <span>
                    <p>
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
            address: "",
            chainId: ""
        }
    }
}


export const getVestingData = async () => {
    var start = await window.vesting.methods.start().call()
    var duration = await window.vesting.methods.duration().call()
    var availableAmount = await window.vesting.methods.releasableAmount('0xbbcf57177d8752b21d080bf30a06ce20ad6333f8').call()
    var beneficiary = await window.vesting.methods.beneficiary().call()
    return {
        beginTime: new Date(start * 1000).toDateString(),
        endTime: new Date(start * 1000 + duration * 1000).toDateString(),
        availableAmount: availableAmount / 10**18,
        beneficiary: beneficiary

    }
}

export const sendRelease = async () => {
    try {
        console.log(window.vesting._address)
        const transactionParams = {
            to: window.vesting._address ,
            from: window.ethereum.selectedAddress,
            data: window.vesting.methods.release('0xbbcf57177d8752b21d080bf30a06ce20ad6333f8').encodeABI()
        }

        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams]
        })

        return {
            succes: true,
            status: "Check transaction on https://bscscan.com/tx/" + txHash
        }

    } catch(err) {
        return {
            success: false,
            status: "Something went wrong " + err.message
        }
    }
}
