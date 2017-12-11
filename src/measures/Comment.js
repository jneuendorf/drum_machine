import React from 'react'


export class Comment extends React.Component {
    render() {
        const {comment} = this.props
        return (
            <div className="comment">
                {comment}
            </div>
        )
    }
}

export default Comment
