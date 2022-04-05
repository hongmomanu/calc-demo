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
import { PatmContext } from "../../context";

function makePromise(idx, calcFormData, setCalcFormData) {
  return new Promise((resolve, reject) => {
    let str = "";
    if (idx > 0) {
      str = `$${idx}`;
    }
    const formData = { ...calcFormData };
    for (let p in formData) {
      if (formData.hasOwnProperty(`${p}${str}`)) {
        formData[p] = formData[`${p}${str}`];
      }
    }
    if(formData[`pres${str}`]){
      resolve(
        httpPost({
          url: "/api/gasliq/apgl_calculate",
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

export default function GasLiq() {
  const [isCalcing, setIsCalcing] = useState(false);
  const patmContext = useContext(PatmContext);  
  console.log('patmContext',patmContext)

  useEffect(()=>{
    calcFormData.patm = patmContext.bar
    calcFormData.patmpsi = patmContext.psi
    setCalcFormData({ ...calcFormData})
  },[patmContext])

  const [calcFormData, setCalcFormData] = useState({
    pres_unit: "barg",
    /**
     * Set pressure of the PSV (Pset)
     * apgl_pres
     */ pres: 7,
    /**
     * Set pressure of the PSV (Pset)
     * apgl_pres
     */ acc: 0.21,
    /**
     * Overpressure (10% by default)
     * apgl_acc
     * 可为空，设为0.1
     */ temp: 328,
    /**
     * Relieving temperature
     * apgl_temp
     */ temp_unit: "C",
    /**
     * Relieving temperature
     * apgl_temp
     */ contpr: 0,
    /**
     * Back-pressure (P2)
     * apgl_contpr
     */ kd: 0.85,
    /**
     * Kd: discharge coefficient (0.85 by default)
     * apgl_kd
     * 可为空，默认设为0.85
     */ rupturedisc: false,
    /**
     * rupt.disc,根据case
     */ kc: 0.9,
    /**
     * Kc: PSV-RD correction (0.9 by default)
     * apgl_kc
     * 可为空，默认设为0.9
     */ bellow: false,
    /**
     * Bellows,根据case
     */ kbSpecif: false,
    /**
     * Kb.specif,根据case
     */ kb: 0,
    /**
     * Kb: correction factor due to back press.
     * apgl_kb
     */ opt_omega: 2,
    opt_omega$1: 0,
    opt_omega$2: 0,
    opt_omega$3: 0,
    /**
     * Omgea
     * D.1 Flash 1
     * D.2 Flash 2
     * w.speif   3
     * Non flash 4
     */ omega: 0,
    /**
     * Omega parameter (w)
     * apgl_omega
     * opt_omega = 3必填
     */ debv: 21600,
    /**
     * Gas characteristics
     * Flowrate
     * apgl_debv
     */ massfl_unit: "kg/h",
    /**
     * Gas characteristics
     * Flowrate
     * apgl_debv
     */ kcp: 1.15,
    /**
     * Gas characteristics
     * k=Cp/Cv
     * apgl_kcp
     */ wmol: 100,
    wmol_unit: "kg/kmol",
    /**
     * Gas characteristics
     * Molecular weight
     * apgl_wmol
     */ zcompr: 1,
    /**
     * Gas characteristics
     * Compressibility factor z=PV/RT
     * apgl_zcompr
     */ rhov_unit: "kg/m3",
    /**
     * Gas characteristics
     * Density at P1
     * apgl_rhov
     */ debl: 28800,
    /**
     * Liquid characteristics
     * Flowrate
     * apgl_debl
     */ rhol: 1200,
    /**
     * Liquid characteristics
     * Density
     * apgl_rhol
     */ rhol_unit: "kg/m3",
    /**
     * Liquid characteristics
     * Density
     * apgl_rhol
     */ cpl: 4000,
    /**
     * Liquid characteristics
     * Specific heat (Cp)
     * apgl_cpl
     */ masscp_unit: "J/kg.K",
    /**
     * Liquid characteristics
     * Specific heat (Cp)
     * apgl_cpl
     */ dhvap: 2500000,
    /**
     * Liquid characteristics
     * Heat of vaporization
     * apgl_dhvap
     */ spenergy_unit: "J/kg",
    /**
     * Liquid characteristics
     * Heat of vaporization
     * apgl_dhvap
     */ area_unit: "cm2",
    /**
     * Calculated orifice area
     * apgl_sec
     */ api526: true,
    /**
     * Selection of a standard oriffice from API 526
     */ secsel: 0,
    /**
     * api526 = false必填
     * Selected orifice area
     * apgl_secsel
     */ patm: patmContext.bar,
    /**
     * sheet Doc
     * Patm bar
     */ patmpsi: patmContext.psi,
    /**
     * sheet Doc
     * Patm psi
     */ // 结果
    p1: 0 /**      * Upstream relieving pressure (P1)      */,
    pgratio: 0 /**      * Percent of gauge pressure (P2/P1)      * apgl_pgratio      */,
    omega: 0,
    /**
     * Omega parameter (w)
     * apgl_omega
     */ kb: 0,
    /**
     * Kb: correction factor due to back press.
     * apgl_kb
     */ rhov: 0,
    /**
     * Gas characteristics
     * Density at P1
     * apgl_rhov
     */ pratio_crit: 0,
    /**
     * Results
     * Critical pressure ratio
     * apgl_pcrit_ratio
     */ pcrit: 0,
    /**
     * Results
     * Critical pressure
     * apgl_pcrit
     */ regime: "",
    /**
     * Results
     * Regime
     * apgl_regime
     */ ggc: 0,
    /**
     * Results
     * G/Gc
     * apgl_ggc
     */ sec: 0,
    /**
     * Results
     * Calculated orifice area
     * apgl_sec
     */ psvsel: "",
    /**
     * Selected standard API 526 orifice
     * apgl_psvsel
     */ secsel: 0,
    /**
     * Selected orifice area
     * apgl_secsel
     */ npsv: 0,
    /**
     * Number of PSV
     * apgl_npsv
     */ deb_calc: 0,
    /**
     * Flowrate through PSV
     * apgl_deb_calc
     */
  });
  const [chartData, setChartData] = useState({});
  const [chartData$1, setChartData$1] = useState({});
  const [chartData$2, setChartData$2] = useState({});
  const [chartData$3, setChartData$3] = useState({});

  useEffect(() => {
    if (calcFormData.omega) {
      httpPost({
        url: "/api/gasliq/apgl_atlas",
        params: { omega: calcFormData.omega },
      }).then((rep) => {
        setChartData(rep);
      });
    }

  }, [calcFormData.omega]);
  useEffect(()=>{
    if (calcFormData.omega$1) {
      httpPost({
        url: "/api/gasliq/apgl_atlas",
        params: { omega: calcFormData.omega$1 },
      }).then((rep) => {
        setChartData$1(rep);
      });
    }
  },[calcFormData.omega$1])
  useEffect(()=>{
    if (calcFormData.omega$2) {
      httpPost({
        url: "/api/gasliq/apgl_atlas",
        params: { omega: calcFormData.omega$2 },
      }).then((rep) => {
        setChartData$2(rep);
      });
    }
  },[calcFormData.omega$2])
  useEffect(()=>{
    if (calcFormData.omega$3) {
      httpPost({
        url: "/api/gasliq/apgl_atlas",
        params: { omega: calcFormData.omega$3 },
      }).then((rep) => {
        setChartData$3(rep);
      });
    }
  },[calcFormData.omega$3])
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
          Sizing of pressure safety valves for flashing or not flashing flow
        </div>
        <div className="fl f-a-c h-30">
          API standard RP-520 7th 2000: Recommended Practice, appendix D
        </div>
        <div className="fl f-a-c h-30">
          Leung omega method (Homogeneous Equilibrium Method)
        </div>
        <div className="fl f-a-c h-30 c-red">
          This method is known to be very conservative
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
          Upstream relieving pressure (P1)
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
        <div className="fl f-a-c h-30 b-1-gray">Relieving temperature</div>
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
        <div className="fl f-a-c h-30 b-1-gray">Back-pressure (P2)</div>
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
          Percent of gauge pressure (P2/P1)
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

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Kd: discharge coefficient (0.85 by default)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kd"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kd$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kd$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="kd$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}></Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc"}
          setFunc={setCalcFormData}
          label="upt.disc"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$1"}
          setFunc={setCalcFormData}
          label="upt.disc"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$2"}
          setFunc={setCalcFormData}
          label="upt.disc"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$3"}
          setFunc={setCalcFormData}
          label="upt.disc"
        />
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Kc: PSV-RD correction (0.9 by default)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput data={calcFormData}
            disabled={!calcFormData.rupturedisc}
            name="kc"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.rupturedisc$1}
            name="kc$1"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.rupturedisc$2}
            name="kc$2"
            setFunc={setCalcFormData} />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
        <NumberInput data={calcFormData}
            disabled={!calcFormData.rupturedisc$3}
            name="kc$3"
            setFunc={setCalcFormData} />
        </div>
      </Grid>

      <Grid item xs={6}></Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"bellow"}
          setFunc={setCalcFormData}
          label="Bellows"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"bellow$1"}
          setFunc={setCalcFormData}
          label="Bellows"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"bellow$2"}
          setFunc={setCalcFormData}
          label="Bellows"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"bellow$3"}
          setFunc={setCalcFormData}
          label="Bellows"
        />
      </Grid>

      <Grid item xs={6}></Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif"}
          setFunc={setCalcFormData}
          label="Kb.specif"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$1"}
          setFunc={setCalcFormData}
          label="Kb.specif"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$2"}
          setFunc={setCalcFormData}
          label="Kb.specif"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$3"}
          setFunc={setCalcFormData}
          label="Kb.specif"
        />
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Kb: correction factor due to back press.
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.kbSpecif && !calcFormData.bellow}
            name="kb"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.kbSpecif$1 && !calcFormData.bellow$1}
            name="kb$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.kbSpecif$2 && !calcFormData.bellow$2}
            name="kb$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.kbSpecif$3 && !calcFormData.bellow$3}
            name="kb$3"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}></Grid>

      <Grid item xs={1.5}>
        <RadioGroups
          label="Omgea"
          data={calcFormData}
          name={"opt_omega"}
          options={[
            { label: "D.1 Flash", value: 1 },
            { label: "D.2 Flash", value: 2 },
            { label: "w.speif", value: 3 },
            { label: "Non flash", value: 4 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
        <RadioGroups
          label="Omgea"
          data={calcFormData}
          name={"opt_omega$1"}
          options={[
            { label: "D.1 Flash", value: 1 },
            { label: "D.2 Flash", value: 2 },
            { label: "w.speif", value: 3 },
            { label: "Non flash", value: 4 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
        <RadioGroups
          label="Omgea"
          data={calcFormData}
          name={"opt_omega$2"}
          options={[
            { label: "D.1 Flash", value: 1 },
            { label: "D.2 Flash", value: 2 },
            { label: "w.speif", value: 3 },
            { label: "Non flash", value: 4 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={1.5}>
        <RadioGroups
          label="Omgea"
          data={calcFormData}
          name={"opt_omega$3"}
          options={[
            { label: "D.1 Flash", value: 1 },
            { label: "D.2 Flash", value: 2 },
            { label: "w.speif", value: 3 },
            { label: "Non flash", value: 4 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Omega parameter (w)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.omega)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.omega$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.omega$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(calcFormData.omega$3)}
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
        <div className="fl f-a-c h-30 b-1-gray">Density at P1</div>
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
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio</div>
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
        <div className="fl f-a-c h-30 b-1-gray">G/Gc</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.ggc)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.ggc$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.ggc$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.ggc$3)}
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

      <Grid item xs={12}>
        <div className="fl f-a-c h-30 b-1-gray">
          <CheckedBox
            data={calcFormData}
            name={"api526"}
            setFunc={setCalcFormData}
            label="Selection of a standard oriffice from API 526"
          />
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Selected standard API 526 orifice
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

      <Grid item xs={7}>
        <Charts
          xData={(chartData.omegas || []).slice(0,51)}
          //   xTickCount={7}
          //   yDomain={[0,70]}
          //   showDot={<CustomizedDot />}
          //   xDomain={[0,3]}
          yDatas={[chartData.ncs || [], chartData$1.ncs||[], chartData$2.ncs||[], chartData$3.ncs||[]]}
          columns={["case1","case2","case3","case4"]}
        />
      </Grid>
    </Grid>
  );
}
