import React from 'react';
import '../index.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Autocomplete
        id="combo-box-demo"
        options={this.props.options}
        onChange={this.props.handleQueryChange}
        onInputChange={this.props.handleInputChange}
        getOptionLabel={(option) => option}
        style={{ width: 350 }}
        value={this.props.value}
        inputValue={this.props.inputValue}
        renderInput={(params) => <TextField {...params} onChange={this.props.getNewOptions}
          label={this.props.labelText} variant="outlined" style={{ backgroundColor: "white" }} />}
      />
    );
  }
}
