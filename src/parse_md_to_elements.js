// inspired by https://github.com/mermaid-js/mermaid

//               ( 1      )     ( 2 )     (   3   ) ( 4      )     ( 5 )          (6 )
const pattern = /([\w\d ]+)(?:\[(\w+)\])? (<--|-->) ([\w\d ]+)(?:\[(\w+)\])?(?: : (.+)$)/gm

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

function matchAll(pattern, input) {
  let match
  const matches = []
  while ((match = pattern.exec(input.trim())) !== null) {
    matches.push(match)
  }
  return matches
}

export default function parse_md_to_elements (mermaidish_string) {
  const matches = matchAll(pattern, mermaidish_string)

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