var React = require('react');
var userStore = require('./flux/stores/user');
var userActions = require('./flux/actions/user');

var Flux = require('../../');
var App = React.createClass({

	mixins: [
		userStore.mixinFor()
	],

	getStateFromStores: function(){
		console.log("App.getStateFromStores");
		return {
			user: userStore.getState()
		};
	},

	login: function(){
		var username = this.refs.username.getDOMNode().value;
		userActions.login(username, '1234567');
		return false;
	},

	logout: function(){
		userActions.logout();
		return false;
	},

	render: function(){
		if( !this.state.user.isAuth ){
			return this.renderLogin();
		}
		return this.renderHome();
	},

	renderHome: function(){
		return (
			<div>
			<h3>Hello {this.state.user.data.username}!</h3>
			<a href="#" onClick={this.logout}>Logout</a>
			</div>
		);
	},

	renderLogin: function(){
		if( this.state.user.isLoggingIn ){
			return(<div>Logging in...</div>);
		}
		return(
			<div>
				<h3>LOGIN</h3>
				Username: <input type="text" ref="username" /> <i>Leave empty to cause an error</i>
				<br />
				<button onClick={this.login}>Click to login</button>
				{this.renderLoginError()}
			</div>
		);
	},

	renderLoginError: function(){
		if( !this.state.user.error ){
			return;
		}
		return (<div style={{color: 'brown'}}>{this.state.user.error}</div>)
	}

});

window.onload = function(){
	React.renderComponent(<App />, document.getElementById('__wrap'));
};
