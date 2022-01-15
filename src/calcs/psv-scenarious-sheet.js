import React, { useState, Suspense} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import AdbIcon from "@mui/icons-material/Adb";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CircularIndeterminate from "../components/Loading";

const S9 = React.lazy(() => import("./views/Psv_Scenarious/S9"))
const S10 = React.lazy(() => import("./views/Psv_Scenarious/S10"))
const S11 = React.lazy(() => import("./views/Psv_Scenarious/S11"))
const S14 = React.lazy(() => import("./views/Psv_Scenarious/S14"))
const S15 = React.lazy(() => import("./views/Psv_Scenarious/S15"))
const Fire = React.lazy(() => import("./views/Psv_Scenarious/Fire"))

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function PsvScenariousSheet() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={24}>
          <Item>
            <IconLabelTabs tabValue={tabValue} handleChange={handleChange} />
          </Item>
        </Grid>
        <Grid item xs={24}>
          <Item>
          <Suspense fallback={<CircularIndeterminate />}>
             <TabContent tabValue={tabValue} />
         </Suspense>  
            
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
export default PsvScenariousSheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
    >
      <Tab icon={<FireExtinguisherIcon />} label="S9" />
      <Tab icon={<AdbIcon />} label="S10" />
      <Tab icon={<AccountTreeIcon />} label="S11" />
      <Tab icon={<AccountBalanceWalletIcon />} label="S14" />
      <Tab icon={<AdfScannerIcon />} label="S15" />
      <Tab icon={<AddShoppingCartIcon />} label="Fire" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <S9 />;  
          
    case 1:
      return <S10 />;  

    case 2:
      return <S11 />;  

    case 3:
      return <S14 />;  

    case 4:
      return <S15 />;  
      
    case 5:
      return <Fire />;  

    default:
      return "未完待续";
  }
}