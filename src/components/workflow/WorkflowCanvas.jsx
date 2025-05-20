
// This file requires an update to fix the icon usage error. Since I don't have the full content of this file,
// I'll include instructions for the modification needed:

// 1. Ensure the correct import for Clock, Database, and other icons from lucide-react
// 2. Make sure you're using JSX element syntax rather than React.ReactNode for icons
// 3. If there's a getNodeIcon function, ensure it returns JSX elements, not just icon components

// For example, replace:
//    return nodeType.includes('web3-wallet') ? Wallet : 
//           nodeType.includes('web3-defi') ? ArrowLeftRight :
//           // ... other mappings

// With:
//    return nodeType.includes('web3-wallet') ? <Wallet /> : 
//           nodeType.includes('web3-defi') ? <ArrowLeftRight /> :
//           // ... other mappings
