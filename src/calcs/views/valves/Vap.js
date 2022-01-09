import * as React from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import CalculateIcon from "@mui/icons-material/Calculate";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
const Valve_Flow_Coeff_Unit = {
    1: "gpm - 1 psi",
    2: "m3/h - 1 mH20",
    3: "m3/h - 1 bar",
    4: "l/min - 1 bar",
  };

export default function Vap() {
  const [valveType, setValveType] = React.useState(1);
  const [calcOptionVal, setCalcOptionVal] = React.useState(1);
  const [valveFlowUnit, setValveFlowUnit] = React.useState(3);
  const [isCalcing, setIsCalcing] = React.useState(false);
  

  const [calcFormData, setCalcFormData] = React.useState({
    length_unit: "mm",
    pres_unit: "bar",
    presa_unit: "bara",
    dpres_unit: "bar",
    temp_unit:'C',

    massfl_unit: "kg/h",
    volfl_unit: "m3/h",
    rho_unit: "kg/m3",
    visc_unit: "mN.s/m2",
    stdfl_unit: "Nm3/h",
    xt:.6,
    z:0.956,
    t:175,
    stdvolfl:1215.24820149006,
    cpcv:1.405,
    pres_in: 9,
    mw:18,
    dp: .35,
    rho: 4.548,
    mu: 0.001,
    massfl: 975.9456705214,
    volfl: 360,
    kv: 25.00,
    fc: 1,
    fl: 0.6,
    pv: 0.701,
    ff: 0.944,
    geom_corr: false,
    diam: 50,
    din: 80,
    dout: 100,
    dpmax: 0,
    pres_out: 0,
    fp: 0,
    flp: 0,
    xtp:0.6,
    y:.978,
  });

  const [operPos, setOperPos] = React.useState(1);
  const [fccalc, setFccalc] = React.useState(0.4);
  React.useEffect(() => {
    calcSingleLine({
      valvetype: valveType,
      xset: operPos,
      setFccalc,
      calcFormData,
      setCalcFormData,
    });
  }, [valveType, operPos]);
  
  React.useEffect(() => {
      setTimeout(()=>{
        calcFunc({
            calcFormData,
            valveType,
            calcOptionVal,
            valveFlowUnit,
            setIsCalcing,
            setCalcFormData,
          });
      },200)
    
  }, []);
  
  return (
    <div className="app">
      <Grid item xs={12} container direction="row">
        <Grid item xs={6}>
          <ControlTable
            {...{
              valveType,
              setValveType,
              calcFormData,
              setCalcFormData,
              calcOptionVal,
              setCalcOptionVal,
              valveFlowUnit,
              setValveFlowUnit,
              operPos,
              setOperPos,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Charts {...{ valveType, fccalc, operPos }} />
          <Grid item xs={12}>
            <LoadingButton
              loading={isCalcing}
              loadingPosition="start"
              startIcon={<CalculateIcon />}
              size="large"
              style={{ width: "150px", marginTop: "30px" }}
              onClick={() =>
                calcFunc({
                  calcFormData,
                  valveType,
                  calcOptionVal,
                  valveFlowUnit,
                  setIsCalcing,
                  setCalcFormData
                })
              }
              variant="contained"
            >
              计算
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
// 点击计算按钮
const calcFunc = ({
  calcFormData,
  valveType,
  calcOptionVal,
  valveFlowUnit,
  setIsCalcing,
  setCalcFormData
}) => {
  setIsCalcing(true);
  httpPost({
    url: "/api/vap/valvev_calc",
    params: {
      calculationType: calcOptionVal,
      valveFlowCoeffUnit: valveFlowUnit,
      calcParam: calcFormData,
    },
  })
    .then((rep) => {
      if (rep) setCalcFormData({...calcFormData,...rep});
    })
    .finally(() => {
      setIsCalcing(false);
    });
};
// 计算单个曲线
function calcSingleLine({
  valvetype,
  xset,
  setFccalc,
  calcFormData,
  setCalcFormData,
}) {
  httpPost({
    url: "/api/vap/valvev_setting_change",
    params: { valvetype, xset },
  }).then((rep) => {
    setFccalc(rep.fccalc);
    setCalcFormData({ ...calcFormData, fc: rep.fccalc });
  });
}
//表格控制
function ControlTable({
  valveType,
  setValveType,
  calcFormData,
  setCalcFormData,
  calcOptionVal,
  setCalcOptionVal,
  valveFlowUnit,
  setValveFlowUnit,
  operPos,
  setOperPos,
}) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl b-1-gray bg-y f-a-c h-30">Control valve compressible fluid (turbulent flow)</div>    
      </Grid>  
      <Grid item xs={4.5}>
        <div className="fl b-1-gray bg-y f-a-c h-30">Case study:</div>
      </Grid>
      <Grid item xs={7.5}>
        <div className="fl f-a-c h-30 b-1-gray">PCV521101</div>
      </Grid>

      <Grid item xs={4}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Calculation options</FormLabel>
          <RadioGroup
            aria-label="gender"
            value={calcOptionVal}
            onChange={(event) => setCalcOptionVal(event.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="Valve coeff fixed"
            />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="Massflow fixed"
            />
            <FormControlLabel
              value={3}
              control={<Radio />}
              label="Volume flow fixed"
            />
            <FormControlLabel
              value={4}
              control={<Radio />}
              label="Normal Volume flow"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={8} container direction="column">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Valve flow coeff unit</InputLabel>
          <Select
            value={valveFlowUnit}
            onChange={(e) => setValveFlowUnit(e.target.value)}
            label="Valve flow coeff unit"
          >
            <MenuItem value={1}>{Valve_Flow_Coeff_Unit[1]}</MenuItem>
            <MenuItem value={2}>{Valve_Flow_Coeff_Unit[2]}</MenuItem>
            <MenuItem value={3}>{Valve_Flow_Coeff_Unit[3]}</MenuItem>
            <MenuItem value={4}>{Valve_Flow_Coeff_Unit[4]}</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Valve type</InputLabel>
          <Select
            value={valveType}
            onChange={(e) => setValveType(e.target.value)}
            label="Valve type"
          >
            <MenuItem value={1}>Linear</MenuItem>
            <MenuItem value={2}>Parabolic</MenuItem>
            <MenuItem value={3}>Square root</MenuItem>
            <MenuItem value={4}>Quick Opening</MenuItem>
            <MenuItem value={5}>Equal Percentage</MenuItem>
            <MenuItem value={6}>Hyperbolic</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Value</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Valve coefficient (Kv or Cv)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Valve_Flow_Coeff_Unit[valveFlowUnit]}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.kv}</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Valve operating position
        </div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl b-1-gray f-j-c bg-y f-a-c h-30">% Opening</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl b-1-gray f-a-c h-30 f-j-c">
          <TextField
            onChange={(e) => {
              setOperPos(e.target.value);
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
              max: 1,
              min: 0,
              step: 0.1,
            }}
            value={operPos}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          % of flow coefficient
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">%</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">{calcFormData.fc}</div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Control valve with attached fittings
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Valve diameter</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.length_unit}
              onChange={(e) =>
                setCalcFormData({
                  ...calcFormData,
                  length_unit: e.target.value,
                })
              }
            >
              <MenuItem value={"m"}>m</MenuItem>
              <MenuItem value={"mm"}>mm</MenuItem>
              <MenuItem value={"inch"}>inch</MenuItem>
              <MenuItem value={"ft"}>ft</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.diam}</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet pipe diameter</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl b-1-gray f-j-c bg-y f-a-c h-30">
          {calcFormData.length_unit}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl b-1-gray f-a-c h-30 f-j-c">{calcFormData.din}</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Outlet pipe diameter</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.length_unit}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">{calcFormData.dout}</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          Estim. piping geom. factor (FP)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">{calcFormData.fp}</div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Operating conditions</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Inlet pressure</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.pres_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, pres_unit: e.target.value })
              }
            >
              <MenuItem value={"bar"}>bar</MenuItem>
              <MenuItem value={"psi"}>psi</MenuItem>
              <MenuItem value={"Pa"}>Pa</MenuItem>
              <MenuItem value={"bara"}>bara</MenuItem>
              <MenuItem value={"psia"}>psia</MenuItem>
              <MenuItem value={"barg"}>barg</MenuItem>
              <MenuItem value={"psig"}>psig</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, pres_in: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.pres_in}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet temperature</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.temp_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, temp_unit: e.target.value })
              }
            >
              <MenuItem value={"C"}>C</MenuItem>
              <MenuItem value={"K"}>K</MenuItem>
              <MenuItem value={"F"}>F</MenuItem>
              <MenuItem value={"R"}>R</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, t: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.t}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Compressibility factor</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, z: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.z}
          />
        </div>
      </Grid>


      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Molecular weight</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        mw_units
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, mw: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.mw}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet density</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.rho_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, rho_unit: e.target.value })
              }
            >
              <MenuItem value={"kg/m3"}>kg/m3</MenuItem>
              <MenuItem value={"kg/l"}>kg/l</MenuItem>
              <MenuItem value={"lb/gal"}>lb/gal</MenuItem>
              <MenuItem value={"lb/ft3"}>lb/ft3</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.rho}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Cp/Cv (g)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
        </div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, cpcv: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.cpcv}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Viscosity</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl b-1-gray f-j-c bg-y f-a-c h-30">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.visc_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, visc_unit: e.target.value })
              }
            >
              <MenuItem value={"mN.s/m2"}>mN.s/m2</MenuItem>
              <MenuItem value={"mPa.s"}>mPa.s</MenuItem>
              <MenuItem value={"cP"}>cP</MenuItem>
              <MenuItem value={"N.s/m2"}>N.s/m2</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl b-1-gray f-a-c h-30 f-j-c">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, mu: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.mu}
          />
        </div>
      </Grid>


      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Expansion factor (Y)</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl b-1-gray f-j-c bg-y f-a-c h-30">
          
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl b-1-gray f-a-c h-30 f-j-c">
          {calcFormData.y}
        </div>
      </Grid>


      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Mass flow (W)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.massfl_unit}
              onChange={(e) =>
                setCalcFormData({
                  ...calcFormData,
                  massfl_unit: e.target.value,
                })
              }
            >
              <MenuItem value={"kg/h"}>kg/h</MenuItem>
              <MenuItem value={"kg/s"}>kg/s</MenuItem>
              <MenuItem value={"lb/h"}>lb/h</MenuItem>
              <MenuItem value={"t/h"}>t/h</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, massfl: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.massfl}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Volume flow</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.volfl_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, volfl_unit: e.target.value })
              }
            >
              <MenuItem value={"m3/h"}>m3/h</MenuItem>
              <MenuItem value={"m3/s"}>m3/s</MenuItem>
              <MenuItem value={"gal/h"}>gal/h</MenuItem>
              <MenuItem value={"gpm"}>gpm</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">{calcFormData.volfl}</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Normal volume flow</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.stdfl_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, stdfl_unit: e.target.value })
              }
            >
              <MenuItem value={"Nm3/h"}>Nm3/h</MenuItem>
              <MenuItem value={"SCFM"}>SCFM</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">{calcFormData.stdvolfl}</div>
      </Grid>
      
      
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Pressure drop</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <FormControl
            variant="standard"
            sx={{ m: 1, width: "100%", margin: "0px" }}
          >
            <Select
              value={calcFormData.dpres_unit}
              onChange={(e) =>
                setCalcFormData({ ...calcFormData, dpres_unit: e.target.value })
              }
            >
              <MenuItem value={"bar"}>bar</MenuItem>
              <MenuItem value={"psi"}>psi</MenuItem>
              <MenuItem value={"Pa"}>Pa</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, dp: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
            }}
            value={calcFormData.dp}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          Critical pressure drop
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.dpres_unit}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">{calcFormData.dpmax}</div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">Outlet pressure</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">bara</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pres_out}
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Values used to calculate the critical pressure drop
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        Terminal differential pressure ratio (XT)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <TextField
            onChange={(e) => {
              setCalcFormData({ ...calcFormData, fl: e.target.value });
            }}
            type="number"
            variant="filled"
            size="small"
            style={{ width: "100%" }}
            inputProps={{
              style: {
                paddingTop: "0px",
                textAlign: "center",
              },
              step: 0.1,
              max: 1,
            }}
            value={calcFormData.fl}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        Terminal differential pressure ratio (XTp)
        </div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl b-1-gray f-j-c bg-y f-a-c h-30">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl b-1-gray f-a-c h-30 f-j-c">{calcFormData.xtp}</div>
      </Grid>
      
    </Grid>
  );
}
function strokeDasharrayWrap(val, valveType) {
  return val === valveType ? "0 0" : "5 5";
}
//曲线
function Charts({ valveType, fccalc, operPos }) {
  console.log("valveType", valveType, fccalc, operPos);
  const [chartData, setChartData] = React.useState([]);
  React.useEffect(() => {
    let chartDataProm = Charts.data
      ? new Promise((r) => r(Charts.data))
      : httpPost({ url: "/api/vap/valvev_fixed_flow" });
    chartDataProm.then((rep) => {
      Charts.data = rep;
      const data = [];
      const { xaxisS, yaxisDataS } = rep;
      for (let i = 0; i < xaxisS.length; i++) {
        const item = {
          name: xaxisS[i],
        };
        yaxisDataS.forEach((it) => {
          item[it.name] = it.yaxisS[i];
        });
        data.push(item);
      }
      data.push({
        name: operPos,
        fccalc,
      });
      setChartData(data);
    });
  }, [fccalc, operPos]);

  return (
    <Box
      style={{ marginTop: "30px", width: "100%", height: "400px" }}
      sx={{ flexGrow: 1 }}
    >
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            type="number"
            domain={[0, "dataMax"]}
            tickCount={6}
          />
          <YAxis type="number" domain={[0, "dataMax"]} tickCount={10} />
          {/* <Tooltip /> */}
          <Legend />
          <Scatter name="fccalc" dataKey="fccalc" fill="red" />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(1, valveType)}
            dataKey="Linear"
            stroke="green"
          />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(2, valveType)}
            dataKey="Parabolic"
            stroke="pink"
          />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(3, valveType)}
            dataKey="Square Root"
            stroke="yellow"
          />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(4, valveType)}
            dataKey="Quick Opening"
            stroke="lightskyblue"
          />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(5, valveType)}
            dataKey="Equal Percentage"
            stroke="brown"
          />
          <Line
            dot={false}
            strokeDasharray={strokeDasharrayWrap(6, valveType)}
            dataKey="Hyperbolic"
            stroke="grey"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
