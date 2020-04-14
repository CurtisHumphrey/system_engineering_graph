import React from 'react'
import styled from 'styled-components'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'

import fcose from 'cytoscape-fcose'

cytoscape.use(fcose)

export const layout = {
  name: 'fcose',
  quality: 'proof',
  nodeDimensionsIncludeLabels: true,
  animate: true,
  idealEdgeLength: 80,
  nodeRepulsion: 90000,
}

function background_color(node) {
  switch (node.data('type')) {
    case 'data':
      return '#D5E8D4'
    case 'system':
      return '#DAE8FC'
    case 'more':
      return '#EEE'
    default:
      return 'red'
  }
}

function outline_color(node) {
  switch (node.data('type')) {
    case 'data':
      return '#82B366'
    case 'system':
      return '#6C8EBF'
    case 'more':
      return '#999'
    default:
      return 'red'
  }
}

const stylesheet = [
  {
    selector: 'node',
    style: {
      label(node) {
        switch (node.data('type')) {
          case 'more':
            return '+'
          default:
            return node.data('id')
        }
      },
      shape(node) {
        switch (node.data('type')) {
          case 'data':
            return 'round-hexagon'
          case 'system':
            return 'round-rectangle'
          case 'more':
            return 'circle'
          default:
            return 'octagon'
        }
      },
      'text-valign': 'center',
      color: 'white',
      'text-outline-width': 2,
      'border-width': 2,
      'font-size': 10,
      'text-outline-color': outline_color,
      'background-color': background_color,
      'border-color': outline_color,
      width: 30,
      height: 30,
    },
  },
  {
    selector: 'node:selected',
    style: {
      'font-size': 15,
      width: 50,
      height: 50,
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(label)',
      width: 4,
      'font-size': 10,
      color: 'white',
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

function CytoscapeGraph({ elements, onTapNode, onDrawCallback, ...pass }) {
  const on_cy_callback = React.useCallback(
    (cy) => {
      onDrawCallback(cy)
      cy.removeAllListeners()
      cy.on('tap', 'node', onTapNode)
    },
    [onDrawCallback, onTapNode],
  )

  return (
    <Root {...pass}>
      <BigSize>
        <CytoscapeComponent
          elements={elements}
          stylesheet={stylesheet}
          layout={layout}
          style={{ width: '100%', height: '100%' }}
          cy={on_cy_callback}
        />
      </BigSize>
    </Root>
  )
}

export default CytoscapeGraph

const BigSize = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Root = styled.div`
  position: relative;
  flex-grow: 1;
`
