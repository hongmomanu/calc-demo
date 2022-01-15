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
function calcApi({ setCalcFormData, calcFormData, d_old_unit, pup_old_unit,pv_old_unit }) {
  if (d_old_unit) calcFormData.d_old_unit = d_old_unit;
  if (pup_old_unit) calcFormData.pup_old_unit = pup_old_unit;
  if (pv_old_unit) calcFormData.pv_old_unit = pv_old_unit;
  httpPost({ url: "/api/seleven/valveflow", params: calcFormData }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S11() {
  const [calcFormData, setCalcFormData] = useState({
    pup: 25,
    pouv: 0,
    pup_new_unit: "bara",
    pup_old_unit: "bara",
    t_unit:"C",
    t1:250,
    cv: 2,
    cf: 0.9,
    mv_unit:"kg/h",
    mv:484,
    d:125,
    d_new_unit:'mm',
    d_old_unit:'mm',
    cpcv:1.52,
    n:1,
    mo:150409,
    dsf:484,
    pv:2100,
    pt:154,
    pv_new_unit:"kJ/kg",
    pv_old_unit:"kJ/kg",
    sc:2230,
    dvf:514
  });
  const d_old_unit = usePrevious(calcFormData.d_new_unit);
  const pup_old_unit = usePrevious(calcFormData.pup_new_unit);
  const pv_old_unit = usePrevious(calcFormData.pv_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, d_old_unit, pup_old_unit,pv_old_unit});
  }, [
    calcFormData.pup,
    calcFormData.pouv,
    calcFormData.pup_new_unit,
    calcFormData.t_unit,
    calcFormData.t1,
    calcFormData.cv,
    calcFormData.cf,
    calcFormData.pv,
    calcFormData.ps,
    calcFormData.pv_new_unit,
    calcFormData.d_new_unit,
    calcFormData.mv_unit,
    calcFormData.d,
    calcFormData.n,
    calcFormData.pt,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Exchanger tube rupture</div>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
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
          <div className="fl f-a-c h-30">Calculation of maximum valve steam flow</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Upstream steam pressure (P1)
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Steam temperature (T1)</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.t_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.t1)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Calculation of maximum orifice steam flow</div>
        </Grid>  
      </Grid>   


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Tube diameter (d)
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                    options: [
                      { name: "m", value: "m" },
                      { name: "mm", value: "mm" },
                      { name: "inch", value: "inch" },
                      { name: "ft", value: "ft" },
                    ],
                    data: calcFormData,
                    name: "d_new_unit",
                    setFunc: setCalcFormData,
                  })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.d)}
          </div>
        </Grid>
      </Grid>   


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Cp/Cv steam (g)
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.cpcv)}
          </div>
        </Grid>
      </Grid>  

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          'n=1 side for coil, =2 sides for tube bundle
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.n)}
          </div>
        </Grid>
      </Grid>  


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Mass flow from orifice
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.mv_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.mo)}
          </div>
        </Grid>
      </Grid>  

      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">If the process fluid temperature is greater than saturated steam temperature</div>
        </Grid>  
      </Grid>   

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Discharge steam mass flow
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.mv_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dsf)}
          </div>
        </Grid>
      </Grid>  


      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">If the process fluid temperature is greater than saturated steam temperature</div>
        </Grid>  
      </Grid>  
      
      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Process fluid heat of vaporization</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "J/kg", value: "J/kg" },
                { name: "kJ/kg", value: "kJ/kg" },
                { name: "Btu/lb", value: "Btu/lb" },
                { name: "kcal/kg", value: "kcal/kg" },
              ],
              data: calcFormData,
              name: "pv_new_unit",
              setFunc: setCalcFormData,
            })}
            
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
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Process fluid temperature</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.t_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "pt",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Steam heat of condensation</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pv_new_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.sc)}
          </div>
        </Grid>
      </Grid>

      

      <Grid container>
        <Grid item xs={6}>
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
            {toFixed(calcFormData.dvf)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
