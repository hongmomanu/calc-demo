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
function calcApi({ setCalcFormData, calcFormData, rho_old_unit, p1_old_unit }) {
  if (rho_old_unit) calcFormData.rho_old_unit = rho_old_unit;
  if (p1_old_unit) calcFormData.p1_old_unit = p1_old_unit;
  httpPost({ url: "/api/snineliq/valvel_massflow", params: calcFormData }).then((rep) => {

    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S9_Liq_ISA() {
  const [calcFormData, setCalcFormData] = useState({
    valveFlowCoeffUnit:1,
    p1:13,
    p0:5.4,
    p1_new_unit:'bara',
    p1_old_unit:'bara',
    kv:5,
    dp_unit:'bar',
    dp:7.6,
    rho:965.4,
    rho_new_unit:'kg/m3',
    rho_old_unit:'kg/m3',
    df_unit:'kg/h',
    df:43241,
    vf_unit:'m3/h',
    vf:44.8
  });
  const rho_old_unit = usePrevious(calcFormData.rho_new_unit);
  const p1_old_unit = usePrevious(calcFormData.p1_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, rho_old_unit, p1_old_unit });
  }, [
    calcFormData.p1,
    calcFormData.p0,
    calcFormData.p1_new_unit,
    calcFormData.rho_new_unit,
    calcFormData.kv,
    calcFormData.rho,
    calcFormData.dp_unit,
    calcFormData.df_unit,
    calcFormData.vf_unit,
    calcFormData.valveFlowCoeffUnit,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Failure of automatic controls / Liquid</div>
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
            Valve coefficient Cv
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Valve_Flow_Coeff_Unit[calcFormData.p1_new_unit]}
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
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Density</div>
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
                name: "rho_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "rho",
              setFunc: setCalcFormData,
            })}
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
              name: "df_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.df)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Volume flow
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "m3/h", value: "m3/h" },
              { name: "m3/s", value: "m3/s" },
              { name: "gal/h", value: "gal/h" },
              { name: "gpm", value: "gpm" },
            ],
            data: calcFormData,
            name: "vf_unit",
            setFunc: setCalcFormData,
          })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.vf)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
