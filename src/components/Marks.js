import React, {} from 'react'

const ShotMarker = ({show, made}) => {
  const displayMarks = (made, show) => {
    if(show === 'makes') {
      return made === 0 ? 'Transparent' : 'Green'
    } else if(show === 'misses') {
      return made === 0 ? 'Black' : 'Transparent'
    } else {
      return made === 0 ? 'Black' : 'Green'
    }
  }

  return <text fill={displayMarks(made, show)} fontFamily="Comic Sans MS">{made === 1 ? "O" : "X"}</text>
}
  
export const Marks = ({ xScale, yScale, player, xValue, yValue, show }) => {
    return player?.map((d, i) => (
      <svg>
        <g transform={`translate(${xScale(xValue(d))},${yScale(yValue(d))})`}>
          <ShotMarker made={d["made"]} show={show}/>
        </g>
      </svg>
    ));
  };