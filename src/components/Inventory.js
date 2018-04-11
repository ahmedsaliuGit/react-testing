import React, { Component } from 'react';

import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends Component {
    constructor() {
        super();

        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.authHandler = this.authHandler.bind(this);

        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount() {
        base.onAuth((user) => {
          if(user) {
            this.authHandler(null, { user });
          }
        });
    }

    authenticate(provider) {
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logout() {
        base.unauth();
        this.setState({ uid: null });
    }

    handleChange (e, key) {
        const fish = this.props.fishes[key];

        const updatedFish = {
            ...fish, 
            [e.target.name]: e.target.value
        }

        this.props.updateFish(key, updatedFish);
    }

    authHandler(err, authData)  {
        console.log(authData);
        if (err) {
            console.error(err);
            return;
        }

        // grab the store info
        const storeRef = base.database().ref(this.props.storeId);

        // query the firebase once for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            // claim it as our own if there is no owner already
            if(!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });

    }

    renderInventory(key) {
        const fish = this.props.fishes[key];

        return (
            <div className="fish-edit" key={key}>
                    
                <input name="name" value={fish.name}
                    type="text"
                    placeholder="Fish name"
                    onChange={(e) => this.handleChange(e, key)}    
                />
                <input name="price" value={fish.price} type="text" 
                    placeholder="Fish price"
                    onChange={(e) => this.handleChange(e, key)}
                />
                <select name="status" value={fish.status} 
                    placeholder="Fish Status"
                    onChange={(e) => this.handleChange(e, key)}
                >
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea name="desc" value={fish.desc} 
                    placeholder="Fish desc"
                    onChange={(e) => this.handleChange(e, key)}
                ></textarea>
                <input name="image" value={fish.image} type="text" 
                    placeholder="Fish image" 
                    onChange={(e) => this.handleChange(e, key)}
                />
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')} >Log In with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')} >Log In with Twitter</button>
            </nav>
        )
    }

    render () {
        const logout = <button onClick={this.logout}>Log Out!</button>;

        // check if they are no logged in at all
        if(!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        // Check if they are the owner of the current store
        if(this.state.uid !== this.state.owner) {
			return (
				<div>
				<p>Sorry you aren't the owner of this store!</p>
				{logout}
				</div>
			)
        }

        return (
            <div>
                <h3>Inventory</h3>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />

                <button type="button" onClick={this.props.loadSampleFishes}>Load Sample Fish</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
    loadSampleFishes: React.PropTypes.func.isRequired
}

export default Inventory;