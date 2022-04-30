import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const colorArr = getHslArray().map(function (item) {
  return hslToRgb(...item);
});

const colorArr2 = [
  "#ed1299",
  "#09f9f5",
  "#246b93",
  "#cc8e12",
  "#d561dd",
  "#c93f00",
  "#ddd53e",
  "#4aef7b",
  "#e86502",
  "#9ed84e",
  "#39ba30",
  "#6ad157",
  "#8249aa",
  "#99db27",
  "#e07233",
  "#ff523f",
  "#ce2523",
  "#f7aa5d",
  "#cebb10",
  "#03827f",
  "#931635",
  "#373bbf",
  "#a1ce4c",
  "#ef3bb6",
  "#d66551",
  "#1a918f",
  "#ff66fc",
  "#2927c4",
  "#7149af",
  "#57e559",
  "#8e3af4",
  "#f9a270",
  "#22547f",
  "#db5e92",
  "#edd05e",
  "#6f25e8",
  "#0dbc21",
  "#280f7a",
  "#6373ed",
  "#5b910f",
  "#7b34c1",
  "#0cf29a",
  "#d80fc1",
  "#dd27ce",
  "#07a301",
  "#167275",
  "#391c82",
  "#2baeb5",
  "#925bea",
  "#63ff4f",
];

export function Charts({
  xData,
  yDatas,
  xScale = 'auto',
  yScale = 'auto',
  columns = [],
  scatters = [],
  showDot = false,
  yTickCount = 5,
  xTickCount = 5,
  xTickSize = 5,
  yTickSize = 5,
  scatters_data = [],
  layout = "horizontal",
  yReversed = false,
  yDomain = [0, "auto"],
  xDomain = [0, "auto"],
  xinterval = 'preserveEnd',
  yinterval = 'preserveEnd',
  xTick = {},
  xTickFormatter = null,
  yTickFormatter = null,
  xTicks = null,
  yTicks = null,
  height = 400,
  width = '100%',
  legengHeight= null,
  legendStyle={},
  rightY=false,
  yRightTicks= null,
  yRightDomain = [0, "auto"],
}) {
  const chartData = [];
  scatters_data.forEach((it) => {
    chartData.push(it);
  });
  let isMultiX = false
  
  for (let i = 0; i < xData.length; i++) {
    
    if(typeof(xData[i]) === 'object'){
      xData[i].forEach((it,ix)=>{
        const key = (typeof columns[i] === 'object')? columns[i].dataKey: columns[i]
        const item = {}
        item.name = it
        item[key] = yDatas[i][ix]
        chartData.push(item);
      })
      
    }else{
      const item = {}
      item.name = xData[i]
      yDatas.forEach((it, ix) => {
        const key = (typeof columns[ix] === 'object')? columns[ix].dataKey: columns[ix]
        item[key] = it[i];
      });
      chartData.push(item);
    }
    
    
  }

  
  
  return (
    <Box
      style={{ marginTop: "30px", width: "100%", height: `${height}px` }}
      sx={{ flexGrow: 1 }}
    >
      <ResponsiveContainer width={width}>
        <ComposedChart
          layout={layout}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis
            tick = {xTick}
            interval={xinterval}
            tickCount={xTickCount}
            tickSize={xTickSize}
            scale={xScale}
            dataKey={layout === "horizontal" ? "name" : undefined}
            domain={xDomain}
            type="number"
            ticks={xTicks}
            tickFormatter={xTickFormatter}
            // scale="threshold"
          />

        
          <YAxis
            ticks={yTicks}
            interval={yinterval}
            tickCount={yTickCount}
            tickSize={yTickSize}
            domain={yDomain}
            reversed={yReversed}
            tickFormatter={yTickFormatter}
            type="number"
            scale={yScale}
            dataKey={layout === "vertical" ? "name" : undefined}
          />
          {rightY&&<YAxis
            ticks={yRightTicks}
            domain={yRightDomain}
            type="number"
            yAxisId="right"
            orientation="right"
            dataKey={layout === "vertical" ? "name" : undefined}
          />}
          <Legend wrapperStyle={legendStyle}  height={legengHeight}/>

          {scatters.map((it,ix) => {
            return (
              <Scatter
                key={it}
                name={it}
                dataKey={it}
                // fill={'rgb(' + colorArr[colorArr.length-1-ix].toString() + ')'}
                fill={colorArr2[colorArr2.length-1-ix]}
              />
            );
          })}
          <Tooltip content={<CustomTooltip />} />
          {columns.map((it, ix) => {
            const params =(typeof it === 'object')?it:{dataKey:it}
            return (
              <Line
                key={ix}
                type="monotone"
                dot={showDot}
                // stroke={'rgb(' + colorArr[ix].toString() + ')'}
                stroke={colorArr2[ix]}
                {...{...params}}
              />
            );
          })}
          
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}

// function strokeDasharrayWrap(isNoDash) {
//     const n = isNoDash?0:parseInt(10 * Math.random())
//     return `${n} ${n}`;
// }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map((it,ix)=>{
          return <p key={ix} style={{color:it.color}}  className="label">{`${it.name}坐标：(${label},${it.value})`}</p>
        })}
        
      </div>
    );
  }

  return null;
};

function getRandomColor() {
  // const color= `#${Math.floor(Math.random() * 16777215).toString(16)}`
  // console.log()
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
 

// 获取随机HSL
function randomHsl() {
  var H = Math.random();
  var S = Math.random();
  var L = Math.random();
  return [H, S, L];
}

// 获取HSL数组
function getHslArray () {
  var HSL = [];
  var hslLength = 20; // 获取数量
  for (var i = 0; i < hslLength; i++) {
    var ret = randomHsl();

    // 颜色相邻颜色差异须大于 0.25
    if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
      i--;
      continue; // 重新获取随机色
    }
    ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
    ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

    // 数据转化到小数点后两位
    ret = ret.map(function (item) {
      return parseFloat(item.toFixed(2));
    });

    HSL.push(ret);
  }
  return HSL;
}
function hslToRgb (H, S, L) {
  var R, G, B;
  if (+S === 0) {
    R = G = B = L; // 饱和度为0 为灰色
  } else {
    var hue2Rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    var P = 2 * L - Q;
    R = hue2Rgb(P, Q, H + 1/3);
    G = hue2Rgb(P, Q, H);
    B = hue2Rgb(P, Q, H - 1/3);
  }
  return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
}
