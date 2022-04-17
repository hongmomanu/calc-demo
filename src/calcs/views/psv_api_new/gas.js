import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useContext, useEffect, useState } from "react";
import { PatmContext } from "../../context";
import { debounce, toFixed } from "../../../utils";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { CheckedBox } from "../../../components/CheckedBox";
import { httpPost } from "../../../http";

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
            url: "/api/gas/apg_calculate",
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
  function getAplWater(params){
    return httpPost({
        url: "/api/gas/apg_steam",
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

export default function Gas() {
  const patmContext = useContext(PatmContext);  
  const [isCalcing, setIsCalcing] = useState(false);
  useEffect(()=>{
    calcFormData.patm  = patmContext.bar
    setCalcFormData({ ...calcFormData})
  },[patmContext])

  useEffect(() => {
    debCalcApi({
      calcFormData,
      setIsCalcing,
      setCalcFormData,
    })
  },[])

  const [calcFormData, setCalcFormData] = useState({
    pres:5,
    /**
         * Set pressure of the PSV (Pset)
         * agp_pres
    */	
    pres_unit:'barg',
    /**
         * Set pressure of the PSV (Pset)
         * apg_pres
    */	
    acc:0.21,	
    /**
     * Overpressure (10% by default)
     * apg_acc,可为空，默认0.1
     */	
    temp:325,	
    /**
     * Relieving temperature
     * apg_temp
     */	
    temp_unit:'C',
    /**
     * Relieving temperature
     * apg_temp
     */	
    contpr:0,
    /**
     * Back-pressure (P2)
     * apg_contpr
     */	
    kd:0.975,	
        /**
         * Kd: discharge coefficient (0.975 by default)
         * apg_kd,可为空，默认0.975
         */	
    rupturedisc:true,	
    /**
     * rupt.disc,根据case
     */	
    kc:0.9,
        /**
         * Kc: PSV-RD correction (0.9 by default)
         * kc,可为空,默认0.9
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
         * apg_kb,
         * bellow =true;kbSpecif=true作为参数,不能为空
         */	
    debg:10271,
        /**
         * Gas characteristics
         * Flowrate (m)
         * apg_deb
         */	
    massfl_unit:'kg/h',
        /**
         * Gas characteristics
         * Flowrate (m)
         * apg_deb
         */	
    kcp:1.011,
        /**
         * Gas characteristics
         * k=Cp/Cv
         * apg_kcp
         */	
    wmol:284,	
    wmol_unit: "kg/kmol",
        /**
         * Gas characteristics
         * Molecular weight
         * apg_wmol
         */	
    zcompr:1,	
        /**
         * Gas characteristics
         * Compressibility factor z=PV/RT
         * apg_zcompr
         */	
    rho_unit:'kg/m3',	
    /**
     * Gas characteristics
     * Density at P1
     * apg_rhog
     */	
    area_unit:'cm2',
        /**
         * Results
         * Calculated orifice area
         * apg_sec
         */	
    patm:patmContext.bar,	
        /**
         * sheet Doc
         * Patm bar
         */	
    api526:true,	
        /**
         * Selection of a standard oriffice from API 526
         */	
    secsel:11.860,	
        /**
         * Selected orifice area
         * apg_secsel
         * 当api526=false，必填
         */

  });

  const [open, setOpen] = useState(false);
  const [paramForm, setParamForm] = useState({
    case: "0",
    pressure: 5,
    temp: 0,
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Sizing of pressure safety valves for gas
        </div>
        <div className="fl f-a-c h-30" style={{ justifyContent: "flex-end" }}>
          Solvay GEC-PEE-NOH/PJR version 2.6
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30">
            API standard RP-520 9th 2014 / 10th 2020
        </div>
      </Grid>
      <Grid item xs={4}>
        <Button size="large" onClick={() => setOpen(true)} variant="contained">
          Set Water Properties
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Water properties</DialogTitle>
          <DialogContent>
            <DialogContentText>Thermodynamic state by Case</DialogContentText>
            {Combox({
              size:'large',
              options: [
                { name: "Case1", value: "0" },
                { name: "Case2", value: "1" },
                { name: "Case3", value: "2" },
                { name: "Case4", value: "3" },
              ],
              data: paramForm,
              name: "case",
              setFunc: setParamForm,
            })}
            <NumberInput
              data={paramForm}
              label={`Pressure (${calcFormData.pres_unit})`}
              name="pressure"
              setFunc={setParamForm}
            />
            <NumberInput
              data={paramForm}
              label={`Temperature (${calcFormData.temp_unit})`}
              name="temp"
              setFunc={setParamForm}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                getAplWater({
                    p:Number(paramForm.pressure),
                    t:Number(paramForm.temp),
                    pres_unit:calcFormData.pres_unit,
                    temp_unit:calcFormData.temp_unit
                }).then((rep) => {
                    if(paramForm.case === '0'){
                        setCalcFormData({...calcFormData,...rep})
                    }else{
                        const data = {}
                        for(let key in rep){
                            if(rep.hasOwnProperty(key)){
                                data[`${key}$${paramForm.case}`] = rep[key]
                            }
                        }
                        setCalcFormData({...calcFormData,...data})
                    }
                    
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
      <Grid item xs={2}>
      <LoadingButton
          loading={isCalcing}
          loadingPosition="start"
          startIcon={<CalculateIcon />}
          size="large"
          style={{ width: "150px", marginBottom: "5px" }}
          onClick={()=>{
            debCalcApi({
                calcFormData,
                setIsCalcing,
                setCalcFormData,
              })
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
          Kd: discharge coefficient (0.975 by default)
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
            name="debg"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debg$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debg$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="debg$3"
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
            name: "rho_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rho"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rho$1"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rho$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rho$3"
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
        <NumberInput
            disabled={calcFormData.api526}
            data={calcFormData}
            name="secsel"
            setFunc={setCalcFormData}
          />
          
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            disabled={calcFormData.api526}
            data={calcFormData}
            name="secsel$1"
            setFunc={setCalcFormData}
          />
          
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
        <NumberInput
            disabled={calcFormData.api526}
            data={calcFormData}
            name="secsel$2"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          <NumberInput
            disabled={calcFormData.api526}
            data={calcFormData}
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
          {toFixed(calcFormData.debg_calc)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.debg_calc$1)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.debg_calc$2)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c h-30 f-j-c b-1-gray">
          {toFixed(calcFormData.debg_calc$3)}
        </div>
      </Grid>


    </Grid>
  );
}
