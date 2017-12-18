/*jshint esversion: 6 */

fpLayout = {
	set: function(data, json, clear) {
		'use strict';
		data = this.attachJSON(data, json, clear);
		data = this.nestedTemplates(data, clear);
		data = this.removeEmpty(data);
		return data;
		},

	attachJSON: function(data, json, clear) {
		if(!json) return data;
		// Clear placeholders
		if(clear){
			let arr = [];
			let patt= /{(.*?)}([\s\S]*?){\/(.*?)}/gm;
			let fractions = {};
			while((arr = patt.exec(data)) !== null){
				data = data.replace(arr[2], '');
				}
			}
		for(let i in json) {
			let patt=new RegExp('{'+i+'}','gm');
			if(data.match(patt) !== null) {
				data = data.replace(patt, json[i]);
				}
			}
		return data;
		},

	getFractions: function(data){
		'use strict';

		let patt= /{fraction:(.*?)}([\s\S]*?){\/fraction}/gm;
		let arr = [];
		let fractions = {};
		while((arr = patt.exec(data)) !== null){
			fractions[arr[1]] = arr[2];
			}
		return fractions;
		},

	nestedTemplates: function(data){
		'use strict';

		let patt=new RegExp(/\{template\/(.*?)\}/gm);
		let results=data.match(patt);
		for (let i in results){
			let layout = results[i];
			let templateData = layout.toString().replace(/(\{|\})/g,"").split("/");
			let template = templateData[1];
			let params = templateData[2];
			}
		return data;
		},

// Remove empty brackets
	removeEmpty: function(data) {
		'use strict';

		// remove fractions
		let patt= /{fraction:(.*?)}([\s\S]*?){\/fraction}/gm;
		let arr = [];
		let fractions = {};
		while((arr = patt.exec(data)) !== null){
			data = data.replace(patt, '');
			}

		let ptrn=new RegExp(/\{(.*?)\}/gm);
		if(data.match(ptrn) !== null) {
			return data.replace(ptrn, '');
			}
		return data;
		}
	};
