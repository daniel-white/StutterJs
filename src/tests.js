
// General tests against core stutter functionality behavior
module("core");

test("Stutter should be assigned to the window object", 1, function(){
    ok(window.Stutter, "Stutter should be available on the window object");
});



// Testing callbacks occur as expected
module("callbacks", {
    setup: function(){
        this.callsToCancel = 0;
        this.callsToComplete = 0;
        this.callsToAlways = 0;
        this.stutter = new Stutter(200);        
    
        var moduleProxy = this;
        this.stutter
            .always(function(){moduleProxy.callsToAlways++;})
            .complete(function(){moduleProxy.callsToComplete++;})
            .cancel(function(){moduleProxy.callsToCancel++;});
    }
});
    
test("test always gets called if not interupted", 9, function(){ 
    var moduleProxy = this;
    
    equal(this.callsToAlways, 0, "No calls to always should have occurred");
    equal(this.callsToComplete, 0, "No calls to complete should have occurred");
    equal(this.callsToCancel, 0, "No calls to cancel should have occurred");
    
    stop();
    setTimeout(function() {
        equal(moduleProxy.callsToAlways, 1, "One call to always should have occurred");
        equal(moduleProxy.callsToCancel, 0, "No calls to cancel should have occurred");
        equal(moduleProxy.callsToComplete, 0, "No calls to complete should have occurred");
        start();
    }, 50);
    
    moduleProxy.stutter.set(function(){});
    
    stop();
    setTimeout(function() {
        equal(moduleProxy.callsToAlways, 1, "One call to always should have occurred");
        equal(moduleProxy.callsToCancel, 0, "No calls to cancel should have occurred");
        equal(moduleProxy.callsToComplete, 1, "One call to complete should have occurred");
        start();
    }, 250);
});

test("test cancel gets called if interupted", 9, function(){  
    var moduleProxy = this;
    
    equal(this.callsToAlways, 0, "No calls to always should have occurred");
    equal(this.callsToComplete, 0, "No calls to complete should have occurred");
    equal(this.callsToCancel, 0, "No calls to cancel should have occurred");
    
    stop();
    
    setTimeout(function() {
        equal(moduleProxy.callsToAlways, 1, "One call to always should have occurred");
        equal(moduleProxy.callsToCancel, 0, "No calls to cancel should have occurred");
        equal(moduleProxy.callsToComplete, 0, "No calls to complete should have occurred");
        start();
    }, 50);
    
    moduleProxy.stutter.set();
    
    setTimeout(function() {
        moduleProxy.stutter.set();
    }, 100);
    
    stop();
    setTimeout(function() {
        equal(moduleProxy.callsToAlways, 2, "Two calls to always should have occurred");
        equal(moduleProxy.callsToCancel, 1, "One to cancel should have occurred");
        equal(moduleProxy.callsToComplete, 1, "One call to complete should have occurred");
        start();
    }, 400);
});



// Testing data passed in or set initially gets passed as expected
module("data", {
    setup: function(){
        this.alwaysData;
        this.completeData;
        this.cancelData;
        this.initialData = "initial";
        this.data1 = "data1";
        this.data2 = "data2";
        this.stutter = new Stutter(200, undefined, undefined, this.initialData);
    
        var moduleProxy = this;
        this.stutter
            .always(function(sentData){moduleProxy.alwaysData = sentData;})
            .complete(function(sentData){moduleProxy.completeData = sentData;})
            .cancel(function(sentData){moduleProxy.cancelData = sentData;});
    }
});

asyncTest("data passed into set should be sent to callbacks", 4, function(){
    var moduleProxy = this;
    setTimeout(function() {
        deepEqual (moduleProxy.alwaysData, moduleProxy.data1, "Data passed to always should be the data passed to set");
        start();
    }, 50);
    
    moduleProxy.stutter.set(moduleProxy.data1);
    
    setTimeout(function() {
        moduleProxy.stutter.set(moduleProxy.data2);
    }, 100);
    
    stop();
    setTimeout(function() {
        deepEqual(moduleProxy.alwaysData, moduleProxy.data2, "Data passed to always should be the data passed to set");
        deepEqual(moduleProxy.cancelData, moduleProxy.data2, "Data passed to cancel should be the data passed to set");
        deepEqual(moduleProxy.completeData, moduleProxy.data2, "Data passed to complete should be the data passed to set");
        start();
    }, 400);
});

asyncTest("data passed in to constructor should be sent to callbacks if no data is passed to set", 4, function(){
    var moduleProxy = this;
    
    setTimeout(function() {
        deepEqual (moduleProxy.alwaysData, moduleProxy.initialData, "Initial data should be sent to always if no data is passed to set");
        start();
    }, 50);
    
    moduleProxy.stutter.set();
    
    setTimeout(function() {
        moduleProxy.stutter.set();
    }, 100);
    
    stop();
    setTimeout(function() {
        deepEqual(moduleProxy.alwaysData, moduleProxy.initialData, "Initial data should be sent to always if no data is passed to set");
        deepEqual(moduleProxy.cancelData, moduleProxy.initialData, "Initial data should be sent to cancel if no data is passed to set");
        deepEqual(moduleProxy.completeData, moduleProxy.initialData, "Initial data should be sent to complete if no data is passed to set");
        start();
    }, 400);
});

asyncTest("if a function is passed to the set function, the data it returns should be passed into callbacks", 4, function(){
    var moduleProxy = this;
    
    setTimeout(function() {
        deepEqual (moduleProxy.alwaysData, moduleProxy.data1, "Initial data should be sent to always if no data is passed to set");
        start();
    }, 50);
    
    moduleProxy.stutter.set(function(){return moduleProxy.data1;});
    
    setTimeout(function() {
        moduleProxy.stutter.set(function(){return moduleProxy.data2;});
    }, 100);
    
    stop();
    setTimeout(function() {
        deepEqual(moduleProxy.alwaysData, moduleProxy.data2, "Initial data should be sent to always if no data is passed to set");
        deepEqual(moduleProxy.cancelData, moduleProxy.data2, "Initial data should be sent to cancel if no data is passed to set");
        deepEqual(moduleProxy.completeData, moduleProxy.data2, "Initial data should be sent to complete if no data is passed to set");
        start();
    }, 400);
});


















