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
  httpPost({ url: "api/snine/valveflow", params: calcFormData }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S9() {
  const [calcFormData, setCalcFormData] = useState({
    pup: 13,
    pouv: 5.4,
    pup_new_unit: "bara",
    pup_old_unit: "bara",
    cv: 5,
    cf: 0.9,
    mm: 18,
    t: 146,
    t_new_unit: "C",
    t_old_unit: "C",
    flow_unit: "kg/h",
    mm_unit: "kg/kmol",
    flow: 703,
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
    calcFormData.mm,
    calcFormData.t,
    calcFormData.t_new_unit,
    calcFormData.flow_unit,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Failure of automatic controls</div>
      </Grid>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30" style={{ color: "red" }}>
          Ref. : PROCESS SAFETY GUIDELINES IND-HSE-PTS-15.02
        </div>
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
          <div className="fl f-a-c h-30">Full opening of a valve:</div>
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
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Molecular weight</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/kmol", value: "kg/kmol" },
                { name: "lb/lbmol", value: "lb/lbmol" },
              ],
              data: calcFormData,
              name: "mm_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "mm",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vapor temperature</div>
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
              name: "t_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
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
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Discharge mass flow
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
              name: "flow_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.flow)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
