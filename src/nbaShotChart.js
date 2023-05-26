import { scaleLinear } from "d3-scale";
import React, { useEffect, useState,memo, useMemo } from 'react'
import {Court} from './components/Court'
import {Marks} from './components/Marks'

const usableWidth = 500;
const height = (usableWidth / 50) * 47;
const margins = 0;
const xValue = (d) => d.x;
const yValue = (d) => d.y;

export const PlayerShotChart = memo(({queryData, response, element}) => {
  const [courtData, setCourtData] = useState([])
  const [fgp, setFgp] = useState()
  
  const genRandomShot = () => {
    return {
      x: Math.random() > 0.5 ? Math.random() * - 200 : Math.random() * 100,
      y: Math.random() > 0.5 ? Math.random() * 150: Math.random() * -20,
      made: 0
    }
  }

  const extractShotCoords = (data) => {
    const shootCoords = []
    data.map((game) => {
      game['shot_chart.shot_coords'] 
        && shootCoords.push(...JSON.parse(game['shot_chart.shot_coords']['value']))
    })
    return shootCoords
  }

  const extractMisses = (data) => {
    let misses = 0
    data.map((game) => {
      console.log(JSON.parse(game['shot_chart.shot_coords']['value']))
      if(game['player_stats.shot_details'] && JSON.parse(game['shot_chart.shot_coords']['value']).length > 0) {
        misses = misses += JSON.parse(game['player_stats.shot_details']['value'])['misses']
      }
    })
    return [...Array(misses).keys()].map(() => genRandomShot())
  }

  useEffect(() => {
    // if(response) {
      const shootingChartData = extractShotCoords(queryData)
      const misses = extractMisses(queryData)
  
      if(queryData.length > 0) {
        setCourtData([
          ...shootingChartData,
          ...misses
        ])

        console.log(shootingChartData.length, misses.length)
        setFgp((100.0 * (shootingChartData.length 
          / (shootingChartData.length + misses.length)
        )).toFixed(0))
      }
    // }
    // ,response
  },[queryData])
  
    return (
      <>
          <div style={{display: "flex", direction: "row", justifyContent: "center", width: '92%', height:'100%'}}>
          <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', width:'100%'}}>
          <App data={courtData} fgp={fgp}/>
          </div>
          </div>
      </>
    )
})

function App({data, fgp}) {

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([-250, 250])
        .range([0, usableWidth - margins * 2]),
    []
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([-52, 418])
        .range([0, height - margins * 2]),
    []
  );

  return (
        <>
        <ShotCharts
          shot="marks"
          player={data}
          usableWidth={usableWidth}
          height={height}
          xScale={xScale}
          xValue={xValue}
          yScale={yScale}
          yValue={yValue}
          margins={margins}
          fgp={fgp}
        />
        </>
  );
}

const ShotCharts = memo(
  ({
    shot,
    usableWidth,
    height,
    player,
    xScale,
    yScale,
    xValue,
    yValue,
    margins,
    fgp
  }) => {
    console.log(`rendered: ShotCharts`, fgp);
    const [show, setShow] = useState('')
    return (
      <svg
        className="col-start-2 col-span-8"
        viewBox={`0 0 ${usableWidth * 0.88} ${500}`}
        style={{ fill: "none" }}
      >
        <g>
          <Court usableWidth={usableWidth} height={height} comp={shot} />
          {player.length > 0 & player !== undefined &&
            <>
          <Marks
            xValue={xValue}
            xScale={xScale}
            yValue={yValue}
            yScale={yScale}
            player={player}
            show={show}
          />
          </>
          }
        </g>
        <g
          className={`${shot === "Heatmap" ? `hidden` : null}`}
          transform={`translate(0, 471)`}
        >
          {shot === "Heatmap" ? null : (
            <>
            <rect
              id="shotToggle"
              x="0"
              y="10"
              width={usableWidth}
              height={90}
            />
            <text className="shotToggle" x="150" y="20" font-family="Verdana" font-size="18" fill="Green" onClick={() => show === 'makes' ? setShow(''): setShow('makes')}>Makes (O)</text>
            <text className="shotToggle" x="280" y="20" font-family="Verdana" font-size="18" fill="Black" onClick={() => show === 'misses' ? setShow('') : setShow('misses')}>Misses (X)</text>
            </>
          )}
        </g>
        {fgp !== undefined &&
        <g>
        <text x="335" y="450" font-size="36" fill-opacity="0.25" fill="black" fontWeight={100}>FGP: {fgp}%</text>
        </g>
        }
      </svg>
    );
  }
);