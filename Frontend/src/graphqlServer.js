const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const {Web3} = require('web3');




// 初始化 web3
const token = new Web3((new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/2d5ceb10076349dba938c3eb1d20451c'))); // 区块链节点地址


// 智能合约token的 ABI 和地址
const tokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'abi', 'CrowdfundingToken.json'), 'utf8'));
const tokenAddress = '0x19C55Add8dcbb16D61B700bc7EDfD81F39A8aC52'; // 智能合约token地址

// 创建合约实例
const TokenContract = new token.eth.Contract(tokenABI, tokenAddress);

//智能合约的ABI和地址
const contractABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'abi', 'Crowdfunding.json'), 'utf8'));
const contractAddress = '0x92259A35013Ef6A4C7013ec7a6EF155c3f9E789C'; // 智能合约地址

// 创建合约实例
const CFContract = new token.eth.Contract(contractABI, contractAddress);

const typeDefs = gql`
 type Query {
    totalSupply: String
    balanceOf(address: String!): String
    getAllProjects: String
    getProjectDetails(id: ID!): String
    getContributions(id: ID!): String
    getCreatorProjects(address: String!): String
    getUserContributions(address: String!): String
    getUserVotes(address: String!): String
  },
  type Mutation {
    createProject(name: String!, description: String!, goal: Float!, duration: Int!): ID!
    donate(projectId: ID!, amount: Float!): Boolean!
    refund(projectId: ID!): Boolean!
    requestWithdrawal(projectId: ID!, description: String!, amount: Float!, votingDuration: Int!): Boolean!
    voteForWithdrawal(projectId: ID!, requestId: ID!, approve: Boolean!): Boolean!
    executeWithdrawal(projectId: ID!, requestId: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    totalSupply: async () => {
        const result = await TokenContract.methods.totalSupply().call();
        return result.toString();
    },

    balanceOf: async (_, { address }) => {
        const result = await TokenContract.methods.balanceOf(address).call();
        return result.toString();
    },

    getAllProjects: async () => {
        const projectData = await CFContract.methods.getAllProjects().call();
        const projects = [];

        for (let i = 0; i < projectData[0].length; i++) {
            projects.push({
                creator: projectData[0][i],
                name: projectData[1][i],
                description: projectData[2][i],
                goal: Number(projectData[3][i]),
                startTime: Number(projectData[4][i]),
                endTime: Number(projectData[5][i]),
                balance: Number(projectData[6][i]),
            });
        }
        console.log(projects)
        return JSON.stringify(projects);
    },

    getProjectDetails: async (_, { id }) => {
      const project = await CFContract.methods.getProjectDetails(id).call();
      const projectDetails = [];
      projectDetails.push({
        creator: project[0],
        name: project[1],
        description: project[2],
        goal: Number(project[3]),
        startTime: Number(project[4]),
        endTime: Number(project[5]),
        balance: Number(project[6]),
      })
      console.log(projectDetails)
      return JSON.stringify(projectDetails);
    },

    getContributions: async (_, { id }) => {
      console.log(id)
      const contributionData = await CFContract.methods.getContributions(id).call();
      const contributions = [];

      for(let i = 0; i < contributionData[0].length; i++) {
        contributions.push({
          contributors: contributionData[0][i],
          amount: Number(contributionData[1][i]),
        });
      }

      console.log(contributions)
      return JSON.stringify(contributions);
    },

    getCreatorProjects: async (_, { address }) => {
      console.log(address)
      const creatorProjects = await CFContract.methods.getCreatorProjects(address).call();

      console.log(creatorProjects)
      return JSON.stringify(creatorProjects.map((amount) => amount.toString()));
    },

    getUserContributions: async (_, { address }) => {
      console.log(address)
      const userContributions = await CFContract.methods.getUserContributions(address).call();
      return JSON.stringify(userContributions.map((amount) => amount.toString()));
    },

    getUserVotes: async (_, { address }) => {
      console.log(address)
      const voteData = await CFContract.methods.getUserVotes(address).call();

      console.log(voteData)
      return JSON.stringify(voteData);
    },
  },

  Mutation: {
    createProject: async (_, { name, description, goal, duration }) => {
      const accounts = await Web3.eth.getAccounts();
      const receipt = await CFContract.methods.createProject(name, description, Web3.utils.toWei(goal.toString(), 'ether'), duration).send({ from: accounts[0] });
      return receipt.events.ProjectCreated.returnValues.projectId;
    },
    donate: async (_, { projectId, amount }) => {
      const accounts = await Web3.eth.getAccounts();
      await CFContract.methods.donate(parseInt(projectId), Web3.utils.toWei(amount.toString(), 'ether')).send({ from: accounts[0] });
      return true;
    },
    refund: async (_, { projectId }) => {
      const accounts = await Web3.eth.getAccounts();
      await CFContract.methods.refund(parseInt(projectId)).send({ from: accounts[0] });
      return true;
    },
    requestWithdrawal: async (_, { projectId, description, amount, votingDuration }) => {
      const accounts = await Web3.eth.getAccounts();
      await CFContract.methods.requestWithdrawal(
        parseInt(projectId),
        description,
        Web3.utils.toWei(amount.toString(), 'ether'),
        votingDuration
      ).send({ from: accounts[0] });
      return true;
    },
    voteForWithdrawal: async (_, { projectId, requestId, approve }) => {
      const accounts = await Web3.eth.getAccounts();
      await CFContract.methods.voteForWithdrawal(
        parseInt(projectId),
        parseInt(requestId),
        approve
      ).send({ from: accounts[0] });
      return true;
    },
    executeWithdrawal: async (_, { projectId, requestId }) => {
      const accounts = await Web3.eth.getAccounts();
      await CFContract.methods.executeWithdrawal(
        parseInt(projectId),
        parseInt(requestId)
      ).send({ from: accounts[0] });
      return true;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Add the web3 instance to the context
    return { Web3 };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
