import React, {Component} from 'react'
import { formatDate } from './../lib/formatters'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import TimeAgo from 'react-timeago'

const rowStyle = {
	minHeight: '50px',
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
	display: 'inline-block'
}

const colStyle = {
		minWidth: '80px',
		display: 'inline-block',
		fontSize: '0.8em',
		padding: '0.5rem 1rem',
		verticalAlign: 'top'
}

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}

class Issue extends Component {
  static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		issue: PropTypes.object.isRequired,
		moveCard: PropTypes.func.isRequired,
	}

	render() {
	  const {
	    issue,
	    isDragging,
	    connectDragSource,
	    connectDropTarget,
	  } = this.props,
	  {
	    id,
	    title,
	    assignee,
	    created_at,
	    updated_at
	  } = issue

	  const opacity = isDragging ? 0 : 1

	  return connectDragSource(
	    connectDropTarget(
	      <div key={id} data-id={title} style={{ ...rowStyle, opacity }}>
	        <span style={colStyle}>{assignee && <img src={assignee.avatar_url} height="40" width="40" alt="No Avatar" />}
	        {!assignee && <span>No Assignee</span>}</span>
	        <span style={{  ...colStyle, 'minWidth': '380px', 'wordWrap': 'break-word' }}>{title}</span>
	        <span style={colStyle}>{formatDate(created_at)}</span>
					<TimeAgo style={colStyle} date={updated_at} />

	      </div>),
	  )
	}
}

Issue = DropTarget('card', cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(Issue)

Issue = DragSource('card', cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))(Issue)

export default Issue
