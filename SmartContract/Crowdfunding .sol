// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {

    struct WithdrawalRequest {
        uint256 amount;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        uint256 approvalVotes;
        uint256 disapprovalVotes;
        address[] approvers;
        address[] disapprovers;
    }

    struct Project {
        address payable creator;
        string name;
        string description;
        string category;
        uint256 goal;
        uint256 startTime;
        uint256 endTime;
        uint256 fundsRaised;
        uint256 balance;
        bool fundsRefunded;
        mapping(address => uint256) contributions;
        address[] contributors;
        WithdrawalRequest[] withdrawalRequests;
    }

    // Deployed ERC20 contract
    IERC20 private _myToken;
    uint256 private projectCount;

    // Projects by ID
    mapping(uint256 => Project) public projects;
    

    event ProjectCreated(uint256 projectId, address indexed creator, string name, string description, string categpory, uint256 goal, uint256 startTime, uint256 endTime);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);
//    event FundsReleased(uint256 indexed projectId);
    event FundsRefunded(uint256 indexed projectId);
    event WithdrawalRequested(uint256 indexed projectId, uint256 requestId, uint256 amount, uint256 startTime, uint256 endTime);
    event WithdrawalVoted(uint256 indexed projectId, uint256 requestId, bool approve);
    event WithdrawalExecuted(uint256 indexed projectId, uint256 requestId);

    constructor(address tokenAddr) {
        _myToken = IERC20(tokenAddr);
    }

    function createProject(string memory name, string memory description, string memory category, uint256 goal, uint256 duration) external returns (uint256) {
        uint256 projectId = projectCount;

        Project storage project = projects[projectId];
        project.creator = payable(msg.sender);
        project.name = name;
        project.description = description;
        project.category = category;
        project.goal = goal;
        project.startTime = block.timestamp;
        project.endTime = block.timestamp + duration;
//        project.fundsReleased = false;
        project.fundsRefunded = false;
        project.balance = 0;
        
        projectCount++;

        emit ProjectCreated(projectId, msg.sender, name, description, category, goal, project.startTime, project.endTime);
        return projectId;
    }

    function donate(uint256 projectId, uint256 amount) external {
        Project storage project = projects[projectId];
        require(block.timestamp < project.endTime, "Project deadline has passed");
        require(_myToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        if (project.contributions[msg.sender] == 0) {
            project.contributors.push(msg.sender);
        }
        project.contributions[msg.sender] += amount;
        project.fundsRaised += amount;

        emit DonationReceived(projectId, msg.sender, amount);

        if (project.fundsRaised >= project.goal) {
            project.endTime = block.timestamp; // Auto end project
            project.balance = project.fundsRaised;
        }
    }

//    function releaseFunds(uint256 projectId) external {
//        Project storage project = projects[projectId];
//        require(block.timestamp >= project.endTime, "Project deadline not reached");
//        require(project.fundsRaised >= project.goal, "Funding goal not reached");
//        require(!project.fundsReleased, "Funds already released");
//        require(msg.sender == project.creator, "Only project creator can release funds");
//
//        project.fundsReleased = true;
//        require(_myToken.transfer(project.creator, project.fundsRaised), "Token transfer failed");
//
//        emit FundsReleased(projectId);
//    }

    function refund(uint256 projectId) external {
        Project storage project = projects[projectId];
        require(block.timestamp >= project.endTime, "Project deadline not reached");
        require(project.fundsRaised < project.goal, "Funding goal was reached");
        require(!project.fundsRefunded, "Funds already refunded");
        // require(msg.sender == project.creator, "Only project creator can release funds");
        
        project.fundsRefunded = true;
        for (uint256 i = 0; i < project.contributors.length; i++) {
            address contributor = project.contributors[i];
            uint256 contribution = project.contributions[contributor];

            if (contribution > 0) {
                require(_myToken.transfer(contributor, contribution), "Token transfer failed");
                project.contributions[contributor] = 0;
            }
        }

        emit FundsRefunded(projectId);
    }

    function getProjectDetails(uint256 projectId) external view returns (address, string memory, string memory, uint256, uint256, uint256, uint256, bool, uint256) {
        Project storage project = projects[projectId];
        return (
            project.creator,
            project.name,
            project.description,
            project.goal,
            project.startTime,
            project.endTime,
            project.fundsRaised,
//            project.fundsReleased,
            project.fundsRefunded,
            project.balance
        );
    }

    function getContributions(uint256 projectId) external view returns (address[] memory, uint256[] memory) {
        Project storage project = projects[projectId];
        uint256[] memory amounts = new uint256[](project.contributors.length);

        for (uint256 i = 0; i < project.contributors.length; i++) {
            amounts[i] = project.contributions[project.contributors[i]];
        }

        return (project.contributors, amounts);
    }

    function getUserContributions(address user) external view returns (uint256[] memory) {
        uint256[] memory contributions = new uint256[](projectCount);

        for (uint256 i = 1; i <= projectCount; i++) {
            contributions[i - 1] = projects[i].contributions[user];
        }

        return contributions;
    }

    function requestWithdrawal(uint256 projectId, string memory description, uint256 amount, uint256 votingDuration) external {
        Project storage project = projects[projectId];
        require(msg.sender == project.creator, "Only project creator can request withdrawal");
        
        require(project.balance >= amount, "Insufficient funds");

        uint256 requestId = project.withdrawalRequests.length;
        address[] memory approveArray;
        address[] memory disapproveArray;
       
       WithdrawalRequest memory newRequest = WithdrawalRequest({
            amount: amount,
            description: description,
            startTime: block.timestamp,
            endTime: block.timestamp + votingDuration,
            executed: false,
            approvalVotes: 0,
            disapprovalVotes: 0,
            approvers: approveArray,
            disapprovers: disapproveArray
        });
    
        project.withdrawalRequests.push(newRequest);


        emit WithdrawalRequested(projectId, requestId, amount, block.timestamp, block.timestamp + votingDuration);
    }


    function voteForWithdrawal(uint256 projectId, uint256 requestId, bool approve) external {
        Project storage project = projects[projectId];
        WithdrawalRequest storage request = project.withdrawalRequests[requestId];
        require(block.timestamp < request.endTime, "Voting period has end");
        require(project.contributions[msg.sender] > 0, "Only contributors can vote");
        require(!isInArray(request.approvers, msg.sender) && !isInArray(request.disapprovers, msg.sender), "Already voted");

        if (approve) {
            request.approvers.push(msg.sender);
            request.approvalVotes += project.contributions[msg.sender];
        } else {
            request.disapprovers.push(msg.sender);
            request.disapprovalVotes += project.contributions[msg.sender];
        }
        emit WithdrawalVoted(projectId, requestId, approve);
    }

    function executeWithdrawal(uint256 projectId, uint256 requestId) external {
        Project storage project = projects[projectId];
        WithdrawalRequest storage request = project.withdrawalRequests[requestId];
        require(block.timestamp >= request.endTime, "Voting period not ended");
        require(!request.executed, "Request already executed");
        require(request.approvalVotes + request.disapprovalVotes > project.fundsRaised / 2, "Not enough votes");
        require(request.approvalVotes > request.disapprovalVotes, "Disapproval votes exceed approval votes");

        request.executed = true;
        project.balance -= request.amount;
        require(_myToken.transfer(project.creator, request.amount), "Token transfer failed");

        emit WithdrawalExecuted(projectId, requestId);
    }

    function getUserVotes(address user) external view returns (bool[][] memory, bool[][] memory) {
        bool[][] memory approvalVotes = new bool[][](projectCount);
        bool[][] memory disapprovalVotes = new bool[][](projectCount);

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            bool[] memory projectApprovalVotes = new bool[](project.withdrawalRequests.length);
            bool[] memory projectDisapprovalVotes = new bool[](project.withdrawalRequests.length);

            for (uint256 j = 0; j < project.withdrawalRequests.length; j++) {
                bool isApprover = isInArray(project.withdrawalRequests[j].approvers, user);
                bool isDisapprover = isInArray(project.withdrawalRequests[j].disapprovers, user);

                projectApprovalVotes[j] = isApprover;
                projectDisapprovalVotes[j] = isDisapprover;
            }

            approvalVotes[i - 1] = projectApprovalVotes;
            disapprovalVotes[i - 1] = projectDisapprovalVotes;
        }

    return (approvalVotes, disapprovalVotes);
    }

    function isInArray(address[] storage array, address element) internal view returns (bool) {
    for (uint256 i = 0; i < array.length; i++) {
        if (array[i] == element) {
            return true;
        }
    }
    return false;
    }

    function getAllProjects() external view returns (address[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory, uint256[] memory, uint256[] memory) {
        address[] memory creators = new address[](projectCount);
        string[] memory names = new string[](projectCount);
        string[] memory descriptions = new string[](projectCount);
        uint256[] memory goals = new uint256[](projectCount);
        uint256[] memory startTimes = new uint256[](projectCount);
        uint256[] memory endTimes = new uint256[](projectCount);
        uint256[] memory fundsRaised = new uint256[](projectCount);
        

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            creators[i - 1] = project.creator;
            names[i - 1] = project.name;
            descriptions[i - 1] = project.description;
            goals[i - 1] = project.goal;
            startTimes[i - 1] = project.startTime;
            endTimes[i - 1] = project.endTime;
            fundsRaised[i - 1] = project.fundsRaised;
        }

        return (creators, names, descriptions, goals, startTimes, endTimes, fundsRaised);
    }

    function getCreatorProjects(address creator) external view returns (uint256[] memory) {
        uint256[] memory creatorProjectIds = new uint256[](projectCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (projects[i].creator == creator) {
                creatorProjectIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = creatorProjectIds[j];
        }

        return result;
    }
    function getProjectWithdrawals (uint256 projectId) external view returns (WithdrawalRequest[] memory) {
        return projects[projectId].withdrawalRequests;

    }
}