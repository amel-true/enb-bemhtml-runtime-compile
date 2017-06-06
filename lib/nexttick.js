var nextTick = (function() {
	var fns = [],
		enqueueFn = function(fn) {
			return fns.push(fn) === 1;
		},
		callFns = function() {
			var fnsToCall = fns, i = 0, len = fns.length;
			fns = [];
			while(i < len) {
				fnsToCall[i++]();
			}
		};

	if(window.setImmediate) { // ie10
		return function(fn) {
			enqueueFn(fn) && window.setImmediate(callFns);
		};
	}

	if(window.postMessage && !window.opera) { // modern browsers
		var isPostMessageAsync = true;
		if(window.attachEvent) {
			var checkAsync = function() {
				isPostMessageAsync = false;
			};
			window.attachEvent('onmessage', checkAsync);
			window.postMessage('__checkAsync', '*');
			window.detachEvent('onmessage', checkAsync);
		}

		if(isPostMessageAsync) {
			var msg = '__modules' + (+new Date()),
				onMessage = function(e) {
					if(e.data === msg) {
						e.stopPropagation && e.stopPropagation();
						callFns();
					}
				};

			window.addEventListener?
				window.addEventListener('message', onMessage, true) :
				window.attachEvent('onmessage', onMessage);

			return function(fn) {
				enqueueFn(fn) && window.postMessage(msg, '*');
			};
		}
	}

	return function(fn) { // old browsers
		enqueueFn(fn) && setTimeout(callFns, 0);
	};
})();