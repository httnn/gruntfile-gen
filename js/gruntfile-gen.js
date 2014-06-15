angular.module("gruntfile-gen", ["autocomplete"])
.service("Packages", function ($http) {
	return {
		load: function (callback) {
			var t = this;
			$http({ method: "GET", url: "packages/packages.json" })
			.success(function(packages) {
				t.packages = packages;
				$http({ method: "GET", url: "packages/templates.txt"})
				.success(function (templates) {
					var packages = templates.split("#");

					for(var i = 0; i < packages.length; i++) {
						var p = packages[i].trim().split("\n");
						t.packages[p.shift().replace(":", "").trim()].template = p.join("\n");
					}

					callback();
				});
			});
		},
		packages: {}
	};
})
.controller("PackageCtrl", function ($scope, $http, Packages) {
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
		for(option in package.options)
			output = output.replace(new RegExp("\%" + option + "\%"), package.options[option].value);
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