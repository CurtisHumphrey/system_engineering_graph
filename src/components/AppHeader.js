import React from 'react'
import styled from 'styled-components'

function AppHeader({ selected, onUnselect }) {
  if (!selected) selected = 'n/a'
  return (
    <Root>
      <div>Selected: {selected}</div>
      <button onClick={onUnselect}>Clear</button>
    </Root>
  )
}

export default AppHeader

const Root = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`
