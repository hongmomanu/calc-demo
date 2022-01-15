import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import usePrevious from "../../../hooks/use-previous";
import { toFixed } from "../../../utils";

function calcApi({
  setCalcFormData,
  calcFormData,
  cvkey,
  dkey,
  type,
  old_unit,
  kkey,
}) {
  calcFormData.ckv = calcFormData[cvkey];
  calcFormData.d = calcFormData[dkey];
  calcFormData.type = type;
  if (old_unit) calcFormData.old_unit = old_unit;

  httpPost({
    url: "api/line/fitting/fitting_values",
    params: calcFormData,
  }).then((rep) => {
    rep[kkey] = rep.k;
    setCalcFormData({ ...calcFormData, ...rep });
  });
}

function LocalCalcResult(formData) {
  console.log("formData", formData);
  return (
    <Grid container>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Sum (L/D*number or K*number)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {formData[2]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {formData[3]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)}
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {formData[4]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)}
        </div>
      </Grid>
    </Grid>
  );
}
function LocalCalcResultTwo(formData) {
  return (
    <Grid container>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[1]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[2]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[3]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
    </Grid>
  );
}

function LocalCalcForm() {
  const [formData, setFormData] = useState([
    [
      "Open slide (gate) valve",
      "Open globe valve",
      "Open angle valve",
      "Open butterfly valve",
      "Open ball valve",
      "Open plug valve",
      "Swing check valve",
      "T - side inlet - 2 outlets on the main tube",
      "T - side inlet - 1 outlet on the main tube",
      "T - 1 side outlet",
      "T - inlet and outlet on the main tube",
      "45° elbow middle radius of curvature",
      "90° elbow middle radius of curvature",
      "180° elbow middle radius of curvature",
      "Nozzle on a tank",
      "Sudden contraction",
      "Sudden widening",
      "Others …",
      "Others …",
      "Others …",
      "Others …",
    ],
    [
      7, 330, 180, 12, 5, 45, 77, 67, 90, 67, 20, 15, 26, 50, 18, 15, 31, 0, 0,
      0, 0,
    ],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return (
    <>
      {formData[0].map((it, ix) => {
        return (
          <Grid key={ix} container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{it}</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {formData[1][ix]}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[2],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[2] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[3],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[3] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[4],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[4] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
          </Grid>
        );
      })}
      {LocalCalcResult(formData)}
    </>
  );
}

function LocalCalcFormTwo() {
  const [formData, setFormData] = useState([
    [
      0.14, 6.6, 3.6, 0.24, 0.1, 0.9, 1.54, 1.34, 1.8, 1.34, 0.4, 0.3, 0.52, 1,
      0.36, 0.3, 0.62, 0, 0, 0, 0,
    ],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return (
    <>
      {formData[0].map((it, ix) => {
        return (
          <Grid key={ix} container>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {formData[0][ix]}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[1],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[1] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[2],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[2] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[3],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[3] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
          </Grid>
        );
      })}
      {LocalCalcResultTwo(formData)}
    </>
  );
}

function LocalCalc() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Fittings and valves</div>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={1.5}></Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#3</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">L/D</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
          </Grid>
          <LocalCalcForm />
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#2</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#3</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
          </Grid>
          <LocalCalcFormTwo />
        </Grid>
      </Grid>
    </Grid>
  );
}
let cvt;
export default function Fittings() {
  const [calcFormData, setCalcFormData] = useState({
    cv: 3100,
    cvm: 860,
    kv: 2682,
    kvf: 44430,
    d: 0.25,
    cd: 250,
    md: 250,
    kd: 250,
    kfd: 250,
    kcv: 0.87,
    kcvm: 0.83,
    kkv: 0.87,
    kkvf: 0.88,
    new_unit: "mm",
    old_unit: "mm",
  });
  const old_unit = usePrevious(calcFormData.new_unit);
  useEffect(() => {
    if (cvt) {
      clearTimeout(cvt);
    }
    cvt = setTimeout(() => {
      const newData = { ...calcFormData };
      calcApi({
        calcFormData: newData,
        setCalcFormData,
        cvkey: "cv",
        dkey: "cd",
        type: 1,
        old_unit,
        kkey: "kcv",
      });
    }, 200);
  }, [calcFormData.cv, calcFormData.cd, calcFormData.new_unit]);

  useEffect(() => {
    if (cvt) {
      clearTimeout(cvt);
    }
    cvt = setTimeout(() => {
      const newData = { ...calcFormData };
      calcApi({
        calcFormData: newData,
        setCalcFormData,
        cvkey: "cvm",
        dkey: "md",
        type: 2,
        old_unit,
        kkey: "kcvm",
      });
    }, 200);
  }, [calcFormData.cvm, calcFormData.md, calcFormData.new_unit]);

  useEffect(() => {
    if (cvt) {
      clearTimeout(cvt);
    }
    cvt = setTimeout(() => {
      const newData = { ...calcFormData };
      calcApi({
        calcFormData: newData,
        setCalcFormData,
        cvkey: "kv",
        dkey: "kd",
        type: 3,
        old_unit,
        kkey: "kkv",
      });
    }, 200);
  }, [calcFormData.kv, calcFormData.kd, calcFormData.new_unit]);

  useEffect(() => {
    if (cvt) {
      clearTimeout(cvt);
    }
    cvt = setTimeout(() => {
      const newData = { ...calcFormData };
      calcApi({
        calcFormData: newData,
        setCalcFormData,
        cvkey: "kvf",
        dkey: "kfd",
        type: 4,
        old_unit,
        kkey: "kkvf",
      });
    }, 200);
  }, [calcFormData.kvf, calcFormData.kfd, calcFormData.new_unit]);

  return (
    <Grid container>
      <LocalCalc />
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CV (US Units)</div>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">gpm - 1 psi</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.kcv}</div>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CVm (Metric Units)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CVm</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 mH20</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "cvm",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "md",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kcvm",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV (flow factor)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kkv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV (French)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">l/min - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kvf",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kfd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "kkvf",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
