import FungibleToken from "../../contracts/FungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"

// This script returns the balance of an account's FUSD vault, or 0 if no vault exists
//
// Parameters:
// - address: The address of the account holding the FUSD vault.
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.getCapability(/public/fusdBalance)
        .borrow<&FUSD.Vault{FungibleToken.Balance}>()

    return vaultRef?.balance ?? 0.0
}