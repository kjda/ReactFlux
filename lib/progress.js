var Store = require('./store');

var Progress = function (dispatcher) {
  return new Store(dispatcher, {
    _trackProgressFor: function ( constant ) {
      this.state.set(constant, true);

      this.addActionHandler(constant, {
        getInitialState: function () {
          return {
            isInProgress: false
          };
        },
        before: function () {
          this.setState({ isInProgress: true });
          this.emit('CHANGE$' + constant);
        },
        after: function () {
          this.setState({ isInProgress: false });
          this.emit('CHANGE$' + constant);
        }
      });
    },

    _isTrackingProgress: function ( constant ) {
      return !!this.get(constant);
    },

    of: function ( constant ) {
      if (!this._isTrackingProgress(constant)) {
        this._trackProgressFor(constant);
      }
      return this.getActionState(constant, 'isInProgress');
    },

    mixinFor: function ( constants ) {
      var self = this;
      return {
        componentWillMount: function () {
          if (typeof this._react_flux_onChange == "undefined") {
            this._react_flux_onChange = function () {
              if (!this.isMounted()) {
                return;
              }
              this.setState(this.getStateFromStores());
            }.bind(this);
          }
          this.setState(this.getStateFromStores());
        },

        componentDidMount: function () {
          for (var i = 0; i < constants.length; i++) {
            self[i].on('CHANGE$' + constant, this._react_flux_onChange);
          }
        },

        componentWillUnmount: function () {
          for (var i = 0; i < constants.length; i++) {
            self[i].off('CHANGE$' + constant, this._react_flux_onChange);
          }
        }
      }
    }
  });
};

module.exports = Progress;
