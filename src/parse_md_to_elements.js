// inspired by https://github.com/mermaid-js/mermaid

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

export default function parse_md_to_elements (mermaidish_string) {
    console.log(mermaidish_string)
    let match
    const matches = []
    while ((match = pattern.exec(mermaidish_string.trim())) !== null) {
        matches.push(convert_match(match))
    }
    const nodes_by_id = {}
    const elements = []
    matches.forEach(({nodes, connection}) => {
        nodes_by_id[nodes[0].id] = {
            ...nodes[0],
            ...(nodes_by_id[nodes[0].id] || {}),
        }
        nodes_by_id[nodes[1].id] = {
            ...nodes[1],
            ...(nodes_by_id[nodes[1].id] || {}),
        }
        elements.push({ data: connection})
    })

    Object.keys(nodes_by_id).forEach((id) => {
        elements.push({ data: nodes_by_id[id]})
    })
    console.log(elements)
    return elements
}