var Template = require('underscore').template;
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var commander = require('commander');

var FLUX_DIR, CONSTANTS_DIR, ACTIONS_DIR, STORES_DIR, INDEX_PATH;

if( fs.existsSync('./reactflux.json') ){
	var configs = fs.readFileSync(path.resolve('./reactflux.json')).toString();
	configs = JSON.parse(configs);
	FLUX_DIR = configs.directory;
}
else{
	FLUX_DIR = path.resolve('./flux');
}

CONSTANTS_DIR = FLUX_DIR + '/constants';
ACTIONS_DIR = FLUX_DIR + '/actions';
STORES_DIR = FLUX_DIR + '/stores';
INDEX_PATH = FLUX_DIR + '/index.js';
var DID_INIT_FLUX = fs.existsSync(INDEX_PATH);

function initFluxDirectory(){
	var directories = [
		FLUX_DIR,
		CONSTANTS_DIR,
		ACTIONS_DIR,
		STORES_DIR
	];
	for(var i = 0; i < directories.length; i++){
		if( !fs.existsSync(directories[i]) ){
			log("Creating directory: " + directories[i]);
			fs.mkdirSync(directories[i]);
		}
	}
	if( !fs.existsSync(INDEX_PATH) ){
		var contents = getDefaultIndexFile();
		fs.writeFileSync(INDEX_PATH, contents);
	}
}


function logError(error){
	console.error(error.red);
}

function log(msg){
	console.log(msg.blue);
}

function getTemplate(templateName){
	var templatePath = path.resolve(__dirname + '/templates/' + templateName + '.js');
	var content = fs.readFileSync(templatePath).toString();
	return Template(content);
}

function getFluxFilePaths(name){
	return {
		constants: path.resolve(CONSTANTS_DIR + '/' + name + '.js'),
		actions: path.resolve(ACTIONS_DIR + '/' + name + '.js'),
		store: path.resolve(STORES_DIR + '/' + name + '.js'),
		module: path.resolve(FLUX_DIR + '/' + name + '.js')
	};
}

function getDefaultConstantsFile(name){
	var template = getTemplate('constants');
	return template({
		PREFIX: ", '" + name.toUpperCase() + "'"
	});
}

function getDefaultActionsFile(name){
	var template = getTemplate('actions');
	return template({
		name: name
	});
}

function getDefaultStoreFile(name){
	var template = getTemplate('store');
	return template({
		name: name
	});
}

function getDefaultModuleFile(name){
	var template = getTemplate('module');
	return template({
		name: name
	});
}

function getDefaultIndexFile(){
	var template = getTemplate('index');
	return template();
}


function createFlux(name){
	var fluxPaths = getFluxFilePaths(name);
	if (fs.existsSync(fluxPaths.module)) {
		logError("FILE EXISTS: " + fluxPaths.module);
		return;
	}
	if (fs.existsSync(fluxPaths.constants)) {
		logError("FILE EXISTS: " + fluxPaths.constants);
		return;
	}
	if (fs.existsSync(fluxPaths.actions)) {
		logError("FILE EXISTS: " + fluxPaths.actions);
		return;
	}
	if (fs.existsSync(fluxPaths.store)) {
		logError("FILE EXISTS: " + fluxPaths.store);
		return;
	}
	log("Creating file: " + fluxPaths.module);
	fs.writeFileSync(fluxPaths.module, getDefaultModuleFile(name));
	log("Creating file: " + fluxPaths.constants);
	fs.writeFileSync(fluxPaths.constants, getDefaultConstantsFile(name));
	log("Creating file: " + fluxPaths.actions);
	fs.writeFileSync(fluxPaths.actions, getDefaultActionsFile(name));
	log("Creating file: " + fluxPaths.store);
	fs.writeFileSync(fluxPaths.store, getDefaultStoreFile(name));
	addFluxToIndex(name);
}

function addFluxToIndex(name){
	console.log("ADDING TO INDEX");
	var contents = fs.readFileSync(INDEX_PATH).toString();
	var lines = contents.split("\n");
	var newLines = [];
	for(var i=0, len = lines.length; i < len; i++){
		newLines.push(lines[i]);
		if( lines[i].match('module\\.exports') ){
			newLines.push( "\t" + name + ": require('./" + name + "')," );
		}
	}
	fs.writeFileSync(INDEX_PATH, newLines.join("\n"));
}

function createConstant(filePath, constantName) {
	constantName = constantName.toUpperCase();
	if (!fs.existsSync(filePath)) {
		logError("FILE DOES NOT EXIST: " + filePath);
		return false;
	}
	var fileContents = fs.readFileSync(filePath).toString();
	if (fileContents.match("'" + constantName + "'")) {
		var msg = "ERROR: Constant '" + constantName + "' seems to exists in " + filePath + "";
		logError(msg);
		return false;
	}
	var lines = fileContents.split('\n');
	var newLines = [];
	for (var i = 0, len = lines.length; i < len; i++) {
		var line = lines[i].trim();
		newLines.push(lines[i]);
		if (lines[i].match('createConstants')) {
			var nextLine = lines[i + 1].trim();
			if (nextLine.match('\'')) {
				newLines.push("\t'" + constantName + "',");
			} else {
				newLines.push("\t'" + constantName + "'");
			}
		}
	}
	fs.writeFileSync(filePath, newLines.join("\n"));
	return true;
}

function createAction(filePath, constantName) {
  constantName = constantName.toUpperCase();
  if (!fs.existsSync(filePath)) {
		logError("FILE DOES NOT EXIST: " + filePath);
    return false;
  }
  var ps = constantName.toLowerCase().split('_');
  var actionName = ps[0];
  for(var i=1; i < ps.length; i++){
    actionName += ps[i].charAt(0).toUpperCase() + ps[i].substr(1);
  }
  var fileContents = fs.readFileSync(filePath).toString();
  if (fileContents.match(actionName + ":")) {
		logError("ERROR: Action for '" + constantName + "' seems to exists in " + filePath);
    return false;
  }

  var lines = fileContents.split('\n');
  var newLines = [];
  for (var i = 0, len = lines.length; i < len; i++) {
    newLines.push(lines[i]);
    if (lines[i].match(".createActions")) {
    	var template = getTemplate('action');
    	var contents = template({
    		actionName: actionName,
    		constant: constantName
    	});
      newLines.push(contents);
    }
  }
  fs.writeFileSync(filePath, newLines.join("\n"));
  return true;
}

function createActionHandler(filePath, constantName) {
  constantName = constantName.toUpperCase();
  if (!fs.existsSync(filePath)) {
		logError("FILE DOES NOT EXIST: " + filePath);
    return false;
  }
  var fileContents = fs.readFileSync(filePath).toString();
  var expr = "addActionHandler\\(constants\\." + constantName;
  if ( fileContents.match(expr) ) {
		logError("ERROR: ActionHandler for '" + constantName + "' seems to exists in " + filePath);
    return false;
  }
  var lines = fileContents.split('\n');
  var newLines = [];
  for (var i = 0, len = lines.length; i < len; i++) {
    if (lines[i].match('module\\.exports')) {
    	var template = getTemplate('actionHandler');
    	var handlerContents = template({
    		constant: constantName
    	});
      newLines.push(handlerContents);
    }
    newLines.push(lines[i]);
  }
  fs.writeFileSync(filePath, newLines.join("\n"));
  return true;
}


commander.version('0.0.1');

commander
	.command('init')
	.description('initiates flux')
	.action(function(){
		initFluxDirectory();
	});

commander
	.command('flux <fluxName>')
	.description('Creates a flux group(constants, actions and store)')
	.action(function (fluxName) {
		if( !DID_INIT_FLUX ){
			logError('You did not init flux. run init command');
			return;
		}
  	createFlux(fluxName);
	});

commander
	.command('constant <fluxName> <constant>')
	.option('-a', 'create a corresponding action')
	.option('-s', 'create a corresponding storeActionHandler')
	.description('Creates a constant')
	.action(function (fluxName, constant, opts) {
		if( !DID_INIT_FLUX ){
			logError('You did not init flux. run init command');
			return;
		}
		var paths = getFluxFilePaths(fluxName);
  	if( createConstant(paths.constants, constant) ){
  		log('Created a new constant [' + constant + '] in [' + fluxName + ']');
  	}
  	if( !!opts.A && createAction(paths.actions, constant) ){
  		log('Created an action for constant [' + constant + ']');
  	}
  	if( !!opts.S && createActionHandler(paths.store, constant) ){
  		log('Created an actionHandler for constant [' + constant + ']');
  	}
	});

commander.on('--help', function(){
	console.log('  Options for constant creation:');
	console.log('    -a: creates a corresponding action');
	console.log('    -h: creates a corresponding storeActionHandler');
	console.log('');
	console.log("  Examples:");
	var progName = module.parent.filename.split('/').pop();
	console.log("    Init flux directory:");
	console.log("      ./" + progName + ' init\n');
	console.log("    Create user flux group:");
	console.log("      ./" + progName + ' flux user\n');
	console.log("    Create a constant[LOAD] for user group:");
	console.log("      ./" + progName + ' constant user LOAD\n');
	console.log("    Create a constant[LOAD] for user group along with a corresponding action:");
	console.log("      ./" + progName + ' constant -a user LOAD\n');
	console.log("    Create a constant[LOAD] for user group along with a corresponding store handler:");
	console.log("      ./" + progName + ' constant -s user LOAD\n');
	console.log("    Create a constant[LOAD] for user group along with corresponding action and store handler:");
	console.log("      ./" + progName + ' constant -as user LOAD\n');
});

commander.parse(process.argv);
