import React from "react";
import Header from "./components/header";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Routes, Route } from "react-router-dom";
import Explore from "./pages/explore";
import ListNewNft from "./pages/listNewNft";
import NFTDetails from "./pages/nftDetails";
import Proceeds from "./pages/proceeds";
import { WagmiConfig, createClient } from "wagmi";
import { Buffer } from "buffer";
import { ConnectKitProvider } from "connectkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { NftProvider } from "./context/nft";

const connector = new MetaMaskConnector({
  chains: [chain.rinkeby],
});

function App() {
  if (!window.Buffer) window.Buffer = Buffer;

  const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/23409/nft-marketplace/v0.0.4",
    cache: new InMemoryCache(),
  });

  const { provider, webSocketProvider } = configureChains(
    [chain.rinkeby],
    [publicProvider()]
  );

  const WagmiClient = createClient({
    autoConnect: true,
    provider,
    connectors: [connector],
    webSocketProvider,
  });

  return (
    <div className="App">
      <WagmiConfig client={WagmiClient}>
        <ConnectKitProvider theme="soft" mode="light">
          <ApolloProvider client={client}>
            <Header />
            <NftProvider>
              <div className="grid grid-cols-12 gap-1 px-5 pt-3">
                <Routes>
                  <Route path="/" element={<Explore />} />
                  <Route path="list-new-nft" element={<ListNewNft />} />
                  <Route
                    path="token/:contractAddress/:tokenId"
                    element={<NFTDetails />}
                  />
                  <Route path="proceeds" element={<Proceeds />} />
                </Routes>
              </div>
            </NftProvider>
          </ApolloProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
