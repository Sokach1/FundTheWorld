import { ProjectCreated, DonationReceived, FundsRefunded, WithdrawalRequested, WithdrawalVoted, WithdrawalExecuted } from "../generated/Crowdfunding/Crowdfunding"
import { Project, WithdrawalRequest } from "./generated/schema.ts"

export function handleProjectCreated(event: ProjectCreated): void {
  let project = new Project(event.params.projectId.toString())
  project.creator = event.params.creator
  project.name = event.params.name
  project.description = event.params.description
  project.goal = event.params.goal
  project.startTime = event.params.startTime
  project.endTime = event.params.endTime
  project.fundsRaised = BigInt.fromI32(0)
  project.balance = BigInt.fromI32(0)
  project.fundsRefunded = false
  project.save()
}

export function handleDonationReceived(event: DonationReceived): void {
  let project = Project.load(event.params.projectId.toString())
  if (project) {
    project.fundsRaised = project.fundsRaised.plus(event.params.amount)
    project.balance = project.balance.plus(event.params.amount)
    project.save()
  }
}

export function handleFundsRefunded(event: FundsRefunded): void {
  let project = Project.load(event.params.projectId.toString())
  if (project) {
    project.fundsRefunded = true
    project.save()
  }
}

export function handleWithdrawalRequested(event: WithdrawalRequested): void {
  let request = new WithdrawalRequest(event.params.requestId.toString())
  request.projectId = event.params.projectId.toString()
  request.amount = event.params.amount
  request.description = event.params.description
  request.startTime = event.params.startTime
  request.endTime = event.params.endTime
  request.executed = false
  request.approvalVotes = BigInt.fromI32(0)
  request.disapprovalVotes = BigInt.fromI32(0)
  request.approvers = []
  request.disapprovers = []
  request.save()
}

export function handleWithdrawalVoted(event: WithdrawalVoted): void {
  let request = WithdrawalRequest.load(event.params.requestId.toString())
  if (request) {
    if (event.params.approve) {
      request.approvalVotes = request.approvalVotes.plus(BigInt.fromI32(1))
      request.approvers.push(event.params.voter)
    } else {
      request.disapprovalVotes = request.disapprovalVotes.plus(BigInt.fromI32(1))
      request.disapprovers.push(event.params.voter)
    }
    request.save()
  }
}

export function handleWithdrawalExecuted(event: WithdrawalExecuted): void {
  let request = WithdrawalRequest.load(event.params.requestId.toString())
  if (request) {
    request.executed = true
    request.save()
  }
}
