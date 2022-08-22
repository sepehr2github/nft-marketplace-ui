import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import styled from "styled-components";
import nft_abi from "../abis/nft_abi.json";
import NftMarketplace from "../abis/NftMarketplace.json";
import networkMapping from "../utils/networkMapping.json";
import { ethers } from "ethers";

export default function ListNewNft() {
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("0");
  const marketplaceAddress = networkMapping["4"].NftMarketplace[0];

  const { config } = usePrepareContractWrite({
    addressOrName: address as string,
    contractInterface: nft_abi,
    functionName: "approve",
    args: [marketplaceAddress, tokenId],
  });

  const { config: listConfig } = usePrepareContractWrite({
    addressOrName: marketplaceAddress as string,
    contractInterface: NftMarketplace,
    functionName: "listItem",
    args: [
      address,
      tokenId,
      ethers.utils.parseUnits(price, "ether").toString(),
    ],
  });

  const { write: listItemWrite } = useContractWrite({
    ...listConfig,
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  const { write: approveWrite } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("SuccessRiched", data);
      listItemWrite?.();
    },
  });

  return (
    <Container>
      <Card>
        <StyledInput
          required
          id="outlined-required"
          label="NFT Address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress(e.target.value)
          }
          value={address}
          // defaultValue="Hello World"
          sx={{ marginTop: 2, width: "100%" }}
        />
        <StyledInput
          required
          id="outlined-required"
          label="Token ID"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTokenId(e.target.value)
          }
          value={tokenId}
          // defaultValue="Hello World"
          sx={{
            marginTop: 2,
            width: "100%",
          }}
        />
        <StyledInput
          required
          id="outlined-required"
          label="Price (in ETH)"
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
          value={price}
          // defaultValue="Hello World"
          sx={{
            marginTop: 2,
            width: "100%",
          }}
        />
        <Button
          className="mt-5"
          variant="contained"
          color="info"
          onClick={() => {
            approveWrite?.();
          }}
          sx={{ marginTop: 3, width: "100%" }}
        >
          List this NFT
        </Button>
      </Card>
    </Container>
  );
}

const Container = styled.div.attrs({
  className: "p-4 col-start-3 col-span-8 space-y-8",
})``;

const Card = styled.div.attrs({
  className: "flex flex-col p-5 rounded-lg",
})`
  background-color: #5b9ada;
`;

const StyledInput = styled(TextField).attrs({
  className: "w-full",
})``;
