var _forEach = require('lodash-node/modern/collections/forEach');


module.exports = function(){
	var stores = Array.prototype.slice.call(arguments);
	if( !stores.length ){
		throw new Error('Flux.mixin expects a store or a list of stores');
	}
	_forEach(stores, function(store){
		var isNotOk = (
			typeof store === 'undefined' || typeof store.onChange !== 'function' || typeof store.offChange !== 'function'
		);
		if( isNotOk ){
			throw new Error('Flux.mixin expects a store or an array of stores');
		}
	});


	return {
		
		componentWillMount: function(){
			if( typeof this._react_flux_onChange == "undefined" ){
				this._react_flux_onChange = function() {
					if( !this.isMounted() ){
						return;
					}
					this.setState( this.getStateFromStores() );
				}.bind(this);
			}
			this.setState( this.getStateFromStores() );
		},

		componentDidMount: function(){
			for(var i=0; i < stores.length; i++){
				if( typeof stores[i].onChange != 'function' ){
					throw new Error('Mixin expects stores');
				}
				stores[i].onChange(this._react_flux_onChange);
			}
		},
		
		componentWillUnmount: function(){
			for(var i=0; i < stores.length; i++){
				stores[i].offChange(this._react_flux_onChange);
			}
		}
	};

};