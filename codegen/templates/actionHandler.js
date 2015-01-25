
Store.addActionHandler(constants.<%= constant %>, {
	
	getInitialState: function(){
		return {

		};
	},

	before: function(){
		this.setState(
			this.getInitialState()
		);
	},

	success: function(resp){

	},

	fail: function(resp){

	},

	after: function(){

	}

});