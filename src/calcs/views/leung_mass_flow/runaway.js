import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { CheckedBox } from "../../../components/CheckedBox";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/runaway/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function RunAway() {
  const [calcFormData, setCalcFormData] = useState({
    "pp":4.0,
    "run_t0":150,
    "run_tma":180,
    "run_alpha0":0.233,
    "mw":92,
    "cfz":1,
    "run_rhol":737,
    "run_cpl0":1897.6,
    "run_dhv":335000,
    "rv":8.1,
    "fixedQ":false,
    "run_trise0":0.462,
    "run_trisema":0,
    "run_ear":-10000,
    "run_q":2007.07925562144
  });
  useEffect(() => {
    debCalcApi({
      calcFormData,
      setCalcFormData,
    });
  }, [
    calcFormData.pp,
    calcFormData.run_t0,
    calcFormData.run_tma,
    calcFormData.hftp,
    calcFormData.run_alpha0,
    calcFormData.mw,
    calcFormData.cfz,
    calcFormData.run_rhol,
    calcFormData.run_cpl0,
    calcFormData.run_dhv,
    calcFormData.rv,
    calcFormData.fixedQ,
    calcFormData.run_trise0,
    calcFormData.run_trisema,
    calcFormData.run_ear,
    calcFormData.run_q,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Runaway / High vapor pressure system</div>
        <div className="fl f-a-c h-30">Solvay GEC-PEE-NOH/PJR version 1.1</div>
        <div className="fl f-a-c h-30 c-red">Not valid near the thermodynamic critical region</div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Reactor conditions</div>
      </Grid>
      


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Pressure (P0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">bar gauge</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>




      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Relief temperature (T0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">°C</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_t0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Temperature at Pma (TMAA)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray"></div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_tma"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Vapor phase fraction</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m3/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_alpha0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>



      
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Vapor characteristics</div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Molecular weight</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/kmol</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="mw"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Compressibility factor z=PV/RT</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="cfz"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Density at T0 P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.run_rhov)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Liquid characteristics</div>
      </Grid>



      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Density (rl)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_rhol"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Specific heat (Cpl)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">J/kg.°C</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_cpl0"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Heat of vaporization (Dhv)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">J/kg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="run_dhv"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Reactor contents</div>
      </Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Reactor volume</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
        <NumberInput
            data={calcFormData}
            name="rv"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Density (r0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.density)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>



      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid mass</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.run_mass0)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Vapor mass</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.vm)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Total mass</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.tm)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
        Experimental adiabatic temperature rise
        </div>
      </Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Adiabatic dT/dt at T0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">K/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
        {calcFormData.fixedQ?toFixedTip(calcFormData.run_trise0):<NumberInput
            data={calcFormData}
            name="run_trise0"
            setFunc={setCalcFormData}
          />}
          
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Adiabatic dT/dt at Tma</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">K/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
        {calcFormData.fixedQ?toFixedTip(calcFormData.run_trisema):<NumberInput
            data={calcFormData}
            name="run_trisema"
            setFunc={setCalcFormData}
          />}
          
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Ea/R</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">K</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.run_ear)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Average heat release rate(Q)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kW</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {calcFormData.fixedQ?<NumberInput
            data={calcFormData}
            name="run_q"
            setFunc={setCalcFormData}
          />:toFixedTip(calcFormData.run_q)}
        </div>
      </Grid>
      <Grid item xs={1}>
      <CheckedBox
          data={calcFormData}
          name={"fixedQ"}
          setFunc={setCalcFormData}
          label="fixedQ"
        />
      </Grid>


      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
        Two phase venting
        </div>
      </Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Two phase mass flowrate (W)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.tpmf)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>



      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
        Vapor phase venting
        </div>
      </Grid>


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
      

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Vapor phase mass flowrate (W)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.vpmf)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>
      

  


      <Grid item xs={11}>
        <Charts
              
              xData={[calcFormData.xs || [],calcFormData.xs || []]}
              height={500}
              yTickFormatter={(val, ix) => {
                const filterArr = [1,10, 100,1000];
                if (filterArr.includes(val)) return val;
                else return "";
              }}
              yScale={'log'}
              yDomain={['auto', 1000]}
              yTicks = {[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900,1000]}
              scatters={["Two phase verting point","Vapor verting point"]}
              scatters_data={[
                {
                  name: calcFormData.x || 0,
                  "Two phase verting point": calcFormData.tpmf || 0,
                },
                {
                    name: calcFormData.x || 0,
                    "Vapor verting point": calcFormData.vpmf || 0,
                  },
              ]}
              yDatas={[calcFormData.tpvYs || [],calcFormData.vvYs || []]}
              columns={["Two phase verting","Vapor verting"]}
            />
      </Grid>
      <Grid item xs={1}></Grid>


    </Grid>
  );
}
