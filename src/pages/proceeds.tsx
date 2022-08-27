import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatEther } from "ethers/lib/utils";

import NftMarketplace from "../abis/NftMarketplace.json";
import networkMapping from "../utils/networkMapping.json";

export default function Proceeds() {
  const { address } = useAccount();
  const [proceed, setProceed] = useState<string>();
  const marketplaceAddress = networkMapping["4"].NftMarketplace[0];

  const { config } = usePrepareContractWrite({
    addressOrName: marketplaceAddress as string,
    contractInterface: NftMarketplace,
    functionName: "withdrawProceeds",
  });

  const { data: proceedJson } = useContractRead({
    addressOrName: marketplaceAddress as string,
    contractInterface: NftMarketplace,
    functionName: "getProceeds",
    args: [address],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  useEffect(() => {
    setProceed(formatEther(proceedJson || 0));
  }, [proceedJson, address]);

  return (
    <Container>
      <Card>
        <Button
          className="mt-5"
          variant="contained"
          color="info"
          onClick={() => {
            write?.();
          }}
          disabled={proceed === "0.0" || !proceed || !address}
          sx={{ marginTop: 3, width: "100%" }}
        >
          Withdraw {proceed} proceeds
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
