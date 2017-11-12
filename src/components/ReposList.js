import React, { Component } from 'react'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'
import IssuesList from './IssuesList'

import { getRepos } from './../requests/api'
import './ReposList.css'

class ReposList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      repos: [],
      selected: null
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(name) {
    this.setState({ selected: name })
  }
  async componentDidMount() {
    await this.getReposList()
  }

  async getReposList() {
    try {
      const repos = await getRepos()
      this.setState({ repos })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const {
      repos,
      selected
    } = this.state

    return (<div className="ReposList">
      <h2>Repositories</h2>
      {repos && <List selectable ripple className="Left">
          {/* <ListSubHeader caption='Repositories' className="ListHeader"/> */}
          {
            repos.map((r) => {
              let selectedClass = r.name === selected ? " selected" : "",
                className=`RepoListItem${selectedClass}`;
                console.log(className)
              return (  <ListItem
                  selectable
                  key={r.name}
                  caption={r.name}
                  onClick={this.handleClick.bind(this, r.name)}
                  className={className}
                />)
            })
          }
      </List>}
      {selected &&
        <IssuesList repo={selected} className="Right"></IssuesList>}
    </div>
    )
  }
}

export default ReposList
