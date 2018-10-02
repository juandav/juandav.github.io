import React, { Component } from 'react'

export class Note extends Component {
  constructor (props) {
    try {
      super(props)
    } catch (error) {
      console.error(`Note ${error.message}`)
    }
  }
  render () {
    return (
      <span 
        className={"devicons devicons-" + this.props.icon} 
        title={this.props.title || ''} >
      </span>
    )
  }
}