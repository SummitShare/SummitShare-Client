# SummitShare Dapp Directory README 📚

[![Netlify Status](https://api.netlify.com/api/v1/badges/c21af451-8490-4a50-8f85-116651d56820/deploy-status)](https://app.netlify.com/sites/summitshare/deploys)

## Overview

The SummitShare Dapp Directory houses the platform's frontend, built on `Next.js` with `TypeScript` and managed with `yarn`, set to strict type safety. This directory is crucial for enabling dynamic, user-centric interactions with the SummitShare event management and ticketing web application. It encompasses React frontend components, scripts for smart contract interactions, and APIs for comprehensive platform functionality.

### Frontend Breakdown 🎨

- **Capabilities**: The frontend facilitates browsing exhibitions, connecting wallets, purchasing ERC-721 ticket tokens, and accessing virtual (and potentially IRL) exhibitions. For exhibit creators, it offers a comprehensive form for organizing exhibitions, including stakeholder invitations and proposal submissions.
- **Architecture**: Leveraging Next.js and TypeScript, the architecture ensures robust, scalable, and type-safe development. Apollo Client is utilized for GraphQL queries to the subgraph, ensuring real-time data updates.


### Development Commands 🛠️

To get started with development, use the following `pnpm` commands:

```bash
yarn i        # Install deps
yarn dev      # Runs the development server
yarn build    # Builds the application for production
yarn start    # Starts a Next.js production server
yarn lint     # Lints the project files
```
