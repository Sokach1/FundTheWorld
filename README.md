# FundTheWorld - A Blockchain Based Crowdfunding Platform

## About The Project

FundTheWorld is a decentralized charity platform, similar to Kickstarter, which accepts donations to support crowdfunding projects.

### Built With

- React
- Node.js
- GraphQL
- MySQL
- Express
- Solidity

## Quick Start

### Prerequisites

You need to have [Node.js (v18 LTS)](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads), and the MetaMask browser extension installed on your computer. Additionally, ensure you have an account on the Sepolia testnet.

### Installation

1. **Clone the repository and navigate to the project directory:**

   ```sh
   git clone [<repository-url>](https://github.com/Sokach1/FundTheWorld.git)
   cd FundTheWorld
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

### Express & MySQL Configuration

1. **Configure MySQL in `express/utils/db.js`:**

   ```javascript
   const mysql = require('mysql');
   
   const connection = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '123456',
       database: 'demow'
   });
   
   module.exports = connection;
   ```

2. **Navigate to the Backend directory and start the server:**

   ```sh
   cd Backend
   node app.js
   ```

3. **Verify connection:** Open a browser and navigate to:

   ```arduino
   http://127.0.0.1:5000
   ```

   You should see "Successfully connected".

### GraphQL & React Setup

1. **Navigate to the Front-end directory and install dependencies:**

   ```sh
   cd Front-end
   npm install
   ```

2. **Start GraphQL and React:**

   ```sh
   npm run start
   ```

   Or start them individually:

   - **GraphQL:** `npm run start-graphql`
   - **React:** `npm run start-react`

### Generate Wallet

1. **Install Geth** https://geth.ethereum.org/downloads
2. **Open a terminal and create a wallet for the testnet:**

```sh
geth --sepolia account new
geth --sepolia account list
```

Save the wallet address and passphrase for future reference.

3. **Fund your wallet:** Go to [Alchemy's Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia), enter your wallet address, confirm *I’m not a robot*, and click *Send Me ETH*.

4. **Verify the transaction:** After sending ETH, follow the Etherscan transaction link to verify the transaction.

### Connect Wallet to MetaMask

1. **Install MetaMask:** Go to [MetaMask](https://metamask.io/) and install the extension for your browser (Chrome, Firefox, Brave, Edge, Opera).

2. **Import account:**

   - Click **Account 1** in MetaMask to open the menu.

   - Choose **Import account** and select **JSON file**.

   - Run the command to list your accounts:

     ```sh
     geth --sepolia account list
     ```

   - Locate your keystore file and upload it.

   - Enter your wallet passphrase and complete the import.

3. **Visit FundTheWorld:** After connecting your wallet to MetaMask, you can start using the FundTheWorld platform and connect to our Sepolia testnet.

## Additional Information

For more details on setting up and using FundTheWorld, please refer to the documentation or contact the development team.
