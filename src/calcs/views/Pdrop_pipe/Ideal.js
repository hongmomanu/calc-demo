import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";

function calcApi({setCalcFormData,calcFormData}){
    httpPost({url:'api/pipe/ideal/idealGas',params:calcFormData}).then((rep)=>{
        setCalcFormData({...calcFormData,...rep})
    })
}
const calcApiDeb = debounce(calcApi)
export default function Ideal() {

    const [calcFormData, setCalcFormData] = useState({
        temperature_old_unit: "C",
        temperature_new_unit: "C",
        pressure_old_unit:"bara",
        pressure_new_unit:"bara",
        pressure:5,
        molecular_weight:70.9,
        compressibility_factor:1,
        density_new_unit:'kg/m3',
        molecular_weight_unit:'kg/kmol',
        k1:1,
        k2:2.2046,
        k3:0.0711,
        k4:2.51087,
        k5:0.316,
        k6:0.1967,
        pres_unit: "bara",
        temperature: 30,


        density:16.065,
        dc:3.163,
        df:2.993,
        k1s:[],
        k2s:[],
        k3s:[],
        k4s:[],
        k5s:[],
        k6s:[],
      });

      const temperature_old_unit = usePrevious(calcFormData.temperature_new_unit);
      const pressure_old_unit = usePrevious(calcFormData.pressure_new_unit)


      useEffect(()=>{
        console.log("calcFormData.temperature_new_unit",calcFormData.temperature_new_unit,temperature_old_unit,calcFormData.temperature)
        const newData = {...calcFormData}
        if(temperature_old_unit){
            newData.temperature_old_unit = temperature_old_unit
        }
        if(pressure_old_unit){
            newData.pressure_old_unit = pressure_old_unit
        }
        calcApiDeb({calcFormData:newData,setCalcFormData})
        
      },[calcFormData.temperature_new_unit,calcFormData.temperature,
        calcFormData.pressure_new_unit,calcFormData.temperature,calcFormData.molecular_weight,
        calcFormData.compressibility_factor,calcFormData.k1,calcFormData.k2,
        calcFormData.k3,calcFormData.k4,calcFormData.k5,calcFormData.k6,
        calcFormData.density_new_unit,calcFormData.pressure
    ])
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">
        Ideal gas density
        </div>
      </Grid>
      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
                options: [
                  { name: "°C", value: "C" },
                  { name: "K", value: "K" },
                  { name: "°F", value: "F" },
                  { name: "R", value: "R" },
                ],
                data: calcFormData,
                name: "temperature_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "temperature",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>

      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure</div>
          </Grid>
          <Grid item xs={1.5}>
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
                name: "pressure_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "pressure",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Molecular weight</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
                options: [
                  { name: "kg/kmol", value: "kg/kmol" },
                  { name: "lb/lbmol", value: "lb/lbmol" },
                ],
                data: calcFormData,
                name: "molecular_weight_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "molecular_weight",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>



      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Compressibility factor</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            -
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "compressibility_factor",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Density</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
                options: [
                  { name: "kg/m3", value: "kg/m3" },
                  { name: "kg/l", value: "kg/l" },
                  { name: "lb/gal", value: "lb/gal" },
                  { name: "lb/ft3", value: "lb/ft3" },
                ],
                data: calcFormData,
                name: "density_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "density",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>


      <Grid item xs={12} style={{marginTop:'16px'}}>
        <div className="fl  f-a-c h-30">
        Flow conversion
        </div>
      </Grid>

      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Density 1 atm, 0°C</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.density_new_unit}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixed(calcFormData.dc)}
            </div>
          </Grid>
      </Grid>

      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Density 1 atm, 60°F</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.density_new_unit}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixed(calcFormData.df)}
            </div>
          </Grid>
      </Grid>



      <Grid container style={{marginTop:'16px'}}>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">kg/h</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k1",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixed(calcFormData.k2s[0])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixed(calcFormData.k3s[0])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.k4s[0])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k5s[0])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k6s[0])}
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">lb/h</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k1s[1])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k2",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k3s[1]) }
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k4s[1]) }
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k5s[1]) }
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k6s[1]) }
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k1s[2])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k2s[2])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k3",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k4s[2])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k5s[2])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k6s[2])}
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">ft3/h</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k1s[3])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k2s[3])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k3s[3])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k4",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k5s[3])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k6s[3])}
            </div>
          </Grid>
      </Grid>



      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Nm3/h</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k1s[4])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k2s[4])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k3s[4])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k4s[4])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k5",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k6s[4])}
            </div>
          </Grid>
      </Grid>


      <Grid container>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">SCFM</div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k1s[5])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k2s[5])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k3s[5])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k4s[5])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.k5s[5])}
            </div>
          </Grid>
          <Grid item xs={1.5}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
                data: calcFormData,
                name: "k6",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
      </Grid>


      
               


    </Grid>
  );
}
