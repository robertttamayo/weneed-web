"use strict";
function Color(_r, _g, _b, _a) {

	var rr = _r;
	var gg = _g;
	var bb = _b;
	var aa = _a;

    var _setAs = function(color) {
		// console.log('setting as');
		// console.log(color);
        rr = color.r;
        gg = color.g;
        bb = color.b;
		aa = color.a;
		// console.log(rr, gg, bb, aa);
	}
	return {
		get r() {
			return rr;
		},
		set r(_r){
			rr = _r;
		},
		get g() {
			return gg;
		},
		set g(_g){
			gg = _g;
		},
		get b() {
			return bb;
		},
		set b(_b){
			bb = _b;
		},
		get a() {
			return rr;
		},
		set a(_a){
			aa = _a;
		},
		setAs: _setAs
	}
}
function TriColorChanger(_c1, _c2, _c3) {	

	// c1 = new Color();
	// c2 = new Color();
	// c3 = new Color();
	// t1 = new Color();
	// t2 = new Color();
	// t3 = new Color();
	// i1 = new Color();
	// i2 = new Color();
	// i3 = new Color();
	var d1 = new Color(1, 1, 1, 1);
	var d2 = new Color(1, 1, 1, 1);
	var d3 = new Color(1, 1, 1, 1);
	var c1 = new Color(_c1.r, _c1.g, _c1.b, _c1.a);
	var c2 = new Color(_c2.r, _c2.g, _c2.b, _c2.a);
	var c3 = new Color(_c3.r, _c3.g, _c3.b, _c3.a);
	var s1, s2, s3;

	var changeTime = 4;
	var stateTime = 0;
	var change = false;
	
	// c1.setAs(_c1);
	// c2.setAs(_c2);
	// c3.setAs(_c3);

	// console.log('c1.r: ' + c1.r);
	// console.log('_c1.r: ' + _c1.r);
	// c1 = new Color(c1.r, c1.g, c1.b, c1.a);
	// c2 = new Color(c2.r, c2.g, c2.b, c2.a);
	// c3 = new Color(c3.r, c3.g, c3.b, c3.a);
	
	var i1 = new Color(c1.r, c1.g, c1.b, 1);
	var i2 = new Color(c2.r, c2.g, c2.b, 1);
	var i3 = new Color(c3.r, c3.g, c3.b, 1);
	
	var t1 = new Color(c2.r, c2.g, c2.b, 1);
	var t2 = new Color(c3.r, c3.g, c3.b, 1);
	var t3 = new Color(c1.r, c1.g, c1.b, 1);
	
	d1.r = t1.r - i1.r;
	d1.g = t1.g - i1.g;
	d1.b = t1.b - i1.b;
	
	d2.r = t2.r - i2.r;
	d2.g = t2.g - i2.g;
	d2.b = t2.b - i2.b;
	
	d3.r = t3.r - i3.r;
	d3.g = t3.g - i3.g;
	d3.b = t3.b - i3.b;

	// console.log(c1);
	// console.log(c2);
	// console.log(c3);
    
	
	var resetColors = function(__c1, __c2, __c3){
		c1.setAs(__c1);
		c2.setAs(__c2);
		c3.setAs(__c3);
		
		i1.setAs(__c1);
		i2.setAs(__c2);
		i3.setAs(__c3);
		
		t1.setAs(__c2);
		t2.setAs(__c3);
		t3.setAs(__c1);
		
		init();
	}
	var init = function(){
		d1.r = t1.r - i1.r;
		d1.g = t1.g - i1.g;
		d1.b = t1.b - i1.b;
		
		d2.r = t2.r - i2.r;
		d2.g = t2.g - i2.g;
		d2.b = t2.b - i2.b;
		
		d3.r = t3.r - i3.r;
		d3.g = t3.g - i3.g;
		d3.b = t3.b - i3.b;
		// console.log('t1', t1.r, t1.g, t1.b);
		// console.log('i1', i1.r, i1.g, i1.b);
		// console.log('d1', d1.r, d1.g, d1.b);
	}

	var _update = function(delta){
		// console.log(delta);
		stateTime += delta;
		
		if (stateTime > changeTime) {
			stateTime = changeTime;
			change = true;
		}
		// console.log(stateTime);
		// console.log(d1.r);
		// console.log(i1.r);
		// console.log(stateTime/changeTime);
		// console.log('----');
		c1.r = (stateTime/changeTime)*d1.r + i1.r;
		c1.g = (stateTime/changeTime)*d1.g + i1.g;
		c1.b = (stateTime/changeTime)*d1.b + i1.b;
		// console.log(c1);
		c2.r = (stateTime/changeTime)*d2.r + i2.r;
		c2.g = (stateTime/changeTime)*d2.g + i2.g;
		c2.b = (stateTime/changeTime)*d2.b + i2.b;
		
		c3.r = (stateTime/changeTime)*d3.r + i3.r;
		c3.g = (stateTime/changeTime)*d3.g + i3.g;
		c3.b = (stateTime/changeTime)*d3.b + i3.b;

		// console.log(c1);
		
		//changing
		if (!change) {
            return;
        } else {
			change = false;
			stateTime = 0;
			
			c1.setAs(t1);
			c2.setAs(t2);
			c3.setAs(t3);
			resetColors(c1, c2, c3);
		}
    }

	return {
		update: _update,
		init: init,
		c1: c1,
		c2: c2,
		c3: c3
	}

}