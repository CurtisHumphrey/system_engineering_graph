// inspired by https://github.com/mermaid-js/mermaid


export default function parse_context_to_elements(require_context) {
  let matches = []
  require_context.keys().forEach((filename) => {
    const lines = require_context(filename).default.trim()
    matches = matches.concat(get_matches(filename, lines))
  })

  return matches_to_elements(matches)
}

//               ( 1      )     ( 2 )     (   3   ) ( 4      )     ( 5 )          (6 )
const pattern = /^([\w\d ]+)(?:\[(\w+)\])? (<--|-->) ([\w\d ]+)(?:\[(\w+)\])?(?: : (.+)$)/

function get_matches(filename, lines) {
  const each_line = lines.trim().split('\n')

  let match
  const matches = []
  each_line.forEach((line) => {
    match = pattern.exec(line.trim())
    if (match == null) {
      console.warn(`Unable to parse "${line}" in file ${filename}`)
    } else {
      matches.push(match)
    }
  })
  return matches
}

function convert_match (match) {
  const node_1 = {
    id: match[1],
  }
  if (match[2]) node_1.type = match[2]

  const node_2 = {
    id: match[4],
  }
  if (match[5]) node_2.type = match[5]

  const [source, target] = match[3] === '-->' ? [node_1.id, node_2.id] : [node_2.id, node_1.id]

  return {
    nodes: [node_1, node_2],
    connection: {source, target, label: match[6]}
  }
}

function matches_to_elements (matches) {
  const nodes_by_id = {}
  const elements = []
  matches.forEach((match) => {
    const {nodes, connection} = convert_match(match)

    nodes.forEach((node) => {
      nodes_by_id[node.id] = Object.assign({}, node, nodes_by_id[node.id])
    })

    elements.push({ data: connection})
  })

  Object.keys(nodes_by_id).forEach((id) => {
    elements.push({ data: nodes_by_id[id]})
  })

  return elements
}