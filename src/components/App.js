import React from 'react'
import styled from 'styled-components'
import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import { useHistory, useParams } from 'react-router-dom'

import AppHeader from './AppHeader'

import parse_context_to_elements from '../graph_logic/parse_context_to_elements'

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

const all_graph_data = require.context('!raw-loader!../graph_data', true, /.*\.txt/)

const { nodes, elements } = parse_context_to_elements(all_graph_data)

function better_id(id) {
  id = id.replace(/-/g, '~')
  return id.replace(/ /g, '-')
}
function reverse_better_id(slug) {
  if (!slug) return ''
  slug = slug.replace(/~/g, '-')
  return slug.replace(/-/g, ' ')
}

function App() {
  const cy_ref = React.useRef(null)
  const [cy_is_set, set_cy_is_set] = React.useState(false)
  const [selected_name, set_selected] = React.useState('')
  const history = useHistory()
  const { focus_id } = useParams()

  const onUnselect = React.useCallback(() => {
    const cy = cy_ref.current
    set_selected('')
    history.push('/')

    cy.elements().style('display', 'element')
    cy.elements().layout(layout).run()
  }, [history])

  const onSelect = React.useCallback(
    (id) => {
      const cy = cy_ref.current
      const node = cy.getElementById(id)
      set_selected(id)
      history.push(`/focus-on/${better_id(id)}`)

      let subgraph = node.closedNeighborhood()
      subgraph = subgraph.merge(node.predecessors())
      cy.nodes().difference(subgraph).style('display', 'none')
      subgraph.style('display', 'element')
      subgraph.layout(layout).run()
    },
    [history],
  )

  const onChangeSelect = React.useCallback(
    (id) => {
      if (id === selected_name) return
      if (id) {
        onSelect(id)
      } else {
        onUnselect(id)
      }
    },
    [selected_name, onSelect, onUnselect],
  )

  React.useEffect(() => {
    if (!cy_is_set) return
    const id = reverse_better_id(focus_id)
    onChangeSelect(id)
  }, [cy_is_set, focus_id, onChangeSelect])

  const onTapNode = React.useCallback(
    (event) => {
      const node = event.target
      onSelect(node.id())
    },
    [onSelect],
  )

  const on_cy_callback = React.useCallback(
    (cy) => {
      cy_ref.current = cy
      set_cy_is_set(true)
      cy.removeAllListeners()
      cy.on('tap', 'node', onTapNode)
    },
    [onTapNode],
  )

  return (
    <Root>
      <AppHeader onChangeSelect={onChangeSelect} selected={selected_name} options={nodes} />
      <GraphCell>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <CytoscapeComponent
            elements={elements}
            stylesheet={stylesheet}
            layout={layout}
            style={{ width: '100%', height: '100%' }}
            cy={on_cy_callback}
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
