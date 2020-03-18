import React from 'react'
import './App.css'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'

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

const elements = [
  { data: { id: 'AWS EC2', type: 'system' }},
  { data: { id: 'AWS EFS', type: 'system' }},
  { data: { id: 'Kubernetes', type: 'system' }},
  { data: { id: 'GitHub', type: 'system' }},
  { data: { id: 'Mustache', type: 'system' }},

  { data: { id: 'Template', type: 'data' }},
  { data: { id: 'Source Code', type: 'data' }},
  { data: { id: 'Docker Image', type: 'data' }},

  { data: { id: 'more:Docker Image', type: 'more'}},
  { data: { source: 'more:Docker Image', target: 'Docker Image', label: 'builds' } },

  { data: { source: 'Kubernetes', target: 'AWS EC2', label: 'running' } },
  { data: { source: 'Mustache', target: 'Docker Image', label: 'builds' } },
  { data: { source: 'Kubernetes', target: 'Docker Image', label: 'read' } },
  { data: { source: 'Mustache', target: 'AWS EFS', label: 'write' } },
  { data: { source: 'AWS EFS', target: 'Mustache', label: 'read' } },
  { data: { source: 'Mustache', target: 'Template', label: 'write' } },
  { data: { source: 'Template', target: 'Mustache', label: 'read' } },
  { data: { source: 'Source Code', target: 'Mustache', label: 'build with' } },

  { data: { source: 'Source Code', target: 'GitHub', label: 'write' } },
  { data: { source: 'GitHub', target: 'Source Code', label: 'read' } },
];


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
