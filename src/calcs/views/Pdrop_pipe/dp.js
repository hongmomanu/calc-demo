import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";

const caseArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const neededKeys = ['rho','mu','massfl','gas','pres_in','diam','ltuy','rug'];
function calcApi({ setCalcFormData, calcFormData, cIdx }) {
    const params = {}
    for(let key in calcFormData){
        if(key.includes(cIdx)||!key.includes("$")){
            const realKey = key.replace(`${cIdx}`,"")
            const realVal = calcFormData[key];
            if(neededKeys.includes(realKey)&&realVal==null)return;
            params[realKey] = calcFormData[key]
        }
    }
    console.log('params',params)
    params[`gas`] = params[`gas`].toLocaleLowerCase() === 'v'?true:false;
    httpPost({
      url:'/api/pipe/dp/dp_calc',
      params,
      nofilter: true,
    }).then((rep) => {
      const reps ={

      }
      for(let key in rep){
        reps[`${key}${cIdx}`] = rep[key]
      }
      setCalcFormData({ ...calcFormData, ...reps });
    });
}
const debCalcApi = debounce(calcApi);

function Dp() {
  const [calcFormData, setCalcFormData] = useState({
    rho_unit: "kg/m3",
    visc_unit: "mN.s/m2",
    massfl_unit: "kg/h",
    volfl_unit: "m3/h",
    pres_unit: "bara",
    d_unit: "mm",
    l_unit: "m",
    rug_unit:"mm",
    vel_unit:"m/s",
    dpu_unit:"bar/m",
    dp_unit:"bar",
    power_unit:"kW",
    rho1$:9.04,
    mu1$:0.013,
    massfl1$:333.852845267824,
    gas1$:'V',
    pres_in1$:8,
    diam1$:26.65,
    ltuy1$:100,
    rug1$:0.05,
  });
  const [cIdx, setCidex] = useState(1);
  useEffect(()=>{
    debCalcApi({calcFormData,setCalcFormData,cIdx:`${cIdx}$`})
  },[cIdx, calcFormData.rho_unit, calcFormData.visc_unit,
     calcFormData.massfl_unit,calcFormData.volfl_unit, calcFormData.pres_unit,
    calcFormData.d_unit, calcFormData.l_unit,calcFormData.rug_unit,calcFormData.vel_unit,
calcFormData.dpu_unit,calcFormData.power_unit,calcFormData.dp_unit])
  return (
    <div style={{ overflow: "auto" }}>
      <Grid container width={"130%"}>
        <Grid item xs={12}>
          <div className="fl  f-a-c h-30">Downstream to upstream</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Fluid</div>
        </Grid>
        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{`Case${it}$`}</div>
            </Grid>
          );
        })}
        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Density</div>
        </Grid>
        <Grid item xs={1}>
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

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `rho${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Viscosity</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "N.s/m2", value: "N.s/m2" },
                { name: "mPa.s", value: "mPa.s" },
                { name: "mN.s/m2", value: "mN.s/m2" },
                { name: "cP", value: "cP" },
              ],
              data: calcFormData,
              name: "visc_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `mu${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Mass flow</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/h", value: "kg/h" },
                { name: "kg/s", value: "kg/s" },
                { name: "lb/h", value: "lb/h" },
                { name: "t/h", value: "t/h" },
              ],
              data: calcFormData,
              name: "massfl_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `massfl${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">or volume flow</div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m3/h", value: "m3/h" },
                { name: "m3/s", value: "m3/s" },
                { name: "gal/h", value: "gal/h" },
                { name: "gpm", value: "gpm" },
              ],
              data: calcFormData,
              name: "volfl_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `volfl${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fluid type (L or V)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData[`gas${it}$`]}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Inlet pressure (optionnal for L)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
                { name: "bara", value: "bara" },
                { name: "psia", value: "psia" },
                { name: "psig", value: "psig" },
                { name: "barg", value: "barg" },
              ],
              data: calcFormData,
              name: "pres_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `pres_in${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Pipe</div>
        </Grid>

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pipe inside diameter
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "d_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `diam${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Pipe length
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "l_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `ltuy${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Roughness
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "rug_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `rug${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Fittings/valves equiv. length (L/D)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `lequ${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Fittings/valves velocity head (K)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `k${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Transition Reynolds (default=2100)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: `relam${it}$`,
                  setFunc: (data) => {
                    setCalcFormData(data);
                    setCidex(it);
                  },
                })}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <div className="fl f-a-c h-30">
          Results
          </div>
        </Grid>


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Total length
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.l_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`ldevtot${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Velocity in
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m/s", value: "m/s" },
                { name: "cm/s", value: "cm/s" },
                { name: "ft/s", value: "ft/s" },
              ],
              data: calcFormData,
              name: "vel_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`veloc${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Velocity out (V only)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`veloc_out${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Critical velocity (V only)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`critv${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Reynolds
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`re${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Regime
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`regime${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Fanning friction factor
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`f${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Unit pressure drop (DPU)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "bar/m", value: "bar/m" },
                { name: "mbar/m", value: "mbar/m" },
                { name: "psi/ft", value: "psi/ft" },
              ],
              data: calcFormData,
              name: "dpu_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`dpu${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Pressure drop (DP)
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
              options: [
                { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
              ],
              data: calcFormData,
              name: "dp_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`dp${it}$`])}
              </div>
            </Grid>
          );
        })}


        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Outlet pressure
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pres_unit}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`pres_out${it}$`])}
              </div>
            </Grid>
          );
        })}

        <Grid item xs={2}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Power consumed
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                  options: [
                    { name: "W", value: "W" },
                    { name: "kW", value: "kW" },
                    { name: "Btu/h", value: "Btu/h" },
                    { name: "kcal/h", value: "kcal/h" },
                  ],
                  data: calcFormData,
                  name: "power_unit",
                  setFunc: setCalcFormData,
                })}
          </div>
        </Grid>

        {caseArr.map((it) => {
          return (
            <Grid item xs={0.6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixedTip(calcFormData[`power${it}$`])}
              </div>
            </Grid>
          );
        })}




      </Grid>
    </div>
  );
}
export default Dp;
