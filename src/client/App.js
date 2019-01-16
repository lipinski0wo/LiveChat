import React, { Component } from 'react';

import LogReg from './LogReg';
import Panel from './Panel';
import { Base } from './Base';

export default class App extends Component {


  render() {

    return (
      <Base>
        <Panel />
        <LogReg />
      </Base>
    )
  }
}


