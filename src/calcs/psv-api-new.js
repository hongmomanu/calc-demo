import React, { useState, Suspense } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CalculateIcon from "@mui/icons-material/Calculate";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AnimationIcon from "@mui/icons-material/Animation";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import AdUnitsIcon from "@mui/icons-material/AdUnits"
import CircularIndeterminate from "../components/Loading";
import { NumberInput } from "../components/NumberInput";
import { PatmContext } from "./context";
const GasLiq = React.lazy(() => import("./views/psv_api_new/gas_liq"));
const Gas = React.lazy(() => import("./views/psv_api_new/gas"));
const Liq = React.lazy(() => import("./views/psv_api_new/liq"))
const Steam = React.lazy(() => import("./views/psv_api_new/steam"))
const LiqSubc = React.lazy(() => import("./views/psv_api_new/liq_subc"))
const DirectIntegr = React.lazy(() => import("./views/psv_api_new/direct_integr"))
const SatWater = React.lazy(() => import("./views/psv_api_new/sat_water"))


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function PdropPipeSheet() {
  const [tabValue, setTabValue] = useState(0);
  const [calcFormData, setCalcFormData] = useState({
    bar: 1.01325,
    psi: 14.69595,
  })
  console.log("patm calcFormData",calcFormData)

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <PatmContext.Provider value={{...calcFormData}}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={24}>
            <Item>
              <IconLabelTabs tabValue={tabValue} handleChange={handleChange} calcFormData={calcFormData} setCalcFormData={setCalcFormData} />
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
    </PatmContext.Provider>

  );
}
export default PdropPipeSheet;

function IconLabelTabs({ tabValue, handleChange, calcFormData, setCalcFormData }) {
  return (
    <Grid container direction={"column"}>
      <Grid item xs={12}>
      <Grid container xs={12}>
        <Grid container xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray" style={{ height: "60px", width: '100%' }}>
            Patm
          </div>
        </Grid>
        <Grid container xs={9} direction="column">
          <Grid container direction="row">
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                bar
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                psi
              </div>
            </Grid>

            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                <NumberInput
                  data={calcFormData}
                  name="bar"
                  setFunc={setCalcFormData}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                <NumberInput
                  data={calcFormData}
                  name="psi"
                  setFunc={setCalcFormData}
                />
              </div>
            </Grid>

          </Grid>

        </Grid>

      </Grid>
      </Grid>
      <Grid item xs={12}>
      <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="icon label tabs example"
    >
      <Tab icon={<LocalGasStationIcon />} label="gas" />
      <Tab icon={<FireExtinguisherIcon />} label="liq" />
      <Tab icon={<AgricultureIcon />} label="steam" />
      <Tab icon={<CalculateIcon />} label="gas-liq" />
      <Tab icon={<AnimationIcon />} label="liq_subc" />
      <Tab icon={<ArchitectureIcon />} label="direct_integr" />
      <Tab icon={<AdUnitsIcon />} label="sat_water" />
      
    </Tabs>
      </Grid>
      

    </Grid>
    
  );
}

function TabContent({ tabValue }) {
  switch (tabValue) {
    case 3:
      return <GasLiq />;
    case 0:
      return <Gas />;
    case 1:
      return <Liq />;
    case 2:
      return <Steam />  
    case 4:
      return <LiqSubc />  
    case 5:
      return <DirectIntegr />  
    case 6:
      return <SatWater />  
    default:
      return "未完待续";
  }
}
