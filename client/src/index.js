import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './components/Landing';
import Chat from './components/Chat';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppRouter = () => (
	<BrowserRouter>
		<div>
		    <Switch>
			    <Route path="/" exact component={Landing}/>
                <Route path="/chat" component={Chat}/>
            </Switch>
		</div>
	</BrowserRouter>
);

ReactDOM.render(<AppRouter/>, document.getElementById('root'));
