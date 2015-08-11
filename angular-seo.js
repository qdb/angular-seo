!function(window, document, undefined) {
    var getModule = function(angular) {
        return angular.module('seo', [])
            .run([
                '$rootScope', '$animate',
                function($rootScope, $animate) {
                    if (typeof window.callPhantom == 'function') {
                        $animate.enabled(false);
                    }
                    $rootScope.htmlReady = function(data) {
                        data = data || {};
                        $rootScope.$evalAsync(function() { // fire after $digest
                            setTimeout(function() { // fire after DOM rendering
                                if (typeof window.callPhantom == 'function') { 
                                    window.callPhantom(data);
                                }
                            }, 0);
                        });
                    };
                }
            ]);
    };
    if (typeof define == 'function' && define.amd)
        define(['angular'], getModule);
    else
        getModule(angular);
}(window, document);
