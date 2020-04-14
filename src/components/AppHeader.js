import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import _ from 'lodash'

function AppHeader({ selected, options, onChangeSelect, onChangeDepth, maxDepth, currentDepth }) {
  const value = _.find(options, ({ data: { id } }) => id === selected) || null

  const handleSliderChange = React.useCallback(
    (event, newValue) => {
      onChangeDepth(newValue)
    },
    [onChangeDepth],
  )

  return (
    <Root>
      <AutocompleteStyled
        options={options}
        value={value}
        getOptionLabel={(option) => option.data.id}
        renderInput={(params) => <TextField {...params} label="Selected System or Data" />}
        onChange={(event, value, reason) => onChangeSelect(_.get(value, 'data.id'))}
      />
      <Typography>Graph Depth</Typography>
      <StyledSlider
        step={1}
        marks
        min={1}
        max={Math.max(1, maxDepth)}
        value={currentDepth}
        disabled={maxDepth <= 0}
        onChange={handleSliderChange}
      />
    </Root>
  )
}

export default AppHeader

const Root = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`

const AutocompleteStyled = styled(Autocomplete)`
  width: 400px;
`
const StyledSlider = styled(Slider)`
  max-width: 200px;
`
