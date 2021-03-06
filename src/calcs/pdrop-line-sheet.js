import React, { useState, Suspense} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import Aod from "@mui/icons-material/Aod";
import AlignHorizontalLeft from "@mui/icons-material/AlignHorizontalLeft";
import AirplayIcon from "@mui/icons-material/Airplay";

import CircularIndeterminate from "../components/Loading";

const Fittins = React.lazy(() => import("./views/Pdrop_line/Fittings"))
const SteelPipes = React.lazy(() => import("./views/Pdrop_line/SteelPipes"))
const ConeCoils = React.lazy(() => import("./views/Pdrop_line/ConeCoils"))
const Line = React.lazy(()=>import("./views/Pdrop_line/Line"))


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function PdropLineSheet() {
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
export default PdropLineSheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="icon label tabs example"
    >
        <Tab icon={<FireExtinguisherIcon />} label="Steel Pipes" />
        <Tab icon={<Aod />} label="Fitting and values" />
        <Tab icon={<AlignHorizontalLeft />} label="Cone-elbow-diaphr-coils" />
        <Tab icon={<AirplayIcon />} label="Line" />
      
      
      
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <SteelPipes />;
    case 1:
      return <Fittins />;
    case 2:
      return <ConeCoils />;      
    case 3:
        return <Line />;          
    default:
      return "????????????";
  }
}