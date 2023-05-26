import * as React from "react";
import * as ReactDOM from "react-dom";
import {PlayerShotChart} from './nbaShotChart'

const allDimensions = (dimensions) => {
  if(dimensions.length > 0) {
    const fields = dimensions.map((d)=> d.name)
    return fields
  }
  return []
}

const vis = {
  id: 'hello_world_tsx', // id/label not required, but nice for testing and keeping manifests in sync
  label: 'Hello World (TSX)',
  options: {
    title: {
      type: 'string', // string, number, boolean, array
      label: 'Title',
      display: 'text', // type = string: (text, select, radio) || type = number: (number, range) || type = array: (text, color, colors)
      placeholder: 'Title',
      section: 'Settings',
      order: 1,
      display_size: 'normal', // normal, half, third
    },
    showSummary: {
      type:"string",
      label:"Show Shot Summary",
      display:"radio",
      section: 'Settings',
      required: true,
      order: 2,
      values:[{
        Yes: 'yes',
      },{
        No: 'no'
      }],
      label:"Show Shooting Percentage Summary (yes or no)"
    },
    toggleShots: {
      type:"string",
      label:"Toggle Shots",
      display:"radio",
      section: 'Settings',
      required: true,
      order: 3,
      values:[{
        Yes: 'yes',
      },{
        No: 'no'
      }],
      label:"Toggle Shot Display (yes or no)"
    }
  },

  create(element, config){

    let container = element.appendChild(document.createElement("div"));
    container.className = "vis";

    this.chart = ReactDOM.render(
    <PlayerShotChart queryData={[]}/>, element)
  },


  updateAsync(data, element, config, queryResponse, details, done) {
    // Clear any errors from previous updates
    this.clearErrors();

    // check for correct query setup
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({
        title: "No Dimensions", 
        message: `
        This chart requires at least 2 dimensions and specifically requires these two: 
        Shot Coords & Shot Details 
        `
      });
      return;
    }

    if (!'shot_coords' in(allDimensions(queryResponse.fields.dimensions)) & !'shot_details' in(allDimensions(queryResponse.fields.dimensions))) {
      this.addError({
        title: "Incorrect Dimensions Used", 
        message: `
        The nba shot chart requires at least 2 dimensions: 
        Shot Coords & Shot Details 
        `
      });
      return;
    }

    // toggle shot display
    const shotDisplayToggle = Array.from(document.getElementsByClassName("shotToggle"))
    shotDisplayToggle.map(d => {
      console.log(config.toggleShots)
      d.style.opacity = config.toggleShots === 'yes' ? '0' : '1'
      console.log(d.style)
    })
  
    this.chart = ReactDOM.render(<PlayerShotChart response={queryResponse.sql_changed} queryData={data}/>, element)

    done();
  }
}


looker.plugins.visualizations.add(vis)