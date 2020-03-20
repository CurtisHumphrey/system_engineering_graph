import React from 'react'
import './App.css'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import parse_md_to_elements from './parse_md_to_elements'

cytoscape.use( cola )

const layout = { name: 'cola', nodeDimensionsIncludeLabels: true }

function background_color (node) {
  switch(node.data('type')) {
    case 'data': return '#D5E8D4'
    case 'system': return '#DAE8FC'
    case 'more': return '#EEE'
    default: return 'red'
  }
}

function outline_color (node) {
  switch(node.data('type')) {
    case 'data': return '#82B366'
    case 'system': return '#6C8EBF'
    case 'more': return '#999'
    default: return 'red'
  }
}

const stylesheet = [
  {
    selector: 'node',
    style: {
      label(node) {
        switch(node.data('type')) {
          case 'more': return '+'
          default: return node.data('id')
        }
      },
      shape (node) {
        switch(node.data('type')) {
          case 'data': return 'round-hexagon'
          case 'system': return 'round-rectangle'
          case 'more': return 'circle'
          default: return 'octagon'
        }
      },
      'text-valign': 'center',
      'color': 'white',
      'text-outline-width': 2,
      'border-width': 2,
      'font-size': 10,
      'text-outline-color': outline_color,
      'background-color': background_color,
      'border-color': outline_color,
    },
  },
  {
    selector: 'edge',
    style: {
      label: "data(label)",
      width: 4,
      'font-size': 10,
      'color': 'white',
      'text-outline-width': 1,
      'text-outline-color': '#555',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#999',
      'line-color': '#999',
      'curve-style': 'bezier',
      'target-endpoint': 'outside-to-node-or-label',
    },
  },
]

const all_graph_data = require.context('!raw-loader!./graph_data', false, /.*\.txt/)

let raw_text = ''
all_graph_data.keys().forEach((key) => {
  const file = all_graph_data(key).default.trim()
  raw_text += '\n' + file
})

const elements = parse_md_to_elements(raw_text)

function App() {
  return (
    <div>
      <div style={ { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } }>
        <CytoscapeComponent elements={elements} stylesheet={stylesheet} layout={layout} style={ { width: '100%', height: '100%' } } />
      </div>
    </div>
  )
}

export default App;
