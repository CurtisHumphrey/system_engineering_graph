import React from 'react'
import styled from 'styled-components'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'

import AppHeader from './components/AppHeader'

import parse_context_to_elements from './graph_logic/parse_context_to_elements'

cytoscape.use(cola)

const layout = { name: 'cola', nodeDimensionsIncludeLabels: true, animate: true }

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

const all_graph_data = require.context('!raw-loader!./graph_data', false, /.*\.txt/)

const elements = parse_context_to_elements(all_graph_data)

function App() {
  const cy_ref = React.useRef(null)
  const [selected_name, set_selected] = React.useState('')

  const onUnselect = React.useCallback(() => {
    const cy = cy_ref.current
    cy.elements().style('display', 'element')
    cy.elements().layout(layout).run()
  }, [])

  const onTapNode = React.useCallback((event) => {
    const cy = cy_ref.current
    const node = event.target
    set_selected(node.id())

    let subgraph = node.closedNeighborhood()
    subgraph = subgraph.merge(node.predecessors())
    cy.nodes().difference(subgraph).style('display', 'none')
    subgraph.style('display', 'element')
    subgraph.layout(layout).run()
  }, [])

  return (
    <Root>
      <AppHeader onUnselect={onUnselect} selected={selected_name} />
      <GraphCell>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <CytoscapeComponent
            elements={elements}
            stylesheet={stylesheet}
            layout={layout}
            style={{ width: '100%', height: '100%' }}
            cy={(cy) => {
              cy_ref.current = cy
              cy.on('tap', 'node', onTapNode)
            }}
          />
        </div>
      </GraphCell>
    </Root>
  )
}

export default App

const Root = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`

const GraphCell = styled.div`
  position: relative;
  flex-grow: 1;
`
