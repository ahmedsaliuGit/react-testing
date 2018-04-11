import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import './css/style.css';

import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';

import registerServiceWorker from './registerServiceWorker';

const Root = () => {
    return (
        <BrowserRouter>
            <div>
                <Match exactly pattern="/" component={StorePicker} />
                <Match pattern="/store/:storeId" component={ App } />

                <Miss component={NotFound} />
            </div>
        </BrowserRouter>
    )
}

ReactDOM.render(<Root />, document.getElementById('main'));

registerServiceWorker();
