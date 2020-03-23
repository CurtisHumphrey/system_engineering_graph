import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

function AppHeader({ selected, onUnselect }) {
  let disabled = false
  if (!selected) {
    selected = 'n/a'
    disabled = true
  }
  return (
    <Root>
      <div>Selected: {selected}</div>
      <Button onClick={onUnselect} disabled={disabled}>
        Clear
      </Button>
    </Root>
  )
}

export default AppHeader

const Root = styled.div`
  display: flex;
  align-items: baseline;
  padding: 0 1rem;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`
