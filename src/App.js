import React from 'react'
import './App.css'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'

cytoscape.use( fcose )

const layout = { name: 'fcose' }

const stylesheet = [
  {
    selector: 'edge',
    style: {
      width: 4,
      'target-arrow-shape': 'triangle',
      'line-color': '#9dbaea',
      'target-arrow-color': '#9dbaea',
      'curve-style': 'bezier',
    },
  },
]

const elements = [
  { data: { id: 'one', label: 'Node 1' }},
  { data: { id: 'two', label: 'Node 2' }},
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];


function App() {
  return (
    <div>
      <div style={ { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } }>
        <CytoscapeComponent elements={elements} layout={layout} style={ { width: '100%', height: '100%' } } />
      </div>
    </div>
  )
}

export default App;
