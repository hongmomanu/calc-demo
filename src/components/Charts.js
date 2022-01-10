import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Scatter, XAxis, YAxis } from "recharts";

export function Charts({xData,yDatas,columns=[]}){
    const chartData = [];
    for (let i = 0; i < xData.length; i++) {
        const item = {
            name: xData[i],
        };
        yDatas.forEach((it,ix) => {
            item[columns[ix]] = it[i];
          });
        chartData.push(item);
    }
    console.log("chartData",chartData)
  
    return (
      <Box
        style={{ marginTop: "30px", width: "100%", height: "400px" }}
        sx={{ flexGrow: 1 }}
      >
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              type="number"
            //   domain={[0, "dataMax"]}
              tickCount={6}
            />
            <YAxis type="number"  tickCount={10} />
            <Legend />

            {columns.map((it,ix)=>{
                return <Line
                key={ix}
                dot={false}
                strokeDasharray={strokeDasharrayWrap(ix%2===0)}
                dataKey={it}
                stroke={getRandomColor()}
              />
            })}
            
            
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    );
}

function strokeDasharrayWrap(isNoDash) {
    const n = isNoDash?0:parseInt(10 * Math.random())
    return `${n} ${n}`;
}
function getRandomColor(){
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
}