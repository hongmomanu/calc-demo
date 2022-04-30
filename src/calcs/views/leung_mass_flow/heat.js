import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { RadioGroups } from "../../../components/RadioGroup";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/external/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function Heat() {
  const [calcFormData, setCalcFormData] = useState({
    "fire_t0":200,
    "x0Fixed":true,
    "fire_x0":0.01,
    "a0Fixed":false,
    "fire_alpha0":null,
    "fire_rhog0":2.931378729,
    "fire_rhol0":911.61072933,
    "fire_cpl0":4000,
    "fire_dhv":2500000,
    "fire_tma":210,
    "fire_q":313,
    "xfixed":"1"
  });
  useEffect(() =>{
    if(calcFormData.xfixed === '1'){
      setCalcFormData({...calcFormData, ...{x0Fixed:true,a0Fixed:false}} )
    }else{
      setCalcFormData({...calcFormData, ...{x0Fixed:false,a0Fixed:true}} )
    }
  },[calcFormData.xfixed])

  useEffect(() => {
    debCalcApi({
      calcFormData,
      setCalcFormData,
    });
  }, [
    calcFormData.fire_t0,
    calcFormData.x0Fixed,
    calcFormData.fire_x0,
    calcFormData.fire_alpha0,
    calcFormData.fire_rhog0,
    calcFormData.fire_rhol0,
    calcFormData.fire_cpl0,
    calcFormData.fire_dhv,
    calcFormData.fire_tma,
    calcFormData.fire_q,
  ]);
  return (
    <Grid container>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30">Two phase mass flowrate / External heat inpute</div>
        <div className="fl f-a-c h-30">Solvay GEC-PEE-NOH/PJR version 1.1</div>
        <div className="fl f-a-c h-30 c-red">Not valid near the thermodynamic critical region</div>

      </Grid>
      <Grid item xs={5}>
      <RadioGroups
              label="Option"
              row={true}
              data={calcFormData}
              name={"xfixed"}
              options={[
                { label: "x0 fixed", value: "1" },
                { label: "a0 fixed", value: "0" },
              ]}
              setFunc={setCalcFormData}
            />
      </Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Relieving temperature (T0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">°C</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="fire_t0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Inlet mass quality (x0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {calcFormData.x0Fixed?<NumberInput
            data={calcFormData}
            name="fire_x0"
            setFunc={setCalcFormData}
          />:toFixedTip(calcFormData.fire_x0)}
          
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Vapor volume fraction (a0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {calcFormData.x0Fixed?toFixedTip(calcFormData.fire_alpha0):<NumberInput
            data={calcFormData}
            name="fire_alpha0"
            setFunc={setCalcFormData}
          />}
          
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Vapor density (rg0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="fire_rhog0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={12}>
      <div className="fl f-a-c h-30"></div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid density (rl0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
        <NumberInput
            data={calcFormData}
            name="fire_rhol0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>




      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Two phase density (r0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.tpd)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid specific heat (Cpl0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">J/kg.°C</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="fire_cpl0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Heat of vaporization (Dhv0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">J/kg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
        <NumberInput
            data={calcFormData}
            name="fire_dhv"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Maximum allowable temperature (TMAA)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">°C</div>
      </Grid>

      <Grid item xs={3}>
      <NumberInput
            data={calcFormData}
            name="fire_tma"
            setFunc={setCalcFormData}
          />
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">v0/(vg0-vl0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.v0)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Qin*</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.qin)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <div className="h-30">
          
      </div>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Transmitted heat (Q)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kW</div>
      </Grid>

      <Grid item xs={3}>
      <NumberInput
            data={calcFormData}
            name="fire_q"
            setFunc={setCalcFormData}
          />
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Q/Dhv0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.qh)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Discharge flow rate (W)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.dfr)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>




      

      <Grid item xs={11}>
        <Charts
              
              xData={[calcFormData.xs || []]}
            //   yTickSize={10}
              xTickSize={7}
              yDatas={[calcFormData.ys || []]}
              scatters={["Two phase venting"]}
              scatters_data={[
                {
                  name: calcFormData.x || 0,
                  "Two phase venting": calcFormData.dfr || 0,
                }
              ]}
              columns={["Mass flow"]}
            />
      </Grid>
      <Grid item xs={1}></Grid>


    </Grid>
  );
}
