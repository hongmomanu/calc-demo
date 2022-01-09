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
import CircularIndeterminate from "../components/Loading";
const Liq = React.lazy(() => import("./views/valves/Liq"));
const Vap = React.lazy(() => import("./views/valves/Vap"));


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function ValvesSheet() {
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
export default ValvesSheet;

function IconLabelTabs({ tabValue, handleChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="icon label tabs example"
    >
      <Tab icon={<CalculateIcon />} label="Valve_liq" />
      <Tab icon={<LocalGasStationIcon />} label="Valve_vap" />
      <Tab icon={<FireExtinguisherIcon />} label="steam" />
    </Tabs>
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 0:
      return <Liq />;
    case 1:
      return <Vap />  
    default:
      return "未完待续";
  }
}

//公式
function Formula() {
  return "";
  // return <div className="formula fl f-1 f-d-c">
  //   <div className="fl f-1 f-a-c f-j-c">{" \\(y = ax^2 + bx + c\\)  。当 \\(a \\ne 0\\) 时"}</div>
  //   <div className="fl f-1 f-a-c f-j-c" style={{marginTop:'50px'}}>{"\\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]"}</div>

  // </div>
}
