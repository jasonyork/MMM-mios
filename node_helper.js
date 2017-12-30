/* Magic Mirror
 * Node Helper: MMM-mios
 *
 * By Jason York
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var MiOS = require("mios-client");

module.exports = NodeHelper.create({

	start: function() {
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "SET_CONFIG") {
			this.config = payload
			if (this.config.host) {
				this.mios = new MiOS(this.config.host, (mios) => {
					this.indoorTemperatureDevice = this.mios.deviceByName(this.config.devices.indoorTemperature)
					this.outdoorTemperatureDevice = this.mios.deviceByName(this.config.devices.outdoorTemperature)
					this.outdoorHumidityDevice = this.mios.deviceByName(this.config.devices.outdoorHumidity)
					this.energyDevice = this.mios.deviceByName(this.config.devices.energy)
					this.refresh()
				});
			}
		}
		if (notification === "REFRESH") {
			this.refresh()
		}
	},

	refresh: function() {
		if (!this.mios) { return }
		data = {}
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
			this.sendSocketNotification("REFRESH", data);
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
