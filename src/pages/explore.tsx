import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_ACTIVE_ITEMS } from "../queries/listing";
import { NFT } from "../utils/types";
import { NftCard } from "../components/nftCard";

const Explore = () => {
  const { error, data } = useQuery(GET_ACTIVE_ITEMS);
  console.log("error", error);

  return (
    <PageContainer>
      <TitleWrapper>
        <Title>Explore NFTs</Title>
        <Subtitle>2 Token Available</Subtitle>
      </TitleWrapper>
      <div className="grid grid-cols-4 gap-20">
        {data?.activeItems?.map((nft: NFT) => (
          <NftCard
            address={nft.nftAddress}
            tokenId={nft.tokenId}
            price={nft.price}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Explore;

const PageContainer = styled.div.attrs({
  className: "p-4 col-start-3 col-span-8 space-y-5",
})``;

const Title = styled.h1.attrs({
  className: "font-bold text-4xl text-white",
})``;

const Subtitle = styled.span.attrs({
  className: "text-base text-slate-500",
})``;

const TitleWrapper = styled.span.attrs({
  className: "flex flex-col space-y-3 mb-3",
})``;
