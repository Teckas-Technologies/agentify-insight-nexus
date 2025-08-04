import { ReactNode } from "react";
import { http, Transport } from "wagmi";
import {
  mainnet,
  bsc,
  arbitrum,
  base,
  blast,
  avalanche,
  polygon,
  scroll,
  optimism,
  linea,
  zksync,
  gnosis,
  fantom,
  moonriver,
  moonbeam,
  fuse,
  boba,
  mode,
  metis,
  lisk,
  unichain,
  aurora,
  sei,
  immutableZkEvm,
  sonic,
  gravity,
  taiko,
  soneium,
  cronos,
  fraxtal,
  abstract,
  rootstock,
  celo,
  worldchain,
  mantle,
  ink,
  berachain,
  kaia,
  sepolia,
  polygonZkEvm,
  lens,
} from "viem/chains";
import {
  WagmiProvider,
  createConfig as createWagmiConfig,
} from "@privy-io/wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
// List of Wagmi connectors
const connectors = [injected()];
const queryClient = new QueryClient();
// Create Wagmi config with default chain and without connectors
const supportedChains = [
  mainnet,
  bsc,
  arbitrum,
  base,
  blast,
  avalanche,
  polygon,
  scroll,
  optimism,
  linea,
  zksync,
  polygonZkEvm,
  gnosis,
  fantom,
  moonriver,
  moonbeam,
  fuse,
  boba,
  mode,
  metis,
  lisk,
  unichain,
  aurora,
  sei,
  immutableZkEvm,
  sonic,
  gravity,
  taiko,
  soneium,
  lens,
  cronos,
  fraxtal,
  abstract,
  rootstock,
  celo,
  worldchain,
  mantle,
  ink,
  berachain,
  kaia,
  sepolia,
]

const transports: Record<number, Transport> = Object.fromEntries(
  supportedChains.map((chain) => [chain.id, http()])
);

export const wagmiConfig = createWagmiConfig({
  chains: [
    mainnet,
    bsc,
    arbitrum,
    base,
    blast,
    avalanche,
    polygon,
    scroll,
    optimism,
    linea,
    zksync,
    polygonZkEvm,
    gnosis,
    fantom,
    moonriver,
    moonbeam,
    fuse,
    boba,
    mode,
    metis,
    lisk,
    unichain,
    aurora,
    sei,
    immutableZkEvm,
    sonic,
    gravity,
    taiko,
    soneium,
    lens,
    cronos,
    fraxtal,
    abstract,
    rootstock,
    celo,
    worldchain,
    mantle,
    ink,
    berachain,
    kaia,
    sepolia,
  ],
  transports,
  // client({ chain }) {
  //   return createClient({ chain, transport: http() });
  // },
});

const appId = import.meta.env.VITE_PRIVY_APP_ID;
const clientId = import.meta.env.VITE_PRIVY_CLIENT_ID;

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
  },
  defaultChain: mainnet,
  supportedChains: supportedChains,
  loginMethods: ["wallet", "email", "sms", "google"],
  appearance: {
    walletChainType: "ethereum-only",
    showWalletLoginFirst: false,
    landingHeader: 'Welcome to Agentify',
    // loginMessage: 'Sign in with your wallet or Google to swap, bridge tokens, or lend & borrow across chains with ease.',
    theme: "dark",
    accentColor: "#676FFF",
    logo: "https://gfxvsstorage.blob.core.windows.net/gfxvscontainer/agentify-logo-orange.png",
  },
};

export const CustomWagmiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PrivyProvider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      appId={appId}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
