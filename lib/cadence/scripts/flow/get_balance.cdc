import FungibleToken from "../../contracts/FungibleToken.cdc"
// TODO -- use an enviornment-specific address
// Only used for testing so it's not a critical issue at the moment
import FlowToken from 0x0ae53cb6e3f42a79

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
