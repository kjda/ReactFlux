module.exports = function(stores){

	return {
		
		componentDidMount: function(){
			for(var i=0; i < stores.length; i++){
				stores[i].onChange( this._reactFluxOnChange )
			}
		},
		
		componentWillUnount: function(){
			for(var i=0; i < stores.length; i++){
				stores[i].offChange( this._reactFluxOnChange )
			}
		},

		_reactFluxOnChange: function() {
			this.setState( this.getStateFromStores() );
		}
	};

};