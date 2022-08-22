import React from "react";
import styled from "styled-components";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import {
  AppBar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  let navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="flex justify-between">
          <div className="flex space-x-5">
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              onClick={() => {
                navigate(`/`);
              }}
            >
              NFT Marketplace
            </Typography>
            <MenuItem
              onClick={() => {
                navigate(`/list-new-nft`);
              }}
            >
              <Typography textAlign="center">List New NFT</Typography>
            </MenuItem>
          </div>
          <ConnectKitButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
