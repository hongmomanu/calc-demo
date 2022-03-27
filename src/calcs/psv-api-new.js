import React, { useState, Suspense} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import Animation from "@mui/icons-material/Animation";
import Architecture from "@mui/icons-material/Architecture";
import CircularIndeterminate from "../components/Loading";
const GasLiq = React.lazy(() => import("./views/psv_api_new/gas_liq"));
const Gas = React.lazy(() => import("./views/psv_api_new/gas"));
const Liq = React.lazy(() => import("./views/psv_api_new/liq"))


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function PdropPipeSheet() {
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
export default PdropPipeSheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="icon label tabs example"
    >
      <Tab icon={<CalculateIcon />} label="gas-liq" />
      <Tab icon={<LocalGasStationIcon />} label="gas" />
      <Tab icon={<FireExtinguisherIcon />} label="liq" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <GasLiq />;
    case 1:
      return <Gas />;
    case 2:
      return <Liq />;         
    default:
      return "未完待续";
  }
}
