import React from 'react'
import styled from 'styled-components'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import _ from 'lodash'

import AppHeader from './AppHeader'
import CytoscapeGraph, { layout } from './CytoscapeGraph'
import parse_context_to_elements from '../graph_logic/parse_context_to_elements'

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
  const [selected_layers, set_selected_layers] = React.useState([])
  const [selected_depth, set_selected_depth] = React.useState(0)

  const history = useHistory()
  const { focus_id } = useParams()
  const { pathname } = useLocation()

  const selected = selected_layers[0] == null ? '' : selected_layers[0].id()

  React.useEffect(() => {
    const cy = cy_ref.current
    if (cy == null) return

    const depth =
      selected_depth >= selected_layers.length - 1 ? selected_layers.length - 1 : selected_depth

    const show = selected_layers.length === 0 ? cy.elements() : selected_layers[depth]

    cy.nodes().difference(show).style('display', 'none')
    show.style('display', 'element')
    show.layout(layout).run()
  }, [selected_layers, selected_depth])

  const change_location = React.useCallback(
    (id) => {
      const next = `/focus-on/${better_id(id)}`
      if (next === pathname) return
      history.push(next)
    },
    [pathname, history],
  )

  const compute_layers = React.useCallback(({ start_node }) => {
    let layers = [start_node]
    let remaining_elements = start_node.predecessors()

    while (remaining_elements.size() > 0) {
      const latest = _.last(layers)
      const next_layer = latest.incomers()
      layers.push(latest.add(next_layer))
      remaining_elements = remaining_elements.subtract(next_layer)
    }
    layers = layers.map((nodes, index) => {
      if (index === 0) return nodes
      return start_node.closedNeighborhood().add(nodes)
    })
    set_selected_layers(layers)
    set_selected_depth(layers.length - 1)
  }, [])

  const onUnselect = React.useCallback(() => {
    const cy = cy_ref.current
    cy.nodes().unselect()

    set_selected_layers([])
    set_selected_depth(0)
    history.push('/')
  }, [history])

  const onSelect = React.useCallback(
    (id) => {
      const cy = cy_ref.current
      const start_node = cy.getElementById(id)
      start_node.select()

      compute_layers({ start_node })
      change_location(id)
    },
    [compute_layers, change_location],
  )

  const onChangeSelect = React.useCallback(
    (id) => {
      if (id === selected) return
      if (id) {
        onSelect(id)
      } else {
        onUnselect(id)
      }
    },
    [selected, onSelect, onUnselect],
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
      <AppHeader
        onChangeSelect={onChangeSelect}
        selected={selected}
        options={nodes}
        maxDepth={selected_layers.length - 1}
        currentDepth={selected_depth}
        onChangeDepth={set_selected_depth}
      />
      <CytoscapeGraph elements={elements} onTapNode={onTapNode} onDrawCallback={on_cy_callback} />
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
