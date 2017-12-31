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
		if (this.config.host) {
			this.sendSocketNotification("SET_CONFIG", this.config);
		}
	},

	getData: function() {
		Log.log(this.name + " sending REFRESH socket request");
		this.sendSocketNotification("REFRESH");
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = ""
		return wrapper;
	},

	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}
		if (notification === "DOM_OBJECTS_CREATED") {
			this.getData();
			setInterval(this.getData, this.config.updateInterval);
		}
	},

	socketNotificationReceived: function (notification, data) {
		Log.log(this.name + " received a socket notification: " + notification);
		if (notification === "MIOS_UPDATED") {
			self = this;
			setTimeout( function() {
				Log.log(this.name + " sending MIOS notifications");
				if (data.indoorTemperature) { self.sendNotification("INDOOR_TEMPERATURE", data.indoorTemperature); }
				if (data.outdoorTemperature) { self.sendNotification("OUTDOOR_TEMPERATURE", data.outdoorTemperature); }
				if (data.outdoorHumidity) { self.sendNotification("OUTDOOR_HUMIDITY", data.outdoorHumidity); }
				if (data.powerConsumption) { self.sendNotification("POWER_CONSUMPTION", data.powerConsumption); }
				if (data.energyUsage) { self.sendNotification("ENERGY_USAGE", data.energyUsage); }
			}, 1000);
		}
	},
});
