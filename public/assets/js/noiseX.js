// ------------------------------------------------------------------------------------------------
// noiseX.js
// version 0.0.1
// Copyright (c) doxas
// ------------------------------------------------------------------------------------------------

function noiseX(oct, ofs, per){
	this.octave = oct;
	this.offset = ofs;
	this.persistence = per;
	this.seed = 1;
	this.detail = function(oct, ofs, per){
		if(!oct || !ofs || !per){return false;}
		if(oct > 1){this.octave = oct;}
		if(ofs > 0){this.offset = ofs;}
		if(per > 0 && per <= 1){this.persistence = per;}
		return true;
	}
	this.setSeed = function(seed){
		this.seed = seed;
	};
	this.interpolate = function(a, b, t){
		return  a * t + b * (1.0 - t);
	};
	this.rnd = function(x, y){
		var a = 123456789;
		var b = a ^ (a << 11);
		var c = this.seed + x + this.seed * y;
		var d = c ^ (c >> 19) ^ (b ^ (b >> 8));
		var e = d % 0x1000000 / 0x1000000;
		e *= 10000000.0;
		return e - Math.floor(e);
	};
	this.srnd = function(x, y){
		var corners = (this.rnd(x - 1, y - 1)
					+  this.rnd(x + 1, y - 1)
					+  this.rnd(x - 1, y + 1)
					+  this.rnd(x + 1, y + 1)) * 0.03125;
		var sides   = (this.rnd(x - 1, y)
					+  this.rnd(x + 1, y)
					+  this.rnd(x,     y - 1)
					+  this.rnd(x,     y + 1)) * 0.0625;
		var center  =  this.rnd(x,     y)      * 0.625;
		return corners + sides + center;
	};
	this.irnd = function(x, y){
		var ix = Math.floor(x);
		var iy = Math.floor(y);
		var fx = x - ix;
		var fy = y - iy;
		var a = this.srnd(ix,     iy);
		var b = this.srnd(ix + 1, iy);
		var c = this.srnd(ix,     iy + 1);
		var d = this.srnd(ix + 1, iy + 1);
		var e = this.interpolate(b, a, fx);
		var f = this.interpolate(d, c, fx);
		return  this.interpolate(f, e, fy);
	};
	this.noise = function(x, y){
		var t = 0;
		var o = this.octave + this.offset;
		var w = Math.pow(2, o);
		for(var i = this.offset; i < o; i++){
			var f = Math.pow(2, i);
			var p = Math.pow(this.persistence, i - this.offset + 1);
			var b = w / f;
			t += this.irnd(x / b, y / b) * p;
		}
		return t;
	};
	this.snoise = function(x, y, w){
		var t, u, v;
		u = x / w;
		v = y / w;
		t = this.noise(x,     y)     *        u  *        v
		  + this.noise(x,     y + w) *        u  * (1.0 - v)
		  + this.noise(x + w, y)     * (1.0 - u) *        v
		  + this.noise(x + w, y + w) * (1.0 - u) * (1.0 - v);
		return t;
	};
	this.canvasExport = function(data, width){
		var cvs = document.createElement('canvas');
		cvs.width = cvs.height = width;
		var ctx = cvs.getContext('2d');
		var cci = ctx.createImageData(width, width);
		for(var i = 0; i < width * width; i++){
			cci.data[i * 4] = cci.data[i * 4 + 1] = cci.data[i * 4 + 2] = data[i] * 255;
			cci.data[i * 4 + 3] = 255;
		}
		ctx.putImageData(cci, 0, 0);
		return cvs;
	};
}
