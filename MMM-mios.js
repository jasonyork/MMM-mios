/* Magic Mirror
 * Module: MMM-mios
 *
 * By Jason York
 * MIT Licensed.
 */

Module.register("MMM-mios",{

	defaults: {
		updateInterval: 10 * 60 * 1000
	},

/*
	exampleConfig: {
		host: "http://vera:3480"
		devices: {
			indoorTemperature: "Thermostat",
			energy: "Home Energy Monitor 3 1"
			}
		}
	}
*/

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		this.miosData = {};
		if (this.config.host) {
			this.sendSocketNotification('SET_CONFIG', this.config);
			setInterval(function() {
				self.getData();
			}, this.config.updateInterval);
		}
	},

	getData: function() {
		this.sendSocketNotification("REFRESH");
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		// console.log(this.miosData);
		wrapper.innerHTML = ""
		// if (this.miosData['indoorTemperature']) {
		// 	wrapper.innerHTML += 'temp: ' + this.miosData['indoorTemperature'] + '<br>'
		// }
		// if (this.miosData['powerConsumption']) {
		// 	wrapper.innerHTML += 'power: ' + this.miosData['powerConsumption'] + '<br>'
		// }
		// if (this.miosData['energyUsage']) {
		// 	wrapper.innerHTML += 'energy: ' + this.miosData['energyUsage'] + '<br>'
		// }
		return wrapper;
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "REFRESH") {
			this.miosData = data;
			if (data.indoorTemperature) this.sendNotification("INDOOR_TEMPERATURE", data.indoorTemperature);
			if (data.powerConsumption) this.sendNotification("POWER_CONSUMPTION", data.powerConsumption);
			if (data.energyUsage) this.sendNotification("ENERGY_USAGE", data.energyUsage);
			this.updateDom();
		}
	},
});
