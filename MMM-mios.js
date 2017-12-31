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
		if (this.config.host) {
			this.sendSocketNotification("SET_CONFIG", this.config);
		}
	},

	getData: function() {
		this.sendSocketNotification("REFRESH");
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = ""
		return wrapper;
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "DOM_OBJECTS_CREATED") {
			setInterval(function() {
				self.getData();
			}, this.config.updateInterval);
		}
		if (notification === "MIOS_UPDATED") {
			if (data.indoorTemperature) { this.sendNotification("INDOOR_TEMPERATURE", data.indoorTemperature); }
			if (data.outdoorTemperature) { this.sendNotification("OUTDOOR_TEMPERATURE", data.outdoorTemperature); }
			if (data.outdoorHumidity) { this.sendNotification("OUTDOOR_HUMIDITY", data.outdoorHumidity); }
			if (data.powerConsumption) { this.sendNotification("POWER_CONSUMPTION", data.powerConsumption); }
			if (data.energyUsage) { this.sendNotification("ENERGY_USAGE", data.energyUsage); }
			this.updateDom();
		}
	},
});
