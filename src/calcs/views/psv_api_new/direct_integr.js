import { LoadingButton } from "@mui/lab";
import { useContext, useEffect, useState } from "react";
import { httpPost } from "../../../http";
import { debounce, toFixed } from "../../../utils";
import { PatmContext } from "../../context";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Grid, TextField } from "@mui/material";
import { NumberInput } from "../../../components/NumberInput";
import { CheckedBox } from "../../../components/CheckedBox";
import { Combox } from "../../../components/Combox";
import { Charts } from "../../../components/Charts";
import { direct_table_liq, direct_table_p, direct_table_t, direct_table_vap, direct_table_vf, high_subc_x, high_subc_y, omega10_ad_y, omega10_x, omega10_y, omega15_ad_y, omega15_x, omega15_y, omega20_ad_y, omega20_x, omega20_y, omega40_ad_y, omega40_x, omega40_y, omega5_ad_y, omega5_x, omega5_y, omega7_ad_y, omega7_x, omega7_y, ws_x, ws_y } from "./data";

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
    if (formData[`pres${str}`]) {
      resolve(
        httpPost({
          url: "/api/directIntegr/apdi_calculate",
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
    } else {
      resolve({});
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
export default function DirectIntegr() {
  const patmContext = useContext(PatmContext);
  const [isCalcing, setIsCalcing] = useState(false);
  useEffect(() => {
    calcFormData.patm = patmContext.bar;
    setCalcFormData({ ...calcFormData });
  }, [patmContext]);

  useEffect(() => {
    debCalcApi({
      calcFormData,
      setIsCalcing,
      setCalcFormData,
    });
  }, []);

  const [calcFormData, setCalcFormData] = useState({
    pres:135,	
/**
     * Set pressure of the PSV (Pset)
     * apdi_pres
     */	
pres_unit:'barg',	
/**
     * Set pressure of the PSV (Pset)
     * apdi_pres
     */	
acc:0.0,	
    /**
     * Overpressure (10% by default)
     * apdi_acc，什么情况下都可传空,默认0.1
     */	
temp_unit:'C',	
    /**
     * Temperature
     */	
contpr:20,	
   /**
     * Back-pressure (P2)
     * apdi_contpr
     */	
kd:0.85,	
    /**
     * Kd: discharge coefficient (0.85 by default)
     * apdi_kd，什么情况下都可传空,默认0.85
     */	
rupturedisc:false,	
    /**
     * rupt.disc,根据case
     */	
kc:0.9,	
    /**
     * Kc: PSV-RD correction (0.9 by default)
     * apdi_kc，什么情况下都可传空
     * 即使不传空，后端代码也会默认设置0.9
     */	
bellow:false,	
    /**
     * Bellows,根据case
     */	
kbSpecif:false,	
    /**
     * Kb specif,根据case
     */	
kb:0,	
    /**
     * Kb: correction factor due to back press.
     * apdi_kb
     * kbSpecif = true,kb必填
     * 注：此处excel存在点问题，bellow=true；kbSpecif=true时kb才会填值，实际bellow=true就应该填值
     */	
deb:136000,	
    /**
     * Flowrate
     * apdi_deb
     */	
massfl_unit:'kg/h',	
    /**
     * Flowrate
     */	
flux_unit:	'kg/s.m2',
    /**
     * Results
     * Mass flux (G)
     */	
area_unit: 'cm2',	
    /**
     * Results
     * Calculated orifice area
     */	
patm: patmContext.bar,	
    /**
     * sheet Doc
     * Patm bar
     */	
api526:	true,	
    /**
     * Selection of a standard oriffice from API 526
     */	
secsel:0,	
    /**
     * Selected orifice area
     * apdi_secsel
     * api526 = false，必传
     */	
d_pres_unit:'bara',	
    /**
     * Physical properties (Vap-Liq)
     * P
     */	
d_temp_unit:'C',	
    /**
     * Physical properties (Vap-Liq)
     * T
     */	
d_rhog_unit:'kg/m3',	
    /**
     * Physical properties (Vap-Liq)
     * Rho Vap
     */	
d_rhol_unit:'kg/m3',	
    /**
     * Physical properties (Vap-Liq)
     * Rho Liq
     */	
det_p:direct_table_p,
    /**
     * Physical properties (Vap-Liq)
     * P
     */	
det_t:direct_table_t,
    /**
     * Physical properties (Vap-Liq)
     * T
     */	
det_vf:direct_table_vf,
    /**
     * Physical properties (Vap-Liq)
     * VF
     */	
det_rhog: direct_table_vap,
/**
     * Physical properties (Vap-Liq)
     * Rho Vap
     * 大小和det_p一样，不足补null
     */	
det_rhol: direct_table_liq,	
    /**
     * Physical properties (Vap-Liq)
     * Rho Liq
     * 大小和det_p一样，不足补null
     */	
  })
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
        Sizing of pressure safety valves by direct integration method
        </div>

      </Grid>
      <Grid item xs={8}>
        <div className="fl f-a-c h-30">
          API standard RP-520 9th 2014 / 10th 2020
        </div>
        <div className="fl f-a-c h-30">
          Homogeneous Equilibrium Method
        </div>
        <div className="fl f-a-c h-30 c-red">
          This method is known to be very conservative for two phase flow
        </div>
      </Grid>
      <Grid item xs={4}>
        <LoadingButton
          loading={isCalcing}
          loadingPosition="start"
          startIcon={<CalculateIcon />}
          size="large"
          style={{ width: "150px", marginBottom: "5px" }}
          onClick={() => {
            debCalcApi({
              calcFormData,
              setIsCalcing,
              setCalcFormData,
            });
          }}
          variant="contained"
        >
          计算
        </LoadingButton>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Case study</div>
      </Grid>
      <Grid item xs={7.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          <TextField fullWidth variant="standard" />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">{`Patm=${patmContext.bar}(bar)/${patmContext.psi}(psi)`}</div>
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
        <div className="fl f-a-c h-30 b-1-gray">Temperature</div>
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
          label="rupt.disc"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$1"}
          setFunc={setCalcFormData}
          label="rupt.disc"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$2"}
          setFunc={setCalcFormData}
          label="rupt.disc"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"rupturedisc$3"}
          setFunc={setCalcFormData}
          label="rupt.disc"
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
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.rupturedisc}
            name="kc"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.rupturedisc$1}
            name="kc$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.rupturedisc$2}
            name="kc$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            disabled={!calcFormData.rupturedisc$3}
            name="kc$3"
            setFunc={setCalcFormData}
          />
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
          label="Kb specif"
        />
      </Grid>

      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$1"}
          setFunc={setCalcFormData}
          label="Kb specif"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$2"}
          setFunc={setCalcFormData}
          label="Kb specif"
        />
      </Grid>
      <Grid item xs={1.5}>
        <CheckedBox
          data={calcFormData}
          name={"kbSpecif$3"}
          setFunc={setCalcFormData}
          label="Kb specif"
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

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
        Flowrate
        </div>
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
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.deb)}</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.deb$1)}</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.deb$2)}</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.deb$3)}</div>
      </Grid>

      




      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Results</div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Mass flux (G)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        {Combox({
            options: [
              { name: "kg/s.m2", value: "kg/s.m2" },
              { name: "kg/h.m2", value: "kg/h.m2" },
              { name: "kg/s.cm2", value: "kg/s.cm2" },
              { name: "lb/s.ft2", value: "lb/s.ft2" },
              { name: "lb/h.in2", value: "lb/h.in2" },
              { name: "lb/h.ft2", value: "lb/h.ft2" },
            ],
            data: calcFormData,
            name: "flux_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.massflux) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.massflux$1) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.massflux$2) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.massflux$3)}
        </div>
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
        <div className="fl f-a-c h-30 f-j-c b-1-gray">{calcFormData.area_unit}</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            data={calcFormData}
            disabled={calcFormData.api526}
            name="secsel"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            data={calcFormData}
            disabled={calcFormData.api526}
            name="secsel$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            data={calcFormData}
            disabled={calcFormData.api526}
            name="secsel$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            data={calcFormData}
            disabled={calcFormData.api526}
            name="secsel$3"
            setFunc={setCalcFormData}
          />
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


      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">Physical properties (Vap-Liq)</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          P
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          T
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          VF
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          Rho Vap
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          Rho Liq
        </div>
      </Grid>


      <Grid item xs={4.5}>
        
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          bara
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          C
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          -
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          kg/m3
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          kg/m3
        </div>
      </Grid>

      {calcFormData.det_p.map((it,ix)=>{
        return <>
          <Grid item xs={4.5}>
        
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData.det_p}
            name={ix}
            setFunc={(data)=>{
              console.log("det_p",data)
              calcFormData.det_p=Object.values(data)
              setCalcFormData({...calcFormData})
            }}
          />
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData.det_t}
            name={ix}
            setFunc={(data)=>{
              calcFormData.det_t=Object.values(data)
              setCalcFormData({...calcFormData})
            }}
          />
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData.det_vf}
            name={ix}
            setFunc={(data)=>{
              calcFormData.det_vf=Object.values(data)
              setCalcFormData({...calcFormData})
            }}
          />
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData.det_rhog}
            name={ix}
            setFunc={(data)=>{
              calcFormData.det_rhog=Object.values(data)
              setCalcFormData({...calcFormData})
            }}
          />
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            data={calcFormData.det_rhol}
            name={ix}
            setFunc={(data)=>{
              calcFormData.det_rhol=Object.values(data)
              setCalcFormData({...calcFormData})
            }}
          />
          </div>
        </Grid>
        </>
      })}

      
    </Grid>
  );
}