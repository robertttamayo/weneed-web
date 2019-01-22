function Color(r, g, b, a) {

	var r = r;
	var g = g;
	var b = b;
	var a = a;

    var setAs = function(color) {
        r = color.r;
        g = color.g;
        b = color.b;
        a = color.a;
	}
	return {
		r: r,
		g: g,
		b: b,
		a: a,
		setAs: setAs
	}
}
function TriColorChanger(c1, c2, c3) {	

        // c1 = new Color();
        // c2 = new Color();
        // c3 = new Color();
        // t1 = new Color();
        // t2 = new Color();
        // t3 = new Color();
        // i1 = new Color();
        // i2 = new Color();
        // i3 = new Color();
        d1 = new Color(1, 1, 1, 1);
        d2 = new Color(1, 1, 1, 1);
        d3 = new Color(1, 1, 1, 1);
        c1 = new Color(1, 1, 1, 1);
        c2 = new Color(1, 1, 1, 1);
        c3 = new Color(1, 1, 1, 1);
        var s1, s2, s3;

        changeTime = 4;
	    stateTime = 0;
        change = false;
		
		c1.setAs(c1);
		c2.setAs(c2);
		c3.setAs(c3);

		console.log('c1.r: ' + c1.r);
        // c1 = new Color(c1.r, c1.g, c1.b, c1.a);
		// c2 = new Color(c2.r, c2.g, c2.b, c2.a);
		// c3 = new Color(c3.r, c3.g, c3.b, c3.a);
		
		i1 = new Color(c1.r, c1.g, c1.b, 1);
		i2 = new Color(c2.r, c2.g, c2.b, 1);
		i3 = new Color(c3.r, c3.g, c3.b, 1);
		
		t1 = new Color(c2.r, c2.g, c2.b, 1);
		t2 = new Color(c3.r, c3.g, c3.b, 1);
		t3 = new Color(c1.r, c1.g, c1.b, 1);
		
 
		console.log(c1);
		console.log(c2);
		console.log(c3);
    
	
	this.resetColors = function(c1, c2, c3){
		c1 = c1;
		c2 = c2;
		c3 = c3;
		
		i1.setAs(c1);
		i2.setAs(c2);
		i3.setAs(c3);
		
		t1.setAs(c2);
		t2.setAs(c3);
		t3.setAs(c1);
		
		init();
	}
	this.init = function(){
		d1.r = t1.r - i1.r;
		d1.g = t1.g - i1.g;
		d1.b = t1.b - i1.b;
		
		d2.r = t2.r - i2.r;
		d2.g = t2.g - i2.g;
		d2.b = t2.b - i2.b;
		
		d3.r = t3.r - i3.r;
		d3.g = t3.g - i3.g;
		d3.b = t3.b - i3.b;
	}

	this.update = function(delta){
		// console.log(delta);
		stateTime += delta;
		if (stateTime > changeTime) {
			stateTime = changeTime;
			change = true;
		}

		c1.r = (stateTime/changeTime)*d1.r + i1.r;
		c1.g = (stateTime/changeTime)*d1.g + i1.g;
		c1.b = (stateTime/changeTime)*d1.b + i1.b;
		
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
        }
		change = false;
        stateTime = 0;
        
		c1.setAs(t1);
		c2.setAs(t2);
		c3.setAs(t3);
		resetColors(c1, c2, c3);
    }


}