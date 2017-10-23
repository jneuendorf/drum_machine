
export class Modal extends React.Component {
    render() {
        const {children} = this.props
        return (
            <div className="modal">
                <div className="modal-background" />
                <div className="modal-content">
                    {children}
                </div>
                <button className="modal-close is-large" aria-label="close" />
            </div>
        )
    }
}
