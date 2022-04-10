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
          console.log("ppppp",p,formData[p] )
          switch (Number(formData[p])) {
              case 1:
                  formData['hne'] = true
                  formData['hem'] = false
                  break;

            case 2:
                  formData['hne'] = false
                  formData['hem'] = true
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
          url: "/api/pliqsubc/isols_calculate",
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

export default function LiqSubc() {
  const [isCalcing, setIsCalcing] = useState(false);

  const [calcFormData, setCalcFormData] = useState({
    "pres" : 17.926,
    "presg_unit" : "barg",
    "acc" : null,
    "temp" : 15.55,
    "temp_unit" : "C",
    "contpr" : 0.6895,
    "kd2ph" : true,
    "kdl" : null,
    "kdg" : null,
    "kd" : null,
    "hne" : true,
    "hem" : false,
    "debl" : 11613.1,
    "massfl_unit" : "kg/h",
    "rhol" : 511.31,
    "rhol_unit" : "kg/m3",
    "cpl" : 2664.9,
    "masscp_unit" : "J/kg.K",
    "dhvap" : 354250.0,
    "spenergy_unit" : "J/kg",
    "ps" : 7.419,
    "presa_unit" : "bara",
    "wmol" : 44.1,
    "zcompr" : 0.855,
    "rhov_unit" : "kg/m3",
    "area_unit" : "cm2",
    "wmol_unit":'kg/kmol',
    "method":1,
}

);
  const [chartData, setChartData] = useState({});
  const [chartData$1, setChartData$1] = useState({});
  const [chartData$2, setChartData$2] = useState({});
  const [chartData$3, setChartData$3] = useState({});

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
        Pressure safety valves sizing for subcooled liquid at the valve inlet
        </div>
        <div className="fl f-a-c h-30">
        IND-HSE-PTS.15-03 / ISO 4126-10 First edition 2010-10-01
        </div>
        <div className="fl f-a-c h-30">
        HNE-DS method (Homogeneous non equilibrium, Diener-Schmidt), boiling delay factor (N)
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
            name: "presg_unit",
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

      <Grid item xs={6}></Grid>

      <Grid item xs={1.5}>
        <RadioGroups
          label="Method"
          data={calcFormData}
          name={"method"}
          options={[
            { label: "HNE-DS", value: 1 },
            { label: "HEM", value: 2 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
      <RadioGroups
          label="Method"
          data={calcFormData}
          name={"method$1"}
          options={[
            { label: "HNE-DS", value: 1 },
            { label: "HEM", value: 2 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
      <RadioGroups
          label="Method"
          data={calcFormData}
          name={"method$2"}
          options={[
            { label: "HNE-DS", value: 1 },
            { label: "HEM", value: 2 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
      <RadioGroups
          label="Method"
          data={calcFormData}
          name={"method$3"}
          options={[
            { label: "HNE-DS", value: 1 },
            { label: "HEM", value: 2 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      

      <Grid item xs={12}>
        <div className="fl f-a-c  h-30 ">Subcooled liquid characteristics</div>
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
            name="debl"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debl$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
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
        <div className="fl f-a-c h-30">Vapour at saturation</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Saturation pressure (Ps)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        {Combox({
                options: [
                  { name: "bar", value: "bar" },
                { name: "psi", value: "psi" },
                { name: "Pa", value: "Pa" },
                { name: "bara", value: "bara" },
                { name: "psia", value: "psia" },
                ],
                data: calcFormData,
                name: "presa_unit",
                setFunc: setCalcFormData,
              })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="ps"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="ps$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="ps$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30  f-j-c b-1-gray">
          <NumberInput
            data={calcFormData}
            name="ps$3"
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
        <div className="fl f-a-c h-30 b-1-gray">Density at T0 Ps</div>
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
        <div className="fl f-a-c h-30">Results</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Omega parameter (ws)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="omega"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="omega$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="omega$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="omega$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Boiling delay factor (N)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          -
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.n_delay)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.n_delay$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.n_delay$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.n_delay$3)}
        </div>
      </Grid>


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">HNE-DS omega parameter (w)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          -
        </div>
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
        <div className="fl f-a-c h-30 b-1-gray">Transition saturation pressure ratio</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratiost) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratiost$1) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratiost$2) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.pratiost$3)}
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
        <div className="fl f-a-c h-30 b-1-gray">Flow coefficient (C)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.c}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.c$1}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.c$2}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.c$3}
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
        <div className="fl f-a-c h-30 b-1-gray">Flowrate through standard PSV</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
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


      <Grid item xs={7}>
        <Charts
          yDomain={[0,1]}
          xTickCount={17}
          yTickCount={10}
          xScale={'log'}
          xDomain={[0.01,9000]}
          xData={[calcFormData.xs||[],calcFormData.xs$1||[],calcFormData.xs$2||[],calcFormData.xs$3||[]]}
          yDatas={[calcFormData.ys||[],calcFormData.ys$1||[],calcFormData.ys$2||[],calcFormData.ys$3||[]]}
          columns={["case1","case2","case3","case4"]}
        />
      </Grid>
    </Grid>
  );
}
