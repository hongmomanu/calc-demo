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
import AirIcon from "@mui/icons-material/Air";
import CircularIndeterminate from "../components/Loading";

const GasLiq = React.lazy(() => import("./views/psv_iso/gas_liq"))
const LiqSubc = React.lazy(() => import("./views/psv_iso/liq_subc"))
const Hybrid = React.lazy(() => import("./views/psv_iso/hybrid"))
const RdGasLiq = React.lazy(() => import("./views/psv_iso/rd_gas_liq"))
const RdLiqSubc = React.lazy(() => import("./views/psv_iso/rd_liq_subc"))
const RdHybrid = React.lazy(() => import("./views/psv_iso/rd_hybrid"))
const Fanning = React.lazy(() => import("./views/psv_iso/fanning"))
const HybridGraph = React.lazy(() => import("./views/psv_iso/hybrid_graph"))
const PipeCorrGraph = React.lazy(() => import("./views/psv_iso/pipe_corr_graph"))
const GGcGraph = React.lazy(() => import("./views/psv_iso/g_gc_graph"))

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function PsvIsoSheet() {
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
export default PsvIsoSheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
    >
      <Tab icon={<FireExtinguisherIcon />} label="gas_liq" />
      <Tab icon={<AdbIcon />} label="liq_subc" />
      <Tab icon={<AccountTreeIcon />} label="hybrid" />
      <Tab icon={<AccountBalanceWalletIcon />} label="RD_gas_liq" />
      <Tab icon={<AdfScannerIcon />} label="RD_liq_subc" />
      <Tab icon={<AddShoppingCartIcon />} label="RD_hybrid" />
      <Tab icon={<AirIcon />} label="Fanning" />
      <Tab icon={<AirIcon />} label="hybrid_graph" />
      <Tab icon={<AirIcon />} label="pipe_corr_graph" />
      <Tab icon={<AirIcon />} label="G_GC_graph" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <GasLiq />;  
          
    case 1:
      return <LiqSubc />;  

    case 2:
      return <Hybrid />;  

    case 3:
      return <RdGasLiq />;  

    case 4:
      return <RdLiqSubc />;  

    case 5:
      return <RdHybrid />;  
      
    case 6:
      return <Fanning />;  

    case 7:
      return <HybridGraph />; 

    case 8:
      return <PipeCorrGraph />; 
    case 9:
      return <GGcGraph />;   


    default:
      return "未完待续";
  }
}