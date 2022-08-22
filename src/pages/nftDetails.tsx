import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  useContractRead,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { Snackbar, Button, Alert } from "@mui/material";
import { ethers } from "ethers";
import networkMapping from "../utils/networkMapping.json";

import { GET_ACTIVE_ITEMS_PRICE } from "../queries/listing";
import nft_abi from "../abis/nft_abi.json";
import NftMarketplace from "../abis/NftMarketplace.json";
import { formatEther } from "ethers/lib/utils";
import { shortenAddress } from "../utils/addresses";

const NFTDetails = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [connectionAlert, setConnectionAlert] = useState(false);
  const { contractAddress, tokenId } = useParams();
  const { address, isDisconnected } = useAccount();

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS_PRICE, {
    variables: { address: contractAddress },
  });

  const isOwnedByUser = address?.toLowerCase() === data?.activeItems[0].seller;
  const marketplaceAddress = networkMapping["4"].NftMarketplace[0];

  const { data: tokenURIJson } = useContractRead({
    addressOrName: contractAddress as string,
    contractInterface: nft_abi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const { config } = usePrepareContractWrite({
    addressOrName: marketplaceAddress as string,
    contractInterface: NftMarketplace,
    functionName: "buyItem",
    overrides: {
      from: address,
      value: data?.activeItems[0].price,
    },
    args: [contractAddress, tokenId],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    async function updateData() {
      if (tokenURIJson) {
        const requestURL = tokenURIJson.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        const tokenURIResponse = await (await fetch(requestURL)).json();
        const imageURI = tokenURIResponse.image;
        const imageURIURL = imageURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setImage(imageURIURL);
        setName(tokenURIResponse.name);
        setDescription(tokenURIResponse.description);
      }
    }

    updateData();
  }, [tokenURIJson]);

  const buyToken = () => {
    if (isDisconnected) {
      setConnectionAlert(true);
      return;
    }
    write?.();
  };

  return (
    <PageContainer>
      <ImageContainer>
        <NftPreview src={image} />
      </ImageContainer>
      <DescriptionContainer>
        <div className="space-y-3">
          <Title>{name}</Title>
          <Description>{description}</Description>
        </div>
        <PriceContainer>
          <PriceLabel>Price:</PriceLabel>
          <PriceWrapper>
            {formatEther(data?.activeItems[0].price || 0)} ETH
          </PriceWrapper>
        </PriceContainer>
        <AuthorContainer>
          <span className="text-neutral-400">By: </span>
          <span className="text-neutral-400">
            {isOwnedByUser
              ? "You"
              : shortenAddress(data?.activeItems[0].seller)}
          </span>
        </AuthorContainer>
        <ActionWrapper>
          <Button
            className="mt-5"
            variant="contained"
            onClick={buyToken}
            color="info"
          >
            Buy this NFT
          </Button>
        </ActionWrapper>
      </DescriptionContainer>
      <Snackbar
        open={connectionAlert}
        autoHideDuration={6000}
        onClose={() => setConnectionAlert(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setConnectionAlert(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please connect your wallet first!
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default NFTDetails;

const PageContainer = styled.div.attrs({
  className: "flex p-4 col-start-3 col-span-8 space-x-36",
})``;

const ImageContainer = styled.div.attrs({
  className: "font-bold text-4xl text-slate-800",
})``;

const NftPreview = styled.img.attrs({
  className: "rounded-lg py-5 border-2 border-slate-500 border-dashed",
})`
  background-color: rgba(0, 58, 117, 0.2);
`;

const DescriptionContainer = styled.div.attrs({
  className: "text-neutral-400",
})``;

const PriceContainer = styled.div.attrs({
  className: "mt-[40px]",
})``;

const AuthorContainer = styled.div.attrs({
  className: "mt-[10px]",
})``;

const PriceLabel = styled.span.attrs({
  className: "text-sm	text-neutral-400",
})``;

const PriceWrapper = styled.span.attrs({
  className: "text-4xl text-cyan-500 flex flex-col",
})``;

const Title = styled.h2.attrs({
  className: "font-bold text-4xl text-white",
})``;

const Description = styled.p.attrs({
  className: "",
})``;

const ActionWrapper = styled.div.attrs({
  className: "pt-10",
})``;
