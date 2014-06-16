angular.module("gruntfile-gen", ["autocomplete"])
.service("Packages", function ($http) {
	return {
		load: function (callback) {
			var t = this;
			$http({ method: "GET", url: "packages/packages.json" })
			.success(function(packages) {
				t.packages = packages;
				callback();
			});
		},
		packages: []
	};
})
.controller("PackageCtrl", function ($scope, $http, Packages) {
	$scope.selectedPackages = [];
	$scope.packages = [];
	$scope.settings = {
		title: "My App",
		appVersion: "0.0.1",
		gruntVersion: "0.4.2",
		fileFieldType: "",
		indentation: "tabs",
		getName: function () {
			return this.title.replace(/[^a-z]/gi, "");
		}
	};

	$scope.addPackage = function (packageName) {
		$scope.selectedPackages.push($scope.getPackageByName(packageName));
	};

	$scope.removePackage = function (packageName) {
		$scope.selectedPackages.splice($scope.selectedPackages.indexOf($scope.getPackageByName(packageName)), 1);
	};

	$scope.getPackageByName = function (packageName) {
		for (var i = 0; i < $scope.packages.length; i++) {
			if($scope.packages[i].name === packageName)
				return $scope.packages[i];
		}
		return null;
	};

	$scope.saveGruntfile = function () {
		var content = document.getElementById("gruntfile").textContent;
		saveAs(new Blob([content], {type: "text/plain;charset=utf-8"}), "Gruntfile.js");
	};

	$scope.savePackage = function () {
		var content = document.getElementById("package").textContent;
		saveAs(new Blob([content], {type: "text/plain;charset=utf-8"}), "package.json");
	};

	$scope.getTaskName = function (packageName) {
		var p = packageName.split("-");
		return p[p.length - 1];
	};

	$scope.getPackageNames = function () {
		var output = [];
		for(var i = 0; i < $scope.packages.length; i++) {
			output.push($scope.packages[i].name);
		}
		return output;
	};

	Packages.load(function () {
		$scope.packages = Packages.packages;
		$scope.names = $scope.getPackageNames();
	});
});