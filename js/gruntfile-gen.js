angular.module("gruntfile-gen", ["autocomplete"])
.controller("PackageCtrl", function ($scope, $http) {
	$scope.selectedPackages = [];
	$scope.packages = [];
	$scope.settings = {
		title: "My App",
		appVersion: "0.0.1",
		gruntVersion: "0.4.2",
		fileFieldType: "",
		indentation: "tabs",
		spaces: 4,
		getName: function () {
			return this.title.replace(/[^a-z]/gi, "");
		}
	};

	$scope.getPackageFile = function () {
		var output = {
			name: $scope.settings.getName(),
			title: $scope.settings.title,
			version: $scope.settings.appVersion,
			devDependencies: {
				'grunt': $scope.settings.gruntVersion
			}
		};
		for (var i = 0; i < $scope.selectedPackages.length; i++)
			output.devDependencies[$scope.selectedPackages[i].name] = "*";
		
		var tabIndent = $scope.settings.indentation === "tabs";
		return JSON.stringify(output, undefined, tabIndent ? "\t" : Number($scope.settings.spaces));
	};

	$scope.addPackage = function (packageName) {
		$scope.selectedPackages.push($scope.getPackageByName(packageName));
		$scope.selectedPackage = "";
	};

	$scope.removePackage = function (packageName) {
		$scope.selectedPackages.splice($scope.selectedPackages.indexOf($scope.getPackageByName(packageName)), 1);
	};

	$scope.getPackageByName = function (packageName) {
		var m = $scope.packages.filter(function (p) { return p.name === packageName; });
		if(m.length === 1)
			return m[0];

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
		$scope.packages.forEach(function (p) {
			var inSelected = $scope.selectedPackages.some(function (s) {
				return s.name === p.name;
			});

			if(!inSelected)
				output.push(p.name);
		});
		return output;
	};

	$http({ method: "GET", url: "packages/packages.json" })
	.success(function(packages) {
		$scope.packages = packages;
		$scope.names = $scope.getPackageNames();
	});
});