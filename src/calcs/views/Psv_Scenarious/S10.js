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
function calcApi({ setCalcFormData, calcFormData, t_old_unit, pup_old_unit }) {
  if (t_old_unit) calcFormData.t_old_unit = t_old_unit;
  if (pup_old_unit) calcFormData.pup_old_unit = pup_old_unit;
  httpPost({ url: "api/sten/valveflow", params: calcFormData }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S10() {
  const [calcFormData, setCalcFormData] = useState({
    pup: 7,
    pouv: 3,
    pup_new_unit: "bara",
    pup_old_unit: "bara",
    cv: 13,
    cf: 0.9,
    mm: 18,
    t: 165.0,
    t_unit:"C",
    mv_unit:"kg/h",
    sc_unit:"kJ/kg",
    pv:2200,
    ps:0,
    mv:963,
    sc:2065,
    pe:904,
    dflow: 904,
  });
  const t_old_unit = usePrevious(calcFormData.t_new_unit);
  const pup_old_unit = usePrevious(calcFormData.pup_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, t_old_unit, pup_old_unit });
  }, [
    calcFormData.pup,
    calcFormData.pouv,
    calcFormData.pup_new_unit,
    calcFormData.cv,
    calcFormData.cf,
    calcFormData.pv,
    calcFormData.ps,
    calcFormData.t_new_unit,
    calcFormData.mv_unit,
    calcFormData.sc_unit,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Abnormal heat or vapour input</div>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Case study</div>
        </Grid>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput type="text" />
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Full opening of a steam valve:</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Upstream pressure (P1)
          </div>
        </Grid>
        <Grid item xs={2}>
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
              name: "pup_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "pup",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Relieving pressure (P0)
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.pup_new_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "pouv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Valve coefficient Cv
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Valve Cf</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cf",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Saturated steam temperature</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "C", value: "C" },
                { name: "K", value: "K" },
                { name: "F", value: "F" },
                { name: "R", value: "R" },
              ],
              data: calcFormData,
              name: "t_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.t)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Max steam mass flow through the valve
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/h", value: "kg/h" },
                { name: "kg/s", value: "kg/s" },
                { name: "lb/h", value: "lb/h" },
                { name: "t/h", value: "t/h" },
              ],
              data: calcFormData,
              name: "mv_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.mv)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Steam heat of condensation</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/kmol", value: "kg/kmol" },
                { name: "lb/lbmol", value: "lb/lbmol" },
              ],
              data: calcFormData,
              name: "sc_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.sc)}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Process fluid heat of vaporization</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.sc_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "pv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Process fluid flow evaporated</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.mv_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.pe)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Process fluid flow to substract</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.mv_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ps",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Discharge mass flow
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.mv_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dflow)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
