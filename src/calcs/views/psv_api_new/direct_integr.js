import { LoadingButton } from "@mui/lab";
import { useContext, useEffect, useState } from "react";
import { httpPost } from "../../../http";
import { debounce, toFixed, toFixedTip } from "../../../utils";
import { PatmContext } from "../../context";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import { NumberInput } from "../../../components/NumberInput";
import { CheckedBox } from "../../../components/CheckedBox";
import { Combox } from "../../../components/Combox";
import { Charts } from "../../../components/Charts";
import {
  direct_table_liq,
  direct_table_p,
  direct_table_t,
  direct_table_vap,
  direct_table_vf,
} from "./data";
import { RadioGroups } from "../../../components/RadioGroup";

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
function getAplWater(params){
  return httpPost({
      url: "/api/directIntegr/water_steam",
      params,
      nofilter: true,
    })
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
    pres: 135,
    /**
     * Set pressure of the PSV (Pset)
     * apdi_pres
     */
    pres_unit: "barg",
    /**
     * Set pressure of the PSV (Pset)
     * apdi_pres
     */
    acc: 0.1,
    /**
     * Overpressure (10% by default)
     * apdi_acc，什么情况下都可传空,默认0.1
     */
    temp_unit: "C",
    /**
     * Temperature
     */
    contpr: 20,
    /**
     * Back-pressure (P2)
     * apdi_contpr
     */
    kd: 0.85,
    /**
     * Kd: discharge coefficient (0.85 by default)
     * apdi_kd，什么情况下都可传空,默认0.85
     */
    rupturedisc: false,
    /**
     * rupt.disc,根据case
     */
    kc: 0.9,
    /**
     * Kc: PSV-RD correction (0.9 by default)
     * apdi_kc，什么情况下都可传空
     * 即使不传空，后端代码也会默认设置0.9
     */
    bellow: false,
    /**
     * Bellows,根据case
     */
    kbSpecif: false,
    /**
     * Kb specif,根据case
     */
    kb: 0,
    /**
     * Kb: correction factor due to back press.
     * apdi_kb
     * kbSpecif = true,kb必填
     * 注：此处excel存在点问题，bellow=true；kbSpecif=true时kb才会填值，实际bellow=true就应该填值
     */
    deb: 136000,
    /**
     * Flowrate
     * apdi_deb
     */
    massfl_unit: "kg/h",
    /**
     * Flowrate
     */
    flux_unit: "kg/s.m2",
    /**
     * Results
     * Mass flux (G)
     */
    area_unit: "cm2",
    /**
     * Results
     * Calculated orifice area
     */
    patm: patmContext.bar,
    /**
     * sheet Doc
     * Patm bar
     */
    api526: true,
    /**
     * Selection of a standard oriffice from API 526
     */
    secsel: 0,
    /**
     * Selected orifice area
     * apdi_secsel
     * api526 = false，必传
     */
    d_pres_unit: "bara",
    /**
     * Physical properties (Vap-Liq)
     * P
     */
    d_temp_unit: "C",
    /**
     * Physical properties (Vap-Liq)
     * T
     */
    d_rhog_unit: "kg/m3",
    /**
     * Physical properties (Vap-Liq)
     * Rho Vap
     */
    d_rhol_unit: "kg/m3",
    /**
     * Physical properties (Vap-Liq)
     * Rho Liq
     */
    det_p: direct_table_p,
    /**
     * Physical properties (Vap-Liq)
     * P
     */
    det_t: direct_table_t,
    /**
     * Physical properties (Vap-Liq)
     * T
     */
    det_vf: direct_table_vf,
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
  });

  const [open, setOpen] = useState(false);
  const [paramForm, setParamForm] = useState({

    pt:1,	
 /**
     * State variables
     * pt true
     * p false
     */	
pinit:null,	
/**
     * Pressure(bara)
     */	
tvinit:null,	
    /**
     * Temperature(C)
     * Vapour fraction
     */	
isenth:1,	
/**
     * Expansion
     */	
pmin:1.01325,
/**
     * Minimum pressure(bara)
     * pmin<pinit
     */	
pmax:null,	

rhov_unit:'kg/m3',
rhol_unit:'kg/m3',
pres_unit:'bara',
temp_unit:'C',


  });
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Sizing of pressure safety valves by direct integration method
        </div>
      </Grid>
      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30">
          API standard RP-520 9th 2014 / 10th 2020
        </div>
        <div className="fl f-a-c h-30">Homogeneous Equilibrium Method</div>
        <div className="fl f-a-c h-30 c-red">
          This method is known to be very conservative for two phase flow
        </div>
      </Grid>
      <Grid item xs={5}>
      <Button size="large" onClick={() => setOpen(true)} variant="contained">
          Create Properties table for water/steam
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Water properties</DialogTitle>
          <DialogContent>
            <DialogContentText>Inlet Thermodynamic  state </DialogContentText>

            <RadioGroups
              label="State variables"
              row={true}
              data={paramForm}
              name={"pt"}
              options={[
                { label: "P,T", value: 1 },
                { label: "P", value: 0 },
              ]}
              setFunc={setParamForm}
            />
            {paramForm.pt=='1'?<>
              <div style={{height:'50px'}}>
              <NumberInput
              paddingTop={10}
              data={paramForm}
              label={`Pressure (${paramForm.pres_unit})`}
              name="pinit"
              setFunc={setParamForm}
            />
            </div>
            <div style={{height:'50px'}}>
            <NumberInput
            paddingTop={10}
              data={paramForm}
              label={`Temperature (${paramForm.temp_unit})`}
              name="tvinit"
              setFunc={setParamForm}
            />
            </div>
            </>:<>
            <div style={{height:'50px'}}>
            <NumberInput
            paddingTop={10}
              data={paramForm}
              label={`Pressure (${paramForm.pres_unit})`}
              name="pinit"
              setFunc={setParamForm}
            />
            </div>
            <div style={{height:'50px'}}>
            <NumberInput
              paddingTop={10}
              data={paramForm}
              label={`Vapour fraction (-)`}
              name="tvinit"
              setFunc={setParamForm}
            />
            </div>
            </>}

            <DialogContentText>Expansion </DialogContentText>
            <RadioGroups
              row={true}
              label="State variables"
              data={paramForm}
              name={"isenth"}
              options={[
                { label: "Isenthalpic", value: 1 },
                { label: "Isentroppic", value: 0 },
              ]}
              setFunc={setParamForm}
            />


            <NumberInput
            paddingTop={10}
              data={paramForm}
              label={`Minimium pressure (${paramForm.pres_unit})`}
              name="pmin"
              setFunc={setParamForm}
            />
            <NumberInput
            paddingTop={10}
              data={paramForm}
              label={`Maximium pressure (${paramForm.pres_unit})`}
              name="pmax"
              setFunc={setParamForm}
            />
            
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                getAplWater({
                    ...paramForm,
                    patm:patmContext.bar,
                    isenth:paramForm.isenth == '0'?false:true,
                    pt:paramForm.pt == '0'?false:true
                }).then((rep) => {
                    
                      setCalcFormData({...calcFormData,...rep})
                    
                    console.log('getAplWater rep',rep)
                  })
              }}
            >
              Ok
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid item xs={2.5}>
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
          {toFixedTip(calcFormData.p1)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.p1$1)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.p1$2)}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.p1$3)}
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
          {toFixedTip(calcFormData.pgratio)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.pgratio$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.pgratio$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.pgratio$3)}
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
          {toFixedTip(calcFormData.deb)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.deb$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.deb$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.deb$3)}
        </div>
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
          {toFixedTip(calcFormData.massflux)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.massflux$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.massflux$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.massflux$3)}
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
          {toFixedTip(calcFormData.pratio_crit)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pratio_crit$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pratio_crit$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pratio_crit$3)}
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
          {toFixedTip(calcFormData.pcrit)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pcrit$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pcrit$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.pcrit$3)}
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
          {toFixedTip(calcFormData.sec)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.sec$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.sec$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.sec$3)}
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
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {calcFormData.area_unit}
        </div>
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
          {toFixedTip(calcFormData.npsv)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.npsv$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.npsv$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.npsv$3)}
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
          {toFixedTip(calcFormData.deb_calc)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.deb_calc$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.deb_calc$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixedTip(calcFormData.deb_calc$3)}
        </div>
      </Grid>

      <Grid item xs={4.5}>
        <div className="fl f-a-c h-30 b-1-gray">
          Physical properties (Vap-Liq)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">P</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">T</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">VF</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">Rho Vap</div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">Rho Liq</div>
      </Grid>

      <Grid item xs={4.5}></Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        {Combox({
                options: [
                  { name: "bar", value: "bar" },
                  { name: "psi", value: "psi" },
                  { name: "Pa", value: "Pa" },
                  { name: "bara", value: "bara" },
                  { name: "psia", value: "psia" },
                  { name: "barg", value: "barg" },
                  { name: "psig", value: "psig" },
                ],
                data: paramForm,
                name: "pres_unit",
                setFunc: setParamForm,
              })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        {Combox({
            options: [
              { name: "°C", value: "C" },
              { name: "K", value: "K" },
              { name: "F", value: "F" },
              { name: "R", value: "R" },
            ],
            data: paramForm,
            name: "temp_unit",
            setFunc: setParamForm,
          })}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">-</div>
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
                data: paramForm,
                name: "rhov_unit",
                setFunc: setParamForm,
              })}</div>
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
                data: paramForm,
                name: "rhol_unit",
                setFunc: setParamForm,
              })}
        </div>
      </Grid>

      {calcFormData.det_p.map((it, ix) => {
        return (
          <>
            <Grid item xs={4.5}></Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c h-30 f-j-c b-1-gray">
                <NumberInput
                  data={calcFormData.det_p}
                  name={ix}
                  setFunc={(data) => {
                    console.log("det_p", data);
                    calcFormData.det_p = Object.values(data);
                    setCalcFormData({ ...calcFormData });
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c h-30 f-j-c b-1-gray">
                <NumberInput
                  data={calcFormData.det_t}
                  name={ix}
                  setFunc={(data) => {
                    calcFormData.det_t = Object.values(data);
                    setCalcFormData({ ...calcFormData });
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c h-30 f-j-c b-1-gray">
                <NumberInput
                  data={calcFormData.det_vf}
                  name={ix}
                  setFunc={(data) => {
                    calcFormData.det_vf = Object.values(data);
                    setCalcFormData({ ...calcFormData });
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c h-30 f-j-c b-1-gray">
                <NumberInput
                  data={calcFormData.det_rhog}
                  name={ix}
                  setFunc={(data) => {
                    calcFormData.det_rhog = Object.values(data);
                    setCalcFormData({ ...calcFormData });
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c h-30 f-j-c b-1-gray">
                <NumberInput
                  data={calcFormData.det_rhol}
                  name={ix}
                  setFunc={(data) => {
                    calcFormData.det_rhol = Object.values(data);
                    setCalcFormData({ ...calcFormData });
                  }}
                />
              </div>
            </Grid>
          </>
        );
      })}

      <Grid item xs={6}>
        <Charts
          yDomain={["auto", "auto"]}
          xTicks={[
            0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44,
            0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.76, 0.8, 0.84, 0.88,
            0.92, 0.96, 1,
          ]}
          scatters={["case1", "case2", "case3", "case4"]}
          xTickFormatter={(val, ix) => {
            const filterArr = [0, 0.2, 0.4,0.6, 0.8, 1];
            if (filterArr.includes(val)) return val;
            else return "";
          }}
          scatters_data={[
            {
              name: calcFormData.workDiA2,
              case1: calcFormData.workDiB2,
            },
            {
              name: calcFormData.workDiA2$1,
              case2: calcFormData.workDiB2$1,
            },
            {
              name: calcFormData.workDiA2$2,
              case3: calcFormData.workDiB2$2,
            },
            {
              name: calcFormData.workDiA2$3,
              case4: calcFormData.workDiB2$3,
            },
          ]}
          xDomain={["auto", "auto"]}
          xData={(calcFormData.workDiA || []).map((it) => toFixed(it))}
          yDatas={[calcFormData.workDiB || []]}
          yTicks={[
            0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
            11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
            20000, 21000, 22000, 23000, 24000,
          ]}
          columns={["p/p1"]}
        />
      </Grid>
      <Grid item xs={6}>
        <Charts
          yDomain={['dataMin', 'auto']}
          yRightDomain={['dataMin', 'auto']}
          xDomain={[0 , Math.max(...calcFormData.det_p)]}
          xData={(calcFormData.det_p || []).map((it) => toFixed(it))}
          yDatas={[(calcFormData.det_t || []),(calcFormData.det_vf || [])]}
          
          rightY={true}
        
          columns={[{dataKey:"T(C)"},{dataKey:"VF",yAxisId:"right"}]}
        />
      </Grid>
    </Grid>
  );

}
