import React, {Component} from 'react';

class Counter extends Component {
    state ={
        count: 0
    };

    handleClick = () => {
        this.setState({count: this.state.count + 1});
    };

    render() {
        return (
            <React.Fragment>
                <span>{this.state.count}</span>
                <button onClick={this.handleClick}>Click</button>
            </React.Fragment>
        );
    }
}

export default Counter;