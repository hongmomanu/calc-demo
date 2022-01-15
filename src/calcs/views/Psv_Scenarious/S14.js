import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData, ed_old_unit, lh_old_unit }) {
  if (ed_old_unit) calcFormData.ed_old_unit = ed_old_unit;
  if (lh_old_unit) calcFormData.lh_old_unit = lh_old_unit;
  httpPost({ url: "/api/sfourteen/valveflow", params: calcFormData }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function S14() {
  const [calcFormData, setCalcFormData] = useState({
    ed: 17.45,
    ed_new_unit:'kW',
    ed_old_unit:'kW',
    pd:20,
    tc:0.001,
    lh:4.81,
    lh_new_unit:'kJ/kg.K',
    lh_old_unit:'kJ/kg.K',
    df_unit:'kg/h',
    df:28.03,

    
  });
  const ed_old_unit = usePrevious(calcFormData.ed_new_unit);
  const lh_old_unit = usePrevious(calcFormData.lh_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, ed_old_unit, lh_old_unit});
  }, [
    calcFormData.ed,
    calcFormData.pd,
    calcFormData.ed_new_unit,
    calcFormData.tc,
    calcFormData.lh,
    calcFormData.lh_new_unit,
    calcFormData.df_unit
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Hydraulic Expansion</div>
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
          <div className="fl f-a-c h-30"> 
          <p>- Cold fluid shut in</p>
          <p> - Lines outside process area shut in</p>
          </div>
        </Grid>
      </Grid>
      

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          External heat duty
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "W", value: "W" },
                { name: "kW", value: "kW" },
                { name: "Btu/h", value: "Btu/h" },
                { name: "kcal/h", value: "kcal/h" },
                { name: "hp", value: "hp" },
              ],
              data: calcFormData,
              name: "ed_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ed",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Pump heat duty</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.ed_new_unit}
          </div>
        </Grid>
        <Grid item xs={2}>
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
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Thermal expansion. Coeff.</div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
           
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "tc",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Liquid specific heat
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "J/kg.K", value: "J/kg.K" },
                { name: "kJ/kg.K", value: "kJ/kg.K" },
                { name: "kcal/kg.K", value: "kcal/kg.K" },
                { name: "Btu/lb.R", value: "Btu/lb.R" },
              ],
              data: calcFormData,
              name: "lh_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "lh",
              setFunc: setCalcFormData,
            })}
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
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.df)}
          </div>
        </Grid>
      </Grid>

      
    </Grid>
  );
}
