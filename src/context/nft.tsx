import { createContext, useMemo, ReactNode, useContext, useState } from "react";

type ContextType = {
  imagePreview: string;
  setImagePreview: (value: string) => void;
};

const NFTContext = createContext<ContextType | null>(null);
type Props = Record<"children", ReactNode>;

const NftProvider: React.FC<Props> = ({ children }) => {
  const [imagePreview, setImagePreview] =
    useState<ContextType["imagePreview"]>("");

  const value = useMemo(
    (): ContextType => ({
      imagePreview,
      setImagePreview,
    }),
    [imagePreview, setImagePreview]
  );

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};

function useNftContext(): ContextType {
  return useContext(NFTContext) as ContextType;
}

export { useNftContext, NftProvider };
