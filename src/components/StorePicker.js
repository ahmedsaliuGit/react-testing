import React from 'react';

import { getFunName } from '../helpers'

class StorePicker extends React.Component {

    gotoStore(event) {
        event.preventDefault();

        const storeId = this.storeInput.value;

        this.context.router.transitionTo(`/store/${storeId}`);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={ (e) => this.gotoStore(e) } >
                <h2>Please Enter A Store</h2>
                <input type="text" required placeholder="Store Name"
                    defaultValue={getFunName()}
                    ref={ (input) => this.storeInput = input}
                />
                <button type="submit">Visit Store &#8702;</button>
            </form>
        )
    }
}

StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;