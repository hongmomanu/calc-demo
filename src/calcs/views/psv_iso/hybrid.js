import { Button, Grid, InputAdornment } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CheckedBox } from "../../../components/CheckedBox";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { RadioGroups } from "../../../components/RadioGroup";
import LoadingButton from "@mui/lab/LoadingButton";
import CalculateIcon from "@mui/icons-material/Calculate";
import { httpPost } from "../../../http";
import { debounce, toFixed } from "../../../utils";
import { Charts } from "../../../components/Charts";

function makePromise(idx, calcFormData, setCalcFormData) {
  return new Promise((resolve, reject) => {
    let str = "";
    if (idx > 0) {
      str = `$${idx}`;
    }
    const formData = { ...calcFormData };
    for (let p in formData) {
      if(p === "method"){
          switch (Number(formData[p])) {
              case 1:
                  formData['hne'] = true
                  formData['hem'] = false
                  formData['gassy'] = false
                  break;

            case 2:
                  formData['hne'] = false
                  formData['hem'] = true
                  formData['gassy'] = false
                  break;
            case 3:
                formData['hne'] = false
                formData['hem'] = false
                formData['gassy'] = true
                  break;
              default:
                  break;
          }
      }  
      if (formData.hasOwnProperty(`${p}${str}`)) {
        formData[p] = formData[`${p}${str}`];
      }
    }
    if(formData[`pres${str}`]){
      resolve(
        httpPost({
          url: "/api/hybrid/isohy_calculate",
          params: formData,
          nofilter: true,
        }).then((rep) => {
          for (let prop in rep) {
            rep[`${prop}${str}`] = rep[prop];
            if (idx > 0) delete rep[prop];
          }
          return rep;
        })
      );
    }else{
      resolve({})
    }
    
  });
}
function calcApi({ setCalcFormData, calcFormData, setIsCalcing }) {
  setIsCalcing(true);
  const p0 = makePromise(0, calcFormData, setCalcFormData);
  const p1 = makePromise(1, calcFormData, setCalcFormData);
  const p2 = makePromise(2, calcFormData, setCalcFormData);
  const p3 = makePromise(3, calcFormData, setCalcFormData);

  Promise.all([p0, p1, p2, p3])
    .then(([rep0, rep1, rep2, rep3]) => {
      setCalcFormData({ ...calcFormData, ...rep0, ...rep1, ...rep2, ...rep3 });
      setIsCalcing(false);
    })
    .finally(() => {
      setIsCalcing(false);
    });
}
const debCalcApi = debounce(calcApi);

export default function Hybrid() {
  const [isCalcing, setIsCalcing] = useState(false);

  const [calcFormData, setCalcFormData] = useState({
    "pres":4.0,
    "pres_unit":"barg",
    "acc":null,
    "temp":200.0,
    "temp_unit":"C",
    "contpr":1.0,
    "kd2ph":false,
    "kdl":0.8,
    "kdg":0.9,
    "kd":0.95,
    "debv":5000.0,
    "massfl_unit":"kg/h",
    "yg0":0.4,
    "wmol":100.0,
    "zcompr":1.0,
    "rhov_unit":"kg/m3",
    "debl":28800.0,
    "rhol":1200.0,
    "rhol_unit":"kg/m3",
    "cpl":4000.0,
    "masscp_unit":"J/kg.K",
    "dhvap":2500000.0,
    "spenergy_unit":"J/kg",
    "area_unit":"cm2",
    "wmol_unit":'kg/kmol',
  });
  
  useEffect(() => {
    debCalcApi({
      calcFormData,
      setIsCalcing,
      setCalcFormData,
    })
  },[])
  return (
    <Grid container>
      <Grid item xs={7}>
        <div className="fl f-a-c h-30">
        Pressure relief valve sizing for high vapour pressure or gassy systems
        </div>
        <div className="fl f-a-c h-30">
        IND-HSE-PTS.15-03 / ISO 4126-10 First edition 2010-10-01
        </div>
        <div className="fl f-a-c h-30">
        Leung omega method (Homogeneous Equilibrium Method) + boiling delay factor (N)
        </div>
      </Grid>
      <Grid item xs={5}>
        <LoadingButton
          loading={isCalcing}
          loadingPosition="start"
          startIcon={<CalculateIcon />}
          size="large"
          style={{ width: "150px", marginTop: "30px" }}
          onClick={() =>
            debCalcApi({
              calcFormData,
              setIsCalcing,
              setCalcFormData,
            })
          }
          variant="contained"
        >
          计算
        </LoadingButton>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Case study</div>
      </Grid>
      <Grid item xs={7.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput type="text" />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">{`Patm=${calcFormData.patm}(bar)/${calcFormData.patmpsi}(psi)`}</div>
      </Grid>
      
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Case1</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Case2</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Case3</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Case4</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Set pressure of the PSV (Pset)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "psig", value: "psig" },
              { name: "barg", value: "barg" },
            ],
            data: calcFormData,
            name: "pres_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pres"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pres$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pres$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pres$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Overpressure (10% by default)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">%</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            step={0.01}
            data={calcFormData}
            name="acc"
            setFunc={setCalcFormData}
            // InputProps={{ endAdornment: "%" }}
          />
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="acc$1"
            setFunc={setCalcFormData}
            // InputProps={{ endAdornment: "%" }}
          />
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="acc$2"
            setFunc={setCalcFormData}
            // InputProps={{ endAdornment: "%" }}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="acc$3"
            setFunc={setCalcFormData}
            // InputProps={{ endAdornment: "%" }}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Upstream relieving pressure (P0)
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pres_unit}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.p1)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.p1$1)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.p1$2)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.p1$3)}
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Relieving temperature (T0)</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "°C", value: "C" },
              { name: "K", value: "K" },
              { name: "F", value: "F" },
              { name: "R", value: "R" },
            ],
            data: calcFormData,
            name: "temp_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="temp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="temp$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="temp$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="temp$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Back-pressure (Pb)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pres_unit}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="contpr"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="contpr$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="contpr$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="contpr$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Percent of gauge pressure (Pb/P0) 
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">%</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.pgratio)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.pgratio$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.pgratio$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.pgratio$3)}
        </div>
      </Grid>

      <Grid item xs={6}></Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kd2ph"}
          setFunc={setCalcFormData}
          label="Kd 2ph"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kd2ph$1"}
          setFunc={setCalcFormData}
          label="Kd 2ph"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kd2ph$2"}
          setFunc={setCalcFormData}
          label="Kd 2ph"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kd2ph$3"}
          setFunc={setCalcFormData}
          label="Kd 2ph"
        />
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Kdl: discharge coefficient, liquid flow
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            disabled={calcFormData.kd2ph}
            data={calcFormData}
            name="kdl"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            disabled={calcFormData.kd2ph$1}
            data={calcFormData}
            name="kdl$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            disabled={calcFormData.kd2ph$2}
            data={calcFormData}
            name="kdl$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            disabled={calcFormData.kd2ph$3}
            data={calcFormData}
            name="kdl$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Kdg: discharge coefficient, gas flow
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput data={calcFormData}
            disabled={calcFormData.kd2ph}
            name="kdg"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={calcFormData.kd2ph$1}
            name="kdg$1"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={calcFormData.kd2ph$2}
            name="kdg$2"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={calcFormData.kd2ph$3}
            name="kdg$3"
            setFunc={setCalcFormData} />
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Kd2ph: discharge coefficient
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput data={calcFormData}
            disabled={!calcFormData.kd2ph}
            name="kd"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.kd2ph$1}
            name="kd$1"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.kd2ph$2}
            name="kd$2"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.kd2ph$3}
            name="kd$3"
            setFunc={setCalcFormData} />
        </div>
      </Grid>

      

      <Grid item xs={12}>
        <div className="fl f-a-c  h-30 ">Gas characteristics</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Flowrate</div>
      </Grid>
      <Grid item xs={1.5}>
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

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debv"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debv$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debv$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debv$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">k=Cp/Cv</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kcp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kcp$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kcp$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kcp$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Molecular weight</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "kg/kmol", value: "kg/kmol" },
              { name: "lb/lbmol", value: "lb/lbmol" },
            ],
            data: calcFormData,
            name: "wmol_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="wmol"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="wmol$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="wmol$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="wmol$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Compressibility factor z=PV/RT
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="zcompr"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="zcompr$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="zcompr$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="zcompr$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Density at T0 P0</div>
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
            name: "rhov_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhov"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhov$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhov$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhov$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Liquid characteristics</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Flowrate</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.massfl_unit}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Density</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {Combox({
            options: [
              { name: "kg/m3", value: "kg/m3" },
              { name: "kg/l", value: "kg/l" },
              { name: "lb/gal", value: "lb/gal" },
              { name: "lb/ft3", value: "lb/ft3" },
            ],
            data: calcFormData,
            name: "rhol_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhol"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhol$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhol$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhol$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Specific heat (Cp)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          {Combox({
            options: [
              { name: "J/kg.K", value: "J/kg.K" },
              { name: "kJ/kg.K", value: "kJ/kg.K" },
              { name: "kcal/kg.K", value: "kcal/kg.K" },
              { name: "Btu/lb.R", value: "Btu/lb.R" },
            ],
            data: calcFormData,
            name: "masscp_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="cpl"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="cpl$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="cpl$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="cpl$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Heat of vaporization</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "J/kg", value: "J/kg" },
              { name: "kJ/kg", value: "kJ/kg" },
              { name: "Btu/lb", value: "Btu/lb" },
              { name: "kcal/kg", value: "kcal/kg" },
            ],
            data: calcFormData,
            name: "spenergy_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="dhvap"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="dhvap$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="dhvap$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="dhvap$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Results</div>
      </Grid>

      
      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Inlet mass quality (x0)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.quality)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.quality$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.quality$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.quality$3)}
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Flashing omega parameter (ws)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega_s)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega_s$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega_s$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega_s$3)}
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Stagnation inlet void fraction (a0)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.a0)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.a0$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.a0$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.a0$3)}
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Hybrid omega parameter (w)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.omega$3)}
        </div>
      </Grid>

      

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio (hcrit)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratio_crit)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratio_crit$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratio_crit$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratio_crit$3)}
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.pres_unit}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pcrit)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pcrit$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pcrit$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pcrit$3)}
        </div>
      </Grid>

      
      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.regime}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.regime$1}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.regime$2}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.regime$3}
        </div>
      </Grid>




      



      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Void fraction at valve seat (eseat)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.eps_seat)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.eps_seat$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.eps_seat$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.eps_seat$3)}
        </div>
      </Grid>
      

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Calculated orifice area</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "m2", value: "m2" },
              { name: "cm2", value: "cm2" },
              { name: "ft2", value: "ft2" },
              { name: "in2", value: "in2" },
            ],
            data: calcFormData,
            name: "area_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.sec)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.sec$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.sec$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.sec$3)}
        </div>
      </Grid>

      

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Selected orifice
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.psvsel}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.psvsel$1}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.psvsel$2}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.psvsel$3}
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Selected orifice area</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">cm2</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.secsel)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.secsel$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.secsel$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.secsel$3)}
        </div>
      </Grid>



      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Number of PSV</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.npsv)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.npsv$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.npsv$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.npsv$3)}
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Flowrate through PSV</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.massfl_unit}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.deb_calc)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.deb_calc$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.deb_calc$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.deb_calc$3)}
        </div>
      </Grid>
    </Grid>
  );
}
