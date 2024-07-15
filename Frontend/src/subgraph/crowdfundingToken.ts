import { Transfer } from "./generated/CrowdfundingToken/CrowdfundingToken"
import { Token } from "./generated/schema"

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHex())
  if (!token) {
    token = new Token(event.address.toHex())
    token.name = "CrowdfundingToken"
    token.symbol = "CFT"
    token.totalSupply = BigInt.fromI32(1000000).times(BigInt.fromI32(10).pow(18))
  }
  token.save()
}


