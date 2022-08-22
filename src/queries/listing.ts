import { gql } from "@apollo/client";

export const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export const GET_ACTIVE_ITEMS_PRICE = gql`
  query Dog($address: String!) {
    activeItems(nftAddress: $address) {
      id
      price
      nftAddress
      seller
    }
  }
`;
