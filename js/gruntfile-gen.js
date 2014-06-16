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
					var templates = templates.split("#");

					for(var i = 0; i < templates.length; i++) {
						var p = templates[i].trim().split("\n");
						t.packages[p.shift().replace(":", "").trim()].template = p.join("\n\t\t\t");
					}

					for(packageName in t.packages) {
						var package = t.packages[packageName];
						package.options.version = {
							name: "Version",
							value: "*",
							description: "* = latest version."
						};
						if(!package.options.src) {
							package.options.src = {
								name: "Source files",
								value: "",
								description: "Specify the source file(s) as a single file or multiple files in an array.",
								placeholder: "'list', 'of', 'files'"
							};
						}

						if(!package.options.dest) {
							package.options.dest = {
								name: "Destination files",
								value: "",
								description: "Specify the single destination file.",
								placeholder: "destination.js"
							};
						}

						if(package.type === "i")
							delete package.options.dest;
						else if(package.type === "o")
							delete package.options.src;
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