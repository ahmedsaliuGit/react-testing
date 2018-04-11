import React, { Component } from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import loadSamples from '../sample-fishes';
import base from '../base';

class App extends Component {

    constructor() {
        super();

        this.addFish = this.addFish.bind(this);
        this.loadSampleFishes = this.loadSampleFishes.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.removeOrder = this.removeOrder.bind(this);

        // getInitialize
        this.state = {
            fishes: {},
            order: {}
        }
    }

    componentWillMount() {
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
        {
            context: this,
            state: 'fishes'
        })

        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if (localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`,
            JSON.stringify(nextState.order));
    }

    addFish(fish) {
        const fishes = {...this.state.fishes};

        const timestamp = Date.now();

        fishes[`fish-${timestamp}`] = fish;

        this.setState({ fishes });
    }

    loadSampleFishes() {
        this.setState({
            fishes: loadSamples,
        });
    }

    addToOrder(key) {
        // take a copy of the state
        const order = {...this.state.order};
        // update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1;
        // update our state
        this.setState({ order });
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};

        fishes[key] = updatedFish;

        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};

        fishes[key] = null;

        this.setState({ fishes });
    }

    removeOrder(key) {
        const order = {...this.state.order};

        delete order[key];

        this.setState({ order });
    }

    render () {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                                .map( key => <Fish key={key} 
                                    details={this.state.fishes[key] } 
                                    index={key}
                                    addToOrder={this.addToOrder}
                                />)
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order}
                    params={this.props.params}
                    removeOrder={this.removeOrder}
                />
                <Inventory
                    addFish={this.addFish}
                    loadSampleFishes={this.loadSampleFishes}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    storeId={this.props.params.storeId}
                />
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;