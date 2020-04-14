import React from 'react'
import styled from 'styled-components'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import _ from 'lodash'

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

const node_styles = {
  data: {
    background_color: 'hsl(117, 30%, 87%)',
    outline_color: 'hsl(98, 34%, 55%)',
    shape: 'ellipse',
  },
  'system/vender': {
    background_color: 'hsl(210, 85%, 92%)',
    outline_color: 'hsl(210, 39%, 59%)',
    shape: 'round-rectangle',
  },
  'system/process': {
    background_color: 'hsl(250, 85%, 92%)',
    outline_color: 'hsl(250, 39%, 59%)',
    shape: 'round-pentagon',
  },
  'system/custom': {
    background_color: 'hsl(300, 85%, 92%)',
    outline_color: 'hsl(300, 39%, 59%)',
    shape: 'round-hexagon',
  },
  default: {
    background_color: 'red',
    outline_color: 'red',
    shape: 'octagon',
  },
}

function get_style(node, attribute) {
  return _.defaultTo(node_styles[node.data('type')], node_styles.default)[attribute]
}

function background_color(node) {
  return get_style(node, 'background_color')
}

function outline_color(node) {
  return get_style(node, 'outline_color')
}

const stylesheet = [
  {
    selector: 'node',
    style: {
      label(node) {
        return node.data('id')
      },
      shape(node) {
        return get_style(node, 'shape')
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
