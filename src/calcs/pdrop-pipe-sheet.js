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
import AirplaneTicket from "@mui/icons-material/AirplaneTicket";
import CircularIndeterminate from "../components/Loading";
const Vapour = React.lazy(() => import("./views/Pdrop_pipe/Vapour"));
const Ideal = React.lazy(() => import("./views/Pdrop_pipe/Ideal"));
const Fittins = React.lazy(() => import("./views/Pdrop_pipe/Fittings"))
const SteelPipes = React.lazy(() => import("./views/Pdrop_pipe/SteelPipes"))
const ConeCoils = React.lazy(() => import("./views/Pdrop_pipe/ConeCoils"))
const Dp = React.lazy(()=>import("./views/Pdrop_pipe/dp"))


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
      <Tab icon={<CalculateIcon />} label="Vapour pipe" />
      <Tab icon={<LocalGasStationIcon />} label="Ideal gas" />
      <Tab icon={<FireExtinguisherIcon />} label="Fitting and values" />
      <Tab icon={<Animation />} label="Steel Pipes" />
      <Tab icon={<Architecture />} label="Cone-elbow-diaphr-coils" />
      <Tab icon={<AirplaneTicket />} label="Dp" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <Vapour />;
    case 1:
      return <Ideal />;
    case 2:
      return <Fittins />;    
    case 3:
      return <SteelPipes />;
    case 4:
      return <ConeCoils />; 
    case 5:
        return <Dp />;            
    default:
      return "未完待续";
  }
}

//公式
// function Formula() {
//   return "";
  // return <div className="formula fl f-1 f-d-c">
  //   <div className="fl f-1 f-a-c f-j-c">{" \\(y = ax^2 + bx + c\\)  。当 \\(a \\ne 0\\) 时"}</div>
  //   <div className="fl f-1 f-a-c f-j-c" style={{marginTop:'50px'}}>{"\\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]"}</div>

  // </div>
// }
