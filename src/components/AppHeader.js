import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import _ from 'lodash'

function AppHeader({ selected, options, onChangeSelect }) {
  const value = _.find(options, ({ data: { id } }) => id === selected) || null
  return (
    <Root>
      <AutocompleteStyled
        options={options}
        value={value}
        getOptionLabel={(option) => option.data.id}
        renderInput={(params) => <TextField {...params} label="Selected System or Data" />}
        onChange={(event, value, reason) => onChangeSelect(_.get(value, 'data.id'))}
      />
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

const AutocompleteStyled = styled(Autocomplete)`
  width: 400px;
`
