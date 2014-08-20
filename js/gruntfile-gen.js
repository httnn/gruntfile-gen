angular.module("gruntfile-gen", ["autocomplete"])
.controller("PackageCtrl", ['$scope', '$http', function ($scope, $http) {
	$scope.selectedPackages = [];
	$scope.packages = [];

	$scope.settings = {
		title: "My App",
		appVersion: "0.0.1",
		gruntVersion: "0.4.5",
		fileFieldType: "",
		indentation: "tabs",
		spaces: 4,
		fileFormat: "compact",
		getName: function () { return this.title.replace(/[^a-z]/gi, ""); }
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

	$scope.getGruntfile = function () {
		var output = "module.exports = function(grunt) {\n\tgrunt.initConfig({\n\t\tpkg: grunt.file.readJSON('package.json'),\n";
		$scope.selectedPackages.forEach(function (p, i) {
			var formats = {
				"compact": "src: ['source'], \n\t\t\t\tdest: 'destination'",
				"object": "'destination': ['source']",
				"array": "files: [\n\t\t\t\t\t { src: ['source'], dest: 'destination' }\n\t\t\t\t]"
			};

			var options = "";
			p.options.forEach(function (option, i) {
				option = option.split(":");
				var comma = i === p.options.length - 1 ? "" : ",\n";
				options += "\t\t\t\t'" + option[0] + "': " + option[1] + comma;
			});

			var comma = i === $scope.selectedPackages.length - 1 ? "" : ",";
			output += "\t\t" + $scope.getTaskName(p.name) + ": {\n\t\t\ttask: {\n\t\t\t\t" + formats[$scope.settings.fileFormat] + "\n\t\t\t},\n\t\t\toptions: {\n" + options + "\n\t\t\t}\n\t\t}" + comma + "\n";
		});
		output += "\t});\n\n";
		
		$scope.selectedPackages.forEach(function (p) {
			output += "\tgrunt.loadNpmTasks('" + p.name + "');\n";
		});
		output += "\n\tgrunt.registerTask('default', [";

		$scope.selectedPackages.forEach(function (p, i) {
			var comma = i === $scope.selectedPackages.length - 1 ? "" : ", ";
			output += "'" + $scope.getTaskName(p.name) + "'" + comma;
		});

		output += "]);\n};"
		return $scope.settings.indentation === "spaces" ? output.replace(/\t/g, "          ".substring(0, $scope.settings.spaces)) : output;
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
		saveAs(new Blob([$scope.getGruntfile()], {type: "text/plain;charset=utf-8"}), "Gruntfile.js");
	};

	$scope.savePackage = function () {
		saveAs(new Blob([$scope.getPackageFile()], {type: "text/plain;charset=utf-8"}), "package.json");
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

	$scope.updateNames = function () {
		$scope.names = $scope.getPackageNames();
	};


	$http({ method: "GET", url: "packages.json" })
	.success(function(packages) {
		$scope.packages = packages;
		$scope.names = $scope.getPackageNames();
	});
}]);

Array.prototype.move = function (old_index, new_index) {
    if (new_index < this.length || new_index > -1)
    	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this;
};