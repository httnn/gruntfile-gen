angular.module("gruntfile-gen", ["autocomplete"])
.service("Packages", function ($http) {
	return {
		load: function (callback) {
			var t = this;
			$http({ method: "GET", url: "js/packages.json" })
			.success(function(data) {
				t.packages = data;
				callback();
			});
		},
		packages: {}
	};
})
.controller("PackageCtrl", function ($scope, Packages) {
	$scope.packages = {};
	$scope.names = {};

	$scope.selectedPackages = {};

	$scope.addPackage = function (package) {
		$scope.selectedPackages[package] = $scope.packages[package];
		$scope.selectedPackage = "";
	};

	$scope.removePackage = function (name) {
		delete $scope.selectedPackages[name];
	};

	$scope.makeTemplate = function (package) {
		var output = package.template;
		for(option in package.options) {
			output = output.replace(new RegExp("\%" + option + "\%"), package.options[option].value);
		}
		return output;
	};

	$scope.saveGruntfile = function () {
		var content = document.getElementById("gruntfile").textContent;
		saveAs(new Blob([content], {type: "text/plain;charset=utf-8"}), "Gruntfile.js");
	};

	$scope.savePackage = function () {
		var content = document.getElementById("package").textContent;
		saveAs(new Blob([content], {type: "text/plain;charset=utf-8"}), "package.json");
	};

	Packages.load(function () {
		$scope.packages = Packages.packages;
		$scope.names = Object.keys(Packages.packages);
	});
});