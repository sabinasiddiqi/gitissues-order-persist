import React, {Component} from 'react'
import { getIssues } from './../requests/api'
import Issue from './Issue'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import RaisedButton from 'material-ui/RaisedButton';

class IssuesList extends Component {
  constructor(props) {
    super(props)
    this.moveCard = this.moveCard.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.state = {
      error: null,
      issues: [],
      items: []
    }
  }
  async componentWillMount() {
    const { repo } = this.props
    let items = JSON.parse(window.sessionStorage.getItem(`items-${repo}`))
    if (items) {
      this.setState({ items })
      return
    }
    await this.getIssuesList(repo)
  }

  async componentWillReceiveProps(nextProps) {
    const { repo } = nextProps
    if (this.props.repo !== repo || !this.state.items) {
      let items = JSON.parse(window.sessionStorage.getItem(`items-${repo}`))
      if (items) {
        this.setState({ items })
        return
      }
      await this.getIssuesList(repo)
    }

  }

  async getIssuesList(repo) {
    try {
      const issues = await getIssues(repo)
      let items = []
      if (issues) {
        issues.forEach((issue, i) => {
          items.push({
            id: issue.id,
            title: issue.title,
            assignee: issue.assignee,
            created_at: issue.created_at,
            updated_at: issue.updated_at
          })
        })
        this.setState({ issues, items })
        window.sessionStorage.setItem(`items-${repo}`, JSON.stringify(items))
      }
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  moveCard(dragIndex, hoverIndex) {
		const { items } = this.state
    const { repo } = this.props
		const dragCard = items[dragIndex]

		this.setState(
			update(this.state, {
				items: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
			}),
      function () {
        window.sessionStorage.setItem(`items-${repo}`, JSON.stringify(this.state.items))
      }
		)
	}

  handleRefresh() {
    this.clearRepoIssuesOrder(this.getIssuesList.bind(this, this.props.repo))
  }

  clearRepoIssuesOrder(cb) {
    let i = sessionStorage.length
    while (i--) {
      if (sessionStorage.key(i).startsWith('items-')) {
        sessionStorage.removeItem(sessionStorage.key(i))
      }
    }
    this.setState({ items: null }, cb)
  }

  render() {
    const { repo } = this.props,
      { items } = this.state

    return (<div className={this.props.className}>
      { repo &&
        <div><ul>
          <h3>{repo}</h3>
          <RaisedButton onClick={this.handleRefresh} primary={true} label="Refresh Issues" />
            <div className="Container">
              { !items && <div>Loading...</div>}
              { items && items.length === 0 &&
                <div>There are no issues to display</div>
              }
              { items && items.length > 0 &&
                <div>
                {items.map((issue, index) => (
                  <Issue
                    key={issue.id}
                    id={issue.id}
                    index={index}
                    issue={issue}
                    moveCard={this.moveCard} />
                ))}
                <h6>{items.length} issues</h6>
                </div>
              }
            </div>
        </ul>
      </div>
      }
  </div>)
  }
}

IssuesList = DragDropContext(HTML5Backend)(IssuesList)
export default IssuesList
