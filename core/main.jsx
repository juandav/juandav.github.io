import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Content } from './components/content.component.jsx'

export class Main extends Component {
  constructor (props) {
    try {
      super(props)
    } catch (error) {
      console.error(`Main ${error.message}`)
    }
  }
  render () {
    return ( <Content /> )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))