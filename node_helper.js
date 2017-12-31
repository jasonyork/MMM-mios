/* Magic Mirror
 * Node Helper: MMM-mios
 *
 * By Jason York
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var MiOS = require("mios-client");

module.exports = NodeHelper.create({

	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification);

		if (notification === "SET_CONFIG") {
			this.config = payload
			if (this.config.host) {
				this.mios = new MiOS(this.config.host, (mios) => {
					this.indoorTemperatureDevice = mios.deviceByName(this.config.devices.indoorTemperature)
					this.outdoorTemperatureDevice = mios.deviceByName(this.config.devices.outdoorTemperature)
					this.outdoorHumidityDevice = mios.deviceByName(this.config.devices.outdoorHumidity)
					this.energyDevice = mios.deviceByName(this.config.devices.energy)
				});
			}
		}
		if (notification === "REFRESH") {
			this.refresh()
		}
	},

	refresh: function() {
		if (!this.mios) { return }
		var data = {}
		console.log(this.name + " making mios refresh request");
		this.mios.refresh( () => {
			if (this.indoorTemperatureDevice) {
				var temperature = this.indoorTemperatureDevice.temperature()
				data["indoorTemperature"] = this.convertTemperature(temperature)
			}
			if (this.outdoorTemperatureDevice) {
				var temperature = this.outdoorTemperatureDevice.temperature()
				data["outdoorTemperature"] = this.convertTemperature(temperature)
			}
			if (this.outdoorHumidityDevice) {
				data["outdoorHumidity"] = this.outdoorHumidityDevice.humidity()
			}
			if (this.energyDevice) {
				data["powerConsumption"] = this.energyDevice.watts()
				data["energyUsage"] = this.energyDevice.kWh()
			}
			console.log(this.name + " mios refreshed");
			this.sendSocketNotification("MIOS_UPDATED", data);
		})
	},

	convertTemperature: function(temperature) {
		if (config.units == "imperial" && this.mios.temperatureUnits == "C") {
			temperature = (temperature * (9/5)) + 32
		} else if (config.units == "metric" && this.mios.temperatureUnits == "F") {
			temperature = (temperature - 32) * (5/9)
		}
		return temperature;
	}
});
