import React, { useState, Suspense} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import CircularIndeterminate from "../components/Loading";
const Pipe = React.lazy(() => import("./views/liquid_spray/pipe"));
const Tank = React.lazy(() => import("./views/liquid_spray/tank"));


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function LiquidSpraySheet() {
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
export default LiquidSpraySheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="icon label tabs example"
    >
      <Tab icon={<CalculateIcon />} label="tank" />
      <Tab icon={<LocalGasStationIcon />} label="pipe" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <Tank />;
    case 1:
      return <Pipe />  
    default:
      return "未完待续";
  }
}