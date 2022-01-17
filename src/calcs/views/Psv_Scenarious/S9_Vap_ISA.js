import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";
import { TextField } from "@mui/material";
const Valve_Flow_Coeff_Unit = {
  1: "gpm - 1 psi",
  2: "m3/h - 1 mH20",
  3: "m3/h - 1 bar",
  4: "l/min - 1 bar",
};
function calcApi({ setCalcFormData, calcFormData, pd_old_unit, p1_old_unit,t_old_unit }) {
  if (pd_old_unit) calcFormData.pd_old_unit = pd_old_unit;
  if (p1_old_unit) calcFormData.p1_old_unit = p1_old_unit;
  if (t_old_unit) calcFormData.t_old_unit = t_old_unit;
  httpPost({ url: "/api/sninevap/valvev_massflow", params: calcFormData }).then((rep) => {

    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S9_Vap_ISA() {
  const [calcFormData, setCalcFormData] = useState({
    valveFlowCoeffUnit:1,
    p1:13,
    p0:5.4,
    p1_new_unit:'bar',
    p1_old_unit:'bar',
    kv:5,
    dp_unit:'bar',
    dp:7.6,
    dp_max:7.243,
    t:146,
    t_new_unit:'C',
    t_old_unit:'C',
    z:0.988,
    mw:18,

    rho:965.4,
    rho_unit:'kg/m3',
    cpcv:1.3,
    xt:.6,
    dflow_unit:'kg/h',
    dflow:639.8,
    ef:0.667,
    pd:50,
    pd_new_unit:'mm',
    pd_old_unit:'mm',
    sv_unit:'m/s',
    mw_unit:'kg/kmol',
    sv:498.7,
    mflow:23956,


  });
  const pd_old_unit = usePrevious(calcFormData.pd_new_unit);
  const t_old_unit = usePrevious(calcFormData.t_new_unit);
  const p1_old_unit = usePrevious(calcFormData.p1_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, pd_old_unit, p1_old_unit,t_old_unit });
  }, [
    calcFormData.p1,
    calcFormData.p0,
    calcFormData.p1_new_unit,
    calcFormData.rho_new_unit,
    calcFormData.kv,
    calcFormData.t_new_unit,
    calcFormData.t,
    calcFormData.cpcv,
    calcFormData.rho_unit,
    calcFormData.dflow_unit,
    calcFormData.vf_unit,
    calcFormData.valveFlowCoeffUnit,
    calcFormData.pd_new_unit,
    calcFormData.xt,
    calcFormData.pd,
    calcFormData.sv_unit,
    calcFormData.dp_unit,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Failure of automatic controls / Vapour</div>
      </Grid>
      

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Case study</div>
        </Grid>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput type="text" />
          </div>
        </Grid>
      </Grid>

      <Grid container>
          <div className="fl f-a-c h-30">{Combox({
            label:'Valve flow coeff unit',
            options: [
              { name: Valve_Flow_Coeff_Unit[1], value: 1 },
              { name: Valve_Flow_Coeff_Unit[2], value: 2 },
              { name: Valve_Flow_Coeff_Unit[3], value: 3 },
              { name: Valve_Flow_Coeff_Unit[4], value: 4 },
            ],
            data: calcFormData,
            name: "valveFlowCoeffUnit",
            setFunc: setCalcFormData,
          })}</div>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
        <div className="fl f-a-c h-30">Full opening of a valve:</div>
          
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Upstream pressure (P1)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
                { name: "Pa", value: "Pa" },
                { name: "bara", value: "bara" },
                { name: "psia", value: "psia" },
                { name: "psig", value: "psig" },
                { name: "barg", value: "barg" },
              ],
              data: calcFormData,
              name: "p1_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "p1",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Relieving pressure (P0)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.p1_new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "p0",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Valve coefficient (Kv or Cv)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Valve_Flow_Coeff_Unit[calcFormData.valveFlowCoeffUnit]}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure drop (DP)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{Combox({
            options:[{ name: "bar", value: "bar" },
            { name: "psi", value: "psi" },
            { name: "Pa", value: "Pa" }],
            data: calcFormData,
              name: "dp_unit",
              setFunc: setCalcFormData,

          })}</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dp)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Critical pressure drop (DPmax)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.dp_unit}</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dp_max)}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet temperature (T1)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "°C", value: "C" },
                  { name: "K", value: "K" },
                  { name: "°F", value: "F" },
                  { name: "R", value: "R" },
                ],
                data: calcFormData,
                name: "t_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "t",
              setFunc: setCalcFormData,
            })}
            
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Compressibility factor (z)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "z",
              setFunc: setCalcFormData,
            })}
            
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Molecular weight (Mw)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "kg/kmol", value: "kg/kmol" },
                  { name: "lb/lbmol", value: "lb/lbmol" },
                ],
                data: calcFormData,
                name: "mw_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "mw",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Inlet density (r1)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "kg/m3", value: "kg/m3" },
                  { name: "kg/l", value: "kg/l" },
                  { name: "lb/gal", value: "lb/gal" },
                  { name: "lb/ft3", value: "lb/ft3" },
                ],
                data: calcFormData,
                name: "rho_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.rho)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
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
          {NumberInput({
              data: calcFormData,
              name: "cpcv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Expansion factor (Y)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.ef) }
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Discharge mass flow (W)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "kg/h", value: "kg/h" },
                { name: "kg/s", value: "kg/s" },
                { name: "lb/h", value: "lb/h" },
                { name: "t/h", value: "t/h" },
              ],
              data: calcFormData,
              name: "dflow_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dflow)}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Terminal differential pressure ratio (xT)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "xt",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Flow based on sound velocity in a pipe
          </div>
        </Grid>

      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Pipe diameter
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "pd_new_unit",
                    setFunc: setCalcFormData,
                  })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
              data: calcFormData,
              name: "pd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Sonic velocity (a)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "m/s", value: "m/s" },
                { name: "cm/s", value: "cm/s" },
                { name: "ft/s", value: "ft/s" },
              ],
              data: calcFormData,
              name: "sv_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.sv)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Mass flow
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.dflow_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.mflow)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
