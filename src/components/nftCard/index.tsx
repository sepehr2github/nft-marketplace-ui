import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useContractRead } from "wagmi";
import Button from "@mui/material/Button";

import nft_abi from "../../abis/nft_abi.json";
import { shortenAddress } from "../../utils/addresses";
import { useNavigate } from "react-router-dom";

type NftCardProps = {
  address: string;
  tokenId: number;
  price: bigint;
};

export function NftCard({ address, tokenId, price }: NftCardProps) {
  const [tokenURI, setTokenURI] = useState();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  let navigate = useNavigate();

  const { data: tokenURIJson } = useContractRead({
    addressOrName: address,
    contractInterface: nft_abi,
    functionName: "tokenURI",
    args: [tokenId],
  });

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

  return (
    <Card>
      <NftImage src={image} />
      <NetworkInfoWrapper>
        <span className="text-sky-500 text-base">
          {shortenAddress(address)}
        </span>
        <span className="text-sky-900	text-base">Rinkeby</span>
      </NetworkInfoWrapper>
      <MetadataWrapper>
        <div className="text-sm text-sky-900">{name}</div>
        <div className="text-sky-900 text-sm">{formatEther(price)} ETH</div>
      </MetadataWrapper>
      <ActionWrapper>
        <StyledButton
          variant="contained"
          size="small"
          onClick={() => {
            navigate(`/token/${address}/${tokenId}`);
          }}
          color="info"
        >
          View
        </StyledButton>
      </ActionWrapper>
    </Card>
  );
}

const Card = styled.div.attrs({
  className:
    "flex flex-col items-center justify-center rounded-lg w-56 overflow-hidden space-y-2",
})`
  background-color: rgba(0, 58, 117, 0.2);
`;

const NftImage = styled.img.attrs({
  className: "max-h-56 border-b-2 border-slate-500 border-dashed",
})``;

const NetworkInfoWrapper = styled.div.attrs({
  className: "flex px-1 pt-1 justify-between",
})`
  width: 200px;
`;

const MetadataWrapper = styled.div.attrs({
  className: "flex px-1 pb-3 justify-between",
})`
  width: 200px;
`;

const ActionWrapper = styled.div.attrs({
  className: "flex pb-3 justify-center",
})`
  width: 200px;
`;

const StyledButton = styled(Button).attrs({
  className: "rounded-lg w-full",
})`
  text-color: #fff !important;
`;
